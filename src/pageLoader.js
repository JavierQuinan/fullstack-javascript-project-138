import axios from 'axios';
import path from 'path';
import { promises as fs } from 'fs';
import { URL } from 'url';
import * as cheerio from 'cheerio';
import debug from 'debug';
import { Listr } from 'listr2';
import {
  urlToFilename, urlToDirname, getExtension, sanitizeOutputDir,
} from './utils.js';

const log = debug('page-loader');

// 🔹 Procesa y reemplaza las URLs de recursos dentro del HTML
const processResource = ($, tagName, attrName, baseUrl, baseDirname, assets) => {
  const $elements = $(tagName).toArray();

  $elements
    .map((element) => $(element))
    .filter(($element) => $element.attr(attrName))
    .map(($element) => {
      const rawUrl = $element.attr(attrName);
      const fullUrl = new URL(rawUrl, baseUrl); // resuelve relativa o absoluta
      return { $element, url: fullUrl };
    })
    .filter(({ url }) => url.origin === baseUrl.origin) // solo recursos locales
    .forEach(({ $element, url }) => {
      const slug = `${url.hostname}${url.pathname}`; // site.com/assets/styles.css
      const filename = urlToFilename(slug); // site-com-assets-styles.css
      const filepath = path.join(baseDirname, filename);
      assets.push({ url, filename });
      $element.attr(attrName, filepath);
    });
};

// 🔹 Obtiene y procesa todos los recursos del HTML
const processResources = (baseUrl, baseDirname, html) => {
  const $ = cheerio.load(html, { decodeEntities: false });
  const assets = [];

  processResource($, 'img', 'src', baseUrl, baseDirname, assets);
  processResource($, 'link', 'href', baseUrl, baseDirname, assets);
  processResource($, 'script', 'src', baseUrl, baseDirname, assets);

  return { html: $.html(), assets };
};

const downloadAsset = (dirname, { url, filename }) => {
  return axios.get(url.toString(), { responseType: 'arraybuffer' })
    .then((response) => {
      const fullPath = path.join(dirname, filename);
      return fs.writeFile(fullPath, response.data);
    });
};

// 🔹 Función principal para descargar una página
const downloadPage = async (pageUrl, outputDirName = '') => {
  outputDirName = sanitizeOutputDir(outputDirName);
  const fullOutputDirname = path.resolve(process.cwd(), outputDirName); // ✅ Resolución antes del chequeo

  log('url', pageUrl);
  log('output', fullOutputDirname);

  // ✅ Verifica si el directorio resuelto existe
  try {
    await fs.access(fullOutputDirname);
  } catch (error) {
    throw new Error(`El directorio ${fullOutputDirname} no existe`);
  }

  const url = new URL(pageUrl);
  const slug = `${url.hostname}${url.pathname}`;
  const filename = urlToFilename(slug);
  const extension = getExtension(filename) === '.html' ? '' : '.html';
  const fullOutputFilename = path.join(fullOutputDirname, `${filename}${extension}`);
  const assetsDirname = urlToDirname(slug);
  const fullOutputAssetsDirname = path.join(fullOutputDirname, assetsDirname);

  const html = await axios.get(pageUrl).then((res) => res.data);
  const data = processResources(url, assetsDirname, html, slug);

  await fs.mkdir(fullOutputAssetsDirname, { recursive: true });
  await fs.writeFile(fullOutputFilename, data.html);

  const tasks = data.assets.map((asset) => ({
    title: asset.url.toString(),
    task: () => downloadAsset(fullOutputAssetsDirname, asset),
  }));

  await new Listr(tasks, { concurrent: true }).run();

  log(`🎉 File successfully saved at: ${fullOutputFilename}`);
  return { filepath: fullOutputFilename };
};

export default downloadPage;
