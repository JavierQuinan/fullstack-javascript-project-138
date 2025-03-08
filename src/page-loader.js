import axios from "axios";
import { promises as fs } from "fs";
import path from "path";
import { URL } from "url";
import * as cheerio from "cheerio";

/**
 * Genera un nombre de archivo válido basado en la URL.
 * @param {string} resourceUrl - URL del recurso.
 * @returns {string} - Nombre de archivo formateado correctamente.
 */
const generateResourceFilename = (resourceUrl) => {
  const parsedUrl = new URL(resourceUrl);
  const extension = path.extname(parsedUrl.pathname);
  let cleanUrl = `${parsedUrl.hostname}${parsedUrl.pathname}`
    .replace(extension, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/-$/, "");

  return cleanUrl + extension;
};

/**
 * Genera el nombre del directorio de recursos (`*_files`).
 * @param {string} websiteUrl - URL de la página.
 * @returns {string} - Nombre del directorio de recursos.
 */
const generateAssetsDirName = (websiteUrl) => {
  return generateResourceFilename(websiteUrl).replace(".html", "_files"); // ✅ Se asegura que termine en `_files`
};

/**
 * Descarga un recurso (CSS, JS, Imagen) y lo guarda en un directorio.
 * @param {string} resourceUrl - URL del recurso.
 * @param {string} outputDir - Directorio donde guardar el archivo.
 * @param {string} baseUrl - URL base de la página.
 * @returns {Promise<string | null>} - Ruta del archivo guardado o `null` si falla.
 */
const downloadResource = (resourceUrl, outputDir, baseUrl) => {
  const absoluteUrl = new URL(resourceUrl, baseUrl).href;
  const filename = generateResourceFilename(absoluteUrl);
  const filePath = path.join(outputDir, filename);

  return axios({
    method: "get",
    url: absoluteUrl,
    responseType: "arraybuffer",
  })
    .then((response) => fs.writeFile(filePath, response.data).then(() => filePath))
    .catch((error) => {
      console.error(`Error descargando recurso ${resourceUrl}: ${error.message}`);
      return null;
    });
};

/**
 * Descarga una página web y todos sus recursos locales.
 * @param {string} websiteUrl - URL de la página a descargar.
 * @param {string} outputDir - Directorio donde guardar los archivos.
 * @returns {Promise<string>} - Ruta completa del archivo HTML guardado.
 */
const pageLoader = (websiteUrl, outputDir = process.cwd()) => {
    const parsedWebsiteUrl = new URL(websiteUrl);
    const htmlExtension = path.extname(parsedWebsiteUrl.pathname) || ".html";
    const baseFilename = generateResourceFilename(websiteUrl).replace(htmlExtension, "");
    const htmlFilename = `${baseFilename}.html`;
    const filePath = path.join(outputDir, htmlFilename);
    const assetsDir = path.join(outputDir, `${baseFilename}_files`); // Asegurar que es `${baseFilename}_files`
  
    return axios
      .get(websiteUrl)
      .then((response) => fs.mkdir(assetsDir, { recursive: true }).then(() => response.data))
      .then((html) => {
        const $ = cheerio.load(html);
        const selectors = ["img", "link[rel='stylesheet']", "script[src]"];
        const resourcePromises = [];
        const elements = [];
  
        selectors.forEach((selector) => {
          $(selector).each((_, element) => {
            const tagName = element.name;
            const attr = tagName === 'link' ? 'href' : 'src';
            const resourceUrl = $(element).attr(attr);
  
            if (resourceUrl && new URL(resourceUrl, websiteUrl).origin === parsedWebsiteUrl.origin) {
              elements.push({ element, attr });
              const resourcePromise = downloadResource(resourceUrl, assetsDir, websiteUrl);
              resourcePromises.push(resourcePromise);
            }
          });
        });
  
        return Promise.all(resourcePromises).then((resourcePaths) => {
          resourcePaths.forEach((resourcePath, index) => {
            if (resourcePath) {
              // Normalizar la ruta para usar siempre /
              const relativePath = path.relative(path.dirname(filePath), resourcePath)
                .replace(/\\/g, '/'); // Reemplazar backslashes en Windows
              $(elements[index].element).attr(elements[index].attr, relativePath);
            }
          });
          return $.html();
        });
      })
      .then((updatedHtml) => fs.writeFile(filePath, updatedHtml, "utf-8"))
      .then(() => filePath)
      .catch((error) => {
        throw new Error(`Error al descargar la página: ${error.message}`);
      });
  };

export default pageLoader;
