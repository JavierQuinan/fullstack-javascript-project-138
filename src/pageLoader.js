import path from 'path';
import fs from 'fs/promises';
import axios from 'axios';
import { URL } from 'url';
import debug from 'debug';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Listr from 'listr';
import * as cheerio from 'cheerio';

const log = debug('page-loader');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFileNameFromUrl = (url) => {
  const { host, pathname } = new URL(url);
  const cleanPath = pathname === '/' ? '' : pathname;
  const name = `${host}${cleanPath}`.replace(/[^a-zA-Z0-9]/g, '-');
  return `${name}.html`;
};

const getResourcesFolderName = (url) => {
  const { host, pathname } = new URL(url);
  const cleanPath = pathname === '/' ? '' : pathname;
  const name = `${host}${cleanPath}`.replace(/[^a-zA-Z0-9]/g, '-');
  return `${name}_files`;
};

const isLocalResource = (link) => {
  const url = new URL(link, 'https://example.com');
  return url.origin === 'https://example.com';
};

const buildResourceName = (baseUrl, resourceUrl) => {
  const fullUrl = new URL(resourceUrl, baseUrl);
  const { host, pathname } = fullUrl;
  const name = `${host}${pathname}`.replace(/[^a-zA-Z0-9]/g, '-');
  return name;
};

const downloadResource = async (resourceUrl, baseUrl, outputPath) => {
  const fullUrl = new URL(resourceUrl, baseUrl).toString();
  const resourceName = buildResourceName(baseUrl, resourceUrl);
  const filePath = path.join(outputPath, resourceName);

  try {
    const response = await axios.get(fullUrl, { responseType: 'arraybuffer' });
    await fs.writeFile(filePath, response.data);
    return { resourceUrl, savedPath: filePath };
  } catch (error) {
    throw new Error(`Error al descargar el recurso ${fullUrl}: ${error.message}`);
  }
};

const updateHtmlLinks = ($, baseUrl, resourcesDirName) => {
  const tags = [
    { tag: 'img', attr: 'src' },
    { tag: 'link', attr: 'href' },
    { tag: 'script', attr: 'src' },
  ];

  const links = [];

  tags.forEach(({ tag, attr }) => {
    $(tag).each((_, element) => {
      const originalLink = $(element).attr(attr);
      if (originalLink && isLocalResource(originalLink)) {
        const resourceName = buildResourceName(baseUrl, originalLink);
        $(element).attr(attr, path.join(resourcesDirName, resourceName));
        links.push(originalLink);
      }
    });
  });

  return links;
};

const pageLoader = async (url, outputDir = process.cwd()) => {
  log(`Iniciando descarga de: ${url}`);

  // 🔧 Crear el directorio si no existe
  await fs.mkdir(outputDir, { recursive: true });

  const htmlFileName = getFileNameFromUrl(url);
  const htmlPath = path.join(outputDir, htmlFileName);

  const resourcesFolderName = getResourcesFolderName(url);
  const resourcesDir = path.join(outputDir, resourcesFolderName);

  try {
    log('Enviando solicitud HTTP para obtener el HTML...');
    const response = await axios.get(url);
    log('Página descargada correctamente');

    log(`Creando carpeta de recursos en: ${resourcesDir}`);
    await fs.mkdir(resourcesDir, { recursive: true });

    log('Iniciando descarga de recursos locales...');
    const $ = cheerio.load(response.data);
    const resourceLinks = updateHtmlLinks($, url, resourcesFolderName);

    const tasks = new Listr(
      resourceLinks.map((link) => ({
        title: `Descargando recurso: ${link}`,
        task: () => downloadResource(link, url, resourcesDir),
      })),
      { concurrent: true }
    );

    await tasks.run();

    log(`Guardando HTML en: ${htmlPath}`);
    await fs.writeFile(htmlPath, $.html());
    log(`Archivo HTML guardado en: ${htmlPath}`);

    return htmlPath;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Error HTTP 404 al intentar acceder a ${url}`);
    }
    if (error.code === 'EACCES') {
      throw new Error(`Permiso denegado al intentar escribir en el directorio: ${outputDir}`);
    }
    throw new Error(`Error general: ${error.message}`);
  }
};

export default pageLoader;
