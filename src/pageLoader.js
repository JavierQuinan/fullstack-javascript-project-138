import { promises as fs, constants } from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { mkdir, access } from 'fs/promises';
import Listr from 'listr';
import debugLib from 'debug';

const debug = debugLib('page-loader');

const getFileNameFromUrl = (url) => {
  const { hostname, pathname } = new URL(url);
  const cleanPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const fullPath = path.join(hostname, cleanPath);
  return `${fullPath.replace(/[^a-zA-Z0-9]/g, '-')}.html`;
};

const getResourceName = (url) => {
  const { hostname, pathname } = new URL(url);
  return `${path.join(hostname, pathname).replace(/[^a-zA-Z0-9]/g, '-')}`;
};

const isLocalResource = (link, baseUrl) => {
  try {
    const url = new URL(link, baseUrl);
    return url.origin === new URL(baseUrl).origin;
  } catch {
    return false;
  }
};

const downloadResource = async (resourceUrl, outputPath) => {
  const response = await axios.get(resourceUrl, { responseType: 'stream' });
  await pipeline(response.data, createWriteStream(outputPath));
};

const pageLoader = async (url, outputDir = process.cwd()) => {
  debug(`Iniciando descarga de: ${url}`);

  try {
    await access(outputDir, constants.F_OK);
  } catch {
    throw new Error(`El directorio ${outputDir} no existe`);
  }

  const htmlFileName = getFileNameFromUrl(url);
  const resourcesDirName = htmlFileName.replace(/\.html$/, '_files');
  const resourcesDirPath = path.join(outputDir, resourcesDirName);
  const htmlFilePath = path.join(outputDir, htmlFileName);

  debug('Enviando solicitud HTTP para obtener el HTML...');
  let response;
  try {
    response = await axios.get(url);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Error HTTP 404 al intentar acceder a ${url}`);
    }
    throw error;
  }

  debug('Página descargada correctamente');

  const $ = cheerio.load(response.data);
  const resourceTags = [
    { tag: 'link', attr: 'href' },
    { tag: 'script', attr: 'src' },
    { tag: 'img', attr: 'src' },
  ];

  const resources = [];
  resourceTags.forEach(({ tag, attr }) => {
    $(tag).each((_, el) => {
      const resourceUrl = $(el).attr(attr);
      if (resourceUrl && isLocalResource(resourceUrl, url)) {
        resources.push({ tag, attr, resourceUrl });
      }
    });
  });

  debug(`Creando carpeta de recursos en: ${resourcesDirPath}`);
  await mkdir(resourcesDirPath, { recursive: true });
  debug('Iniciando descarga de recursos locales...');

  const tasks = new Listr(
    resources.map(({ resourceUrl }) => {
      const fullUrl = new URL(resourceUrl, url).href;
      const resourceFileName = getResourceName(fullUrl);
      const resourceFilePath = path.join(resourcesDirPath, resourceFileName);

      return {
        title: `Descargando recurso: ${resourceUrl}`,
        task: () => downloadResource(fullUrl, resourceFilePath),
      };
    }),
    { concurrent: true }
  );

  await tasks.run();

  const updatedHtml = $.html();
  resources.forEach(({ resourceUrl }) => {
    const fullUrl = new URL(resourceUrl, url).href;
    const resourceFileName = getResourceName(fullUrl);
    const newPath = path.join(resourcesDirName, resourceFileName);
    resourceTags.forEach(({ tag, attr }) => {
      $(tag).each((_, el) => {
        if ($(el).attr(attr) === resourceUrl) {
          $(el).attr(attr, newPath);
        }
      });
    });
  });

  debug(`Guardando HTML en: ${htmlFilePath}`);
  await fs.writeFile(htmlFilePath, $.html());
  debug(`Archivo HTML guardado en: ${htmlFilePath}`);

  return htmlFilePath;
};

export default pageLoader;
