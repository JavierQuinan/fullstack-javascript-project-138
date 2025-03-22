import fs, { promises as fsp, constants } from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import debugLib from 'debug';
import { Listr } from 'listr2';

const log = debugLib('page-loader');

const getFileNameFromUrl = (url) => {
  const { hostname, pathname } = new URL(url);
  const normalizedPath = pathname === '/' ? '' : pathname;
  const name = `${hostname}${normalizedPath}`
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+$/, '');
  return `${name}.html`;
};

const getResourceFileName = (resourceUrl, baseUrl) => {
  const { hostname, pathname } = new URL(resourceUrl, baseUrl);
  const ext = path.extname(pathname) || '.html';
  const cleanedPath = pathname.replace(/^\/+/g, '').replace(/\//g, '-').replace(/[^a-zA-Z0-9.-]/g, '-');
  return `${hostname}-${cleanedPath}`;
};

const isLocalResource = (url, baseUrl) => {
  const resource = new URL(url, baseUrl);
  const base = new URL(baseUrl);
  return resource.hostname === base.hostname;
};

const pageLoader = async (url, outputDir = process.cwd()) => {
  try {
    await fsp.access(outputDir, constants.F_OK);
  } catch {
    throw new Error(`El directorio ${outputDir} no existe`);
  }

  log(`Iniciando descarga de: ${url}`);
  log('Enviando solicitud HTTP para obtener el HTML...');

  let response;
  try {
    response = await axios.get(url);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Error HTTP 404 al intentar acceder a ${url}`);
    }
    throw error;
  }

  const html = response.data;
  log('Página descargada correctamente');
  const $ = cheerio.load(html);
  const baseUrl = new URL(url).origin;

  const resources = [];
  const tags = [
    { tag: 'img', attr: 'src' },
    { tag: 'link', attr: 'href' },
    { tag: 'script', attr: 'src' }
  ];

  tags.forEach(({ tag, attr }) => {
    $(tag).each((_, el) => {
      const resourceUrl = $(el).attr(attr);
      if (resourceUrl && isLocalResource(resourceUrl, url)) {
        const filename = getResourceFileName(resourceUrl, url);
        const fullPath = path.join(`${getFileNameFromUrl(url).replace('.html', '')}_files`, filename);
        $(el).attr(attr, fullPath);
        resources.push({ url: new URL(resourceUrl, baseUrl).href, filename });
      }
    });
  });

  const htmlFileName = getFileNameFromUrl(url);
  const htmlFilePath = path.join(outputDir, htmlFileName);
  const resourcesDir = path.join(outputDir, `${htmlFileName.replace('.html', '')}_files`);

  await fsp.mkdir(resourcesDir, { recursive: true });
  log(`Creando carpeta de recursos en: ${resourcesDir}`);

  const tasks = new Listr(
    resources.map(({ url: resourceUrl, filename }) => ({
      title: `Descargando recurso: ${resourceUrl}`,
      task: async () => {
        const res = await axios.get(resourceUrl, { responseType: 'arraybuffer' });
        const filepath = path.join(resourcesDir, filename);
        await fsp.writeFile(filepath, res.data);
      },
    })),
    { concurrent: true, exitOnError: false }
  );

  log('Iniciando descarga de recursos locales...');
  await tasks.run();

  await fsp.writeFile(htmlFilePath, $.html());
  log(`Archivo HTML guardado en: ${htmlFilePath}`);

  return htmlFilePath;
};

export default pageLoader;