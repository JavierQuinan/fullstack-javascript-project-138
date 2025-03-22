import axios from 'axios';
import path from 'path';
import { promises as fs } from 'fs';
import { URL } from 'url';
import * as cheerio from 'cheerio';
import debug from 'debug';
import _ from 'lodash';
import { Listr } from 'listr2';
import {
  urlToFilename,
  urlToDirname,
  getExtension,
  sanitizeOutputDir,
} from './utils.js';

const log = debug('page-loader');

// 🔹 Procesa y reemplaza las URLs de recursos dentro del HTML
const processResource = ($, tagName, attrName, baseUrl, baseDirname, assets, slug) => {
  const $elements = $(tagName).toArray();
  const elementsWithUrls = $elements
    .map((element) => $(element))
    .filter(($element) => $element.attr(attrName))
    .map(($element) => ({ $element, url: new URL($element.attr(attrName), baseUrl) }))
    .filter(({ url }) => url.origin === baseUrl);

  elementsWithUrls.forEach(({ $element, url }) => {
    const fullUrlPath = `${url.hostname}${url.pathname}`;
    const filename = urlToFilename(fullUrlPath);
    const filepath = path.join(baseDirname, filename);
    assets.push({ url, filename });
    $element.attr(attrName, filepath);
  });
};

// 🔹 Obtiene y procesa todos los recursos del HTML
const processResources = (baseUrl, baseDirname, html, slug) => {
  const $ = cheerio.load(html, { decodeEntities: false });
  const assets = [];

  processResource($, 'img', 'src', baseUrl, baseDirname, assets, slug);
  processResource($, 'link', 'href', baseUrl, baseDirname, assets, slug);
  processResource($, 'script', 'src', baseUrl, baseDirname, assets, slug);

  return { html: $.html(), assets };
};

const downloadAsset = (dirname, { url, filename }) =>
  axios.get(url.toString(), { responseType: 'arraybuffer' }).then((response) => {
    const fullPath = path.join(dirname, filename);
    return fs.writeFile(fullPath, response.data);
  });

// 🔹 Función principal
const downloadPage = async (pageUrl, outputDirName = '') => {
  outputDirName = sanitizeOutputDir(outputDirName);

  log('url', pageUrl);

  const url = new URL(pageUrl);
  const slug = `${url.hostname}${url.pathname}`;
  const filename = urlToFilename(slug);
  const extension = getExtension(filename) === '.html' ? '' : '.html';
  const fullOutputDirname = path.resolve(process.cwd(), outputDirName);
  const fullOutputFilename = path.join(fullOutputDirname, `${filename}${extension}`);
  const assetsDirname = urlToDirname(slug);
  const fullOutputAssetsDirname = path.join(fullOutputDirname, assetsDirname);

  // Verificar que el directorio de salida existe
  try {
    await fs.access(fullOutputDirname);
  } catch (e) {
    throw new Error(`❌ No se puede acceder al directorio: ${fullOutputDirname}`);
  }

  log('output', fullOutputDirname);

  let data;

  const html = await axios.get(pageUrl).then((res) => res.data);
  data = processResources(url, assetsDirname, html, slug);

  await fs.mkdir(fullOutputAssetsDirname, { recursive: true });
  await fs.writeFile(fullOutputFilename, data.html);

  const tasks = data.assets.map((asset) => ({
    title: asset.url.toString(),
    task: () =>
      downloadAsset(fullOutputAssetsDirname, asset).catch((e) => {
        log(`⚠️ No se pudo descargar ${asset.url.toString()}: ${e.message}`);
      }),
  }));

  const listr = new Listr(tasks, { concurrent: true });
  await listr.run();

  log(`✅ Archivo HTML guardado en: ${fullOutputFilename}`);
  return { filepath: fullOutputFilename };
};

export default downloadPage;
