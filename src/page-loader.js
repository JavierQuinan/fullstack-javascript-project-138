import path from 'path';
import fs from 'fs/promises';
import axios from 'axios';
import { URL } from 'url';
import debug from 'debug';

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

  const htmlFileName = getFileNameFromUrl(url);
  const htmlPath = path.join(outputDir, htmlFileName);

  const resourcesFolderName = getResourcesFolderName(url);
  const resourcesDir = path.join(outputDir, resourcesFolderName);

  try {
    log('Enviando solicitud HTTP para obtener el HTML...');
    const response = await axios.get(url);
    log('Página descargada correctamente');

    log('Creando carpeta de recursos en:', resourcesDir);
    await fs.mkdir(resourcesDir, { recursive: true });

    log('Iniciando descarga de recursos locales...');
    // Aquí iría la lógica de procesamiento de recursos si se necesitara.
    // Por ahora simplemente guardamos el HTML original
    await fs.writeFile(htmlPath, response.data);

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
