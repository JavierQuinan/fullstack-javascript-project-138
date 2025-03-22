import axios from 'axios';
import { promises as fs, constants } from 'fs';
import path from 'path';
import { URL } from 'url';
import Listr from 'listr';
import * as cheerio from 'cheerio';
import debug from 'debug';
import { getResourceFileName } from './utils.js';

const log = debug('page-loader');

const getFileNameFromUrl = (url) => {
  const { hostname, pathname } = new URL(url);
  const cleanPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const fullPath = path.join(hostname, cleanPath);
  return fullPath.replace(/[^a-zA-Z0-9]/g, '-');
};

const isLocalResource = (link) => {
  return link && !link.startsWith('http') && !link.startsWith('//') && !link.startsWith('data:');
};

const pageLoader = async (url, outputDir = process.cwd()) => {
  try {
    // Verifica si el directorio existe
    try {
      await fs.access(outputDir, constants.W_OK);
    } catch (error) {
      if (error.code === 'EACCES') {
        throw new Error(`Permiso denegado al intentar escribir en el directorio: ${outputDir}`);
      }
      throw error;
    }
    

    log(`Iniciando descarga de: ${url}`);
    log('Enviando solicitud HTTP para obtener el HTML...');
    const response = await axios.get(url);
    const html = response.data;
    log('Página descargada correctamente');

    const htmlFileName = getFileNameFromUrl(url);
    const resourcesFolderName = `${htmlFileName}_files`;
    const resourcesDir = path.join(outputDir, resourcesFolderName);
    const htmlFilePath = path.join(outputDir, `${htmlFileName}.html`);

    log(`Creando carpeta de recursos en: ${resourcesDir}`);
    await fs.mkdir(resourcesDir, { recursive: true });
    log('Iniciando descarga de recursos locales...');

    const $ = cheerio.load(html);
    const resources = [];

    $('link[href], script[src], img[src]').each((_, element) => {
      const tag = element.name;
      const attr = tag === 'link' ? 'href' : 'src';
      const src = $(element).attr(attr);

      if (isLocalResource(src)) {
        const resourceUrl = new URL(src, url).href;
        const resourceName = getResourceFileName(url, src);
        const resourcePath = path.join(resourcesDir, resourceName);

        resources.push({
          title: `Descargando recurso: ${src}`,
          task: async () => {
            const res = await axios.get(resourceUrl, { responseType: 'arraybuffer' });
            await fs.writeFile(resourcePath, res.data);
            $(element).attr(attr, path.join(resourcesFolderName, resourceName));
          }
        });
      }
    });

    const tasks = new Listr(resources, { concurrent: true });
    await tasks.run();

    const updatedHtml = $.html();
    await fs.writeFile(htmlFilePath, updatedHtml);
    log(`Archivo HTML guardado en: ${htmlFilePath}`);
    return htmlFilePath;

  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Error HTTP 404 al intentar acceder a ${url}`);
    }
    if (error.code === 'EACCES') {
      throw new Error(`Permiso denegado al intentar escribir en el directorio: ${outputDir}`);
    }
    throw error;
  }
};

export default pageLoader;
