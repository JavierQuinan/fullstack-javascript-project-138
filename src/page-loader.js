import axios from "axios";
import { promises as fs } from "fs";
import path from "path";
import { URL } from "url";

/**
 * Genera un nombre de archivo válido basado en la URL.
 * @param {string} websiteUrl - URL de la página.
 * @returns {string} - Nombre de archivo formateado correctamente.
 */
const generateFilename = (websiteUrl) => {
  const parsedUrl = new URL(websiteUrl);

  // 🔹 Eliminar el protocolo (https:// o http://)
  let cleanUrl = `${parsedUrl.hostname}${parsedUrl.pathname}`;

  // 🔹 Reemplazar todos los caracteres que no sean letras o números por '-'
  cleanUrl = cleanUrl.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+$/, "");

  // 🔹 Agregar extensión .html al final
  return `${cleanUrl}.html`;
};

/**
 * Descarga una página web y la guarda en un directorio especificado.
 * @param {string} websiteUrl - URL de la página a descargar.
 * @param {string} outputDir - Directorio donde guardar el archivo.
 * @returns {Promise<string>} - Ruta completa del archivo guardado.
 */
const pageLoader = async (websiteUrl, outputDir = process.cwd()) => {
  try {
    const filename = generateFilename(websiteUrl);
    const filePath = path.join(outputDir, filename);

    // 🔹 Descargar la página
    const response = await axios.get(websiteUrl);
    await fs.writeFile(filePath, response.data, "utf-8");

    return filePath;
  } catch (error) {
    throw new Error(`Error al descargar la página: ${error.message}`);
  }
};

export default pageLoader;

