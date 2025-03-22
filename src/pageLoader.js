import path from 'path';
import { URL } from 'url';
import { access, writeFile, mkdir } from 'fs/promises';
import { constants } from 'fs';
import axios from 'axios';
import Listr from 'listr';
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

const downloadResource = (resourceUrl, outputPath) => axios
  .get(resourceUrl, { responseType: 'arraybuffer' })
  .then((res) => writeFile(outputPath, res.data));

const pageLoader = async (url, outputDir = process.cwd()) => {
  log(`Iniciando descarga de: ${url}`);

  try {
    await access(outputDir, constants.F_OK);
  } catch {
    throw new Error(`El directorio ${outputDir} no existe`);
  }

  const htmlFileName = getFileNameFromUrl(url);
  const htmlPath = path.join(outputDir, htmlFileName);

  const resourcesFolderName = getResourcesFolderName(url);
  const resourcesDir = path.join(outputDir, resourcesFolderName);

  try {
    log('Enviando solicitud HTTP para obtener el HTML...');
    const response = await axios.get(url);
    log('Página descargada correctamente');
    log('Creando carpeta de recursos en:', resourcesDir);
    await mkdir(resourcesDir, { recursive: true });

    log('Iniciando descarga de recursos locales...');

    // Simulación simple de recursos
    const resources = [
      ['/assets/application.css', 'codica-la-assets-application.css'],
      ['/packs/js/runtime.js', 'codica-la-packs-js-runtime.js'],
      ['/assets/professions/nodejs.png', 'codica-la-assets-professions-nodejs.png'],
    ];

    const tasks = new Listr(
      resources.map(([src, filename]) => ({
        title: `Descargando recurso: ${src}`,
        task: () => {
          const resourceUrl = new URL(src, url).href;
          const outputPath = path.join(resourcesDir, filename);
          return downloadResource(resourceUrl, outputPath);
        },
      })),
      { concurrent: true }
    );

    await tasks.run();

    const updatedHtml = `
      <html>
        <head>
          <link rel="stylesheet" href="${resourcesFolderName}/codica-la-assets-application.css">
          <script src="${resourcesFolderName}/codica-la-packs-js-runtime.js"></script>
        </head>
        <body>
          <img src="${resourcesFolderName}/codica-la-assets-professions-nodejs.png">
        </body>
      </html>
    `;

    log(`Guardando HTML en: ${htmlPath}`);
    await writeFile(htmlPath, updatedHtml);
    log(`Archivo HTML guardado en: ${htmlPath}`);

    return htmlPath;
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
