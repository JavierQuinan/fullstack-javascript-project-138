import axios from "axios";
import { promises as fs } from "fs";
import path from "path";
import { URL } from "url";
import * as cheerio from "cheerio";

/**
 * Genera un nombre de archivo válido basado en la URL.
 * @param {string} websiteUrl - URL de la página.
 * @returns {string} - Nombre de archivo formateado correctamente.
 */
const generateFilename = (websiteUrl) => {
  const parsedUrl = new URL(websiteUrl);
  let cleanUrl = `${parsedUrl.hostname}${parsedUrl.pathname}`
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+$/, "");

  return `${cleanUrl}.html`;
};

/**
 * Descarga y guarda una imagen en el directorio especificado.
 * @param {string} imgUrl - URL de la imagen.
 * @param {string} outputDir - Directorio de salida.
 * @param {string} baseUrl - URL base de la página.
 * @returns {Promise<string>} - Ruta del archivo de imagen descargado.
 */
const downloadImage = (imgUrl, outputDir, baseUrl) => {
  const absoluteUrl = new URL(imgUrl, baseUrl).href;
  const imageExt = path.extname(imgUrl); // Extrae la extensión del archivo (.png, .jpg, etc.)
  const imageName = absoluteUrl
  .replace(/^https?:\/\//, "") // Elimina https:// o http://
  .replace(/\.[a-zA-Z0-9]+$/, "") // Elimina la extensión del archivo temporalmente
  .replace(/[^a-zA-Z0-9]/g, "-") // Reemplaza caracteres inválidos
  + imageExt; // Vuelve a agregar la extensión original

  
  const imagePath = path.join(outputDir, imageName);

  return axios({
    method: "get",
    url: absoluteUrl,
    responseType: "arraybuffer",
  })
    .then((response) => fs.writeFile(imagePath, response.data))
    .then(() => imagePath)
    .catch((error) => console.error(`Error descargando imagen ${imgUrl}: ${error.message}`));
};

/**
 * Descarga una página web y sus imágenes asociadas.
 * @param {string} websiteUrl - URL de la página a descargar.
 * @param {string} outputDir - Directorio donde guardar la página y recursos.
 * @returns {Promise<string>} - Ruta completa del archivo HTML guardado.
 */
const pageLoader = (websiteUrl, outputDir = process.cwd()) => {
  const filename = generateFilename(websiteUrl);
  const filePath = path.join(outputDir, filename);
  const assetsDir = filePath.replace(".html", "_files");

  return axios
    .get(websiteUrl)
    .then((response) => {
      return fs.mkdir(assetsDir, { recursive: true }).then(() => response.data);
    })
    .then((html) => {
      const $ = cheerio.load(html);

      const imagePromises = $("img").map((_, img) => {
        const imgSrc = $(img).attr("src");
        if (imgSrc) {
          return downloadImage(imgSrc, assetsDir, websiteUrl).then((imgPath) => {
            $(img).attr("src", path.relative(outputDir, imgPath));
          });
        }
      }).get();

      return Promise.all(imagePromises).then(() => $.html());
    })
    .then((updatedHtml) => fs.writeFile(filePath, updatedHtml, "utf-8"))
    .then(() => filePath)
    .catch((error) => {
      throw new Error(`Error al descargar la página: ${error.message}`);
    });
};

export default pageLoader;

