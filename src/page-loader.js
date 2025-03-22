import path from 'path';
import fs from 'fs/promises';
import axios from 'axios';
import { URL } from 'url';
import debug from 'debug';
import { Listr } from 'listr2';

const log = debug('page-loader');

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

// Extrae todos los recursos locales del HTML
const extractResources = (html, baseUrl) => {
  const base = new URL(baseUrl);
  const resources = [];
  const regex = /<(img|script|link)[^>]+(?:src|href)="(\/[^"]+)"/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const [, tag, resourcePath] = match;
    const fullUrl = new URL(resourcePath, base).toString();
    const fileName = `${base.host}${resourcePath}`.replace(/[^a-zA-Z0-9]/g, '-');
    resources.push({
      tag,
      url: fullUrl,
      localName: fileName,
      originalPath: resourcePath,
    });
  }

  return resources;
};

// Reemplaza las rutas originales en el HTML con las rutas locales
const replaceResourceLinks = (html, resourcesFolder, resources) => {
  let updatedHtml = html;
  resources.forEach(({ originalPath, localName }) => {
    const localRelativePath = `${resourcesFolder}/${localName}`;
    updatedHtml = updatedHtml.replace(new RegExp(originalPath, 'g'), localRelativePath);
  });
  return updatedHtml;
};

const pageLoader = async (url, outputDir = process.cwd()) => {
  log(`Iniciando descarga de: ${url}`);

  const htmlFileName = getFileNameFromUrl(url);
  const htmlPath = path.join(outputDir, htmlFileName);
  const resourcesFolderName = getResourcesFolderName(url);
  const resourcesDir = path.join(outputDir, resourcesFolderName);

  try {
    log('Enviando solicitud HTTP para obtener el HTML...');
    const response = await axios.get(url);
    log('Página descargada correctamente');

    const html = response.data;
    const resources = extractResources(html, url);

    log(`Creando carpeta de recursos en: ${resourcesDir}`);
    await fs.mkdir(resourcesDir, { recursive: true });

    const tasks = new Listr(
      resources.map(({ url: resourceUrl, localName }) => ({
        title: `Descargando ${path.basename(resourceUrl)}`,
        task: async () => {
          const resourceResponse = await axios.get(resourceUrl, { responseType: 'arraybuffer' });
          const resourcePath = path.join(resourcesDir, localName);
          await fs.writeFile(resourcePath, resourceResponse.data);
        },
      })),
      { concurrent: true }
    );

    log('Iniciando descarga de recursos locales...');
    await tasks.run();

    const updatedHtml = replaceResourceLinks(html, resourcesFolderName, resources);
    log(`Guardando HTML en: ${htmlPath}`);
    await fs.writeFile(htmlPath, updatedHtml);
    log(`Archivo HTML guardado en: ${htmlPath}`);

    return htmlPath;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`Error HTTP 404 al intentar acceder a ${url}`);
      process.exit(1);
    }
    if (error.code === 'EACCES') {
      console.error(`Permiso denegado al intentar escribir en el directorio: ${outputDir}`);
      process.exit(1);
    }
    console.error(`Error al descargar la página: ${error.message}`);
    process.exit(1);
  }
};

export default pageLoader;
