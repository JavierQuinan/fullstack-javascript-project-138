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

const processResource = ($, tagName, attrName, baseUrl, baseDirname, assets, slugPrefix = '') => {
  const $elements = $(tagName).toArray();
  const elementsWithUrls = $elements
    .map((element) => $(element))
    .filter(($element) => $element.attr(attrName))
    .map(($element) => ({ $element, url: new URL($element.attr(attrName), baseUrl) }))
    .filter(({ url }) => url.origin === baseUrl);

  elementsWithUrls.forEach(({ $element, url }) => {
    const slug = urlToFilename(`${slugPrefix}${url.hostname}${url.pathname}`);
    const filepath = path.join(baseDirname, slug);
    assets.push({ url, filename: slug });
    $element.attr(attrName, filepath);
  });
};

const processResources = (baseUrl, baseDirname, html, slugPrefix = '') => {
  const $ = cheerio.load(html, { decodeEntities: false });
  const assets = [];

  processResource($, 'img', 'src', baseUrl, baseDirname, assets, slugPrefix);
  processResource($, 'link', 'href', baseUrl, baseDirname, assets, slugPrefix);
  processResource($, 'script', 'src', baseUrl, baseDirname, assets, slugPrefix);

  return { html: $.html(), assets };
};

const downloadAsset = (dirname, { url, filename }) =>
  axios.get(url.toString(), { responseType: 'arraybuffer' }).then((response) =>
    fs.writeFile(path.join(dirname, filename), response.data)
  );

const downloadPage = async (pageUrl, outputDirName = '') => {
  const safeOutputDirName = sanitizeOutputDir(outputDirName);

  log('url', pageUrl);
  log('output', safeOutputDirName);

  const url = new URL(pageUrl);
  const slug = `${url.hostname}${url.pathname}`;
  const filename = urlToFilename(slug);
  const fullOutputDirname = path.resolve(process.cwd(), safeOutputDirName);
  const extension = getExtension(filename) === '.html' ? '' : '.html';
  const fullOutputFilename = path.join(
    fullOutputDirname,
    `${filename}${extension}`
  );
  const assetsDirname = urlToDirname(slug);
  const fullOutputAssetsDirname = path.join(fullOutputDirname, assetsDirname);

  await fs.access(fullOutputDirname).catch(() => {
    throw new Error(`El directorio ${safeOutputDirName} no existe`);
  });

  const html = await axios.get(pageUrl).then((res) => res.data);
  const data = processResources(url.origin, assetsDirname, html, slug);

  await fs.mkdir(fullOutputAssetsDirname, { recursive: true });
  await fs.writeFile(fullOutputFilename, data.html);

  const tasks = data.assets.map((asset) => ({
    title: asset.url.toString(),
    task: () => downloadAsset(fullOutputAssetsDirname, asset).catch(_.noop),
  }));

  const listr = new Listr(tasks, { concurrent: true });
  await listr.run();

  log(`🎉 Archivo HTML guardado en: ${fullOutputFilename}`);
  return { filepath: fullOutputFilename };
};

export default downloadPage;
