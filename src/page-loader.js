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

const pageLoader = async (url, outputDir = process.cwd()) => {
  log(`Iniciando descarga de: ${url}`);

  const htmlFileName = getFileNameFromUrl(url);
  const htmlPath = path.join(outputDir, htmlFileName);

  try {
    log('Enviando solicitud HTTP para obtener el HTML...');
    const response = await axios.get(url);

    log('Página descargada correctamente');
    log(`Guardando HTML en: ${htmlPath}`);
    await fs.writeFile(htmlPath, response.data);

    log(`Archivo HTML guardado en: ${htmlPath}`);
    return htmlPath;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      log(`Error HTTP ${status} al intentar acceder a ${url}`);
      throw new Error(`Respuesta HTTP ${status}`);
    }

    if (error.code === 'EACCES') {
      log(`Permiso denegado al intentar escribir en el directorio: ${outputDir}`);
      throw new Error(`Permiso denegado para escribir en el directorio: ${outputDir}`);
    }

    log(`Error general: ${error.message}`);
    throw new Error(`Error al descargar la página: ${error.message}`);
  }
};

export default pageLoader;
