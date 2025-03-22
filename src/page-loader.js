import path from 'path';
import fs from 'fs/promises';
import axios from 'axios';
import { URL } from 'url';
import debug from 'debug';
import { downloadResources } from './resources.js'; // Asumiendo que tienes esto separado

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

const pageLoader = async (url, outputDir = process.cwd()) => {
  log(`Iniciando descarga de: ${url}`);
  log('Enviando solicitud HTTP para obtener el HTML...');

  const htmlFileName = getFileNameFromUrl(url);
  const htmlPath = path.join(outputDir, htmlFileName);
  const resourcesFolderName = getResourcesFolderName(url);
  const resourcesDir = path.join(outputDir, resourcesFolderName);

  try {
    const response = await axios.get(url);
    log('Página descargada correctamente');

    log(`Creando carpeta de recursos en: ${resourcesDir}`);
    await fs.mkdir(resourcesDir, { recursive: true });

    log('Iniciando descarga de recursos locales...');
    const updatedHtml = await downloadResources(response.data, url, resourcesDir);

    log(`Guardando HTML en: ${htmlPath}`);
    await fs.writeFile(htmlPath, updatedHtml);
    log(`Archivo HTML guardado en: ${htmlPath}`);

    return htmlPath;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Error HTTP 404 al intentar acceder a ${url}`);
    }
    if (error.code === 'EACCES') {
      throw new Error(`Permiso denegado al intentar escribir en el directorio: ${outputDir}`);
    }
    throw new Error(`Error al descargar la página: ${error.message}`);
  }
};

export default pageLoader;

