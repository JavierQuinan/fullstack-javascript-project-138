#!/usr/bin/env node

import axios from "axios";
import { promises as fs } from "fs";
import path from "path";
import { URL } from "url";
import * as cheerio from "cheerio";
import debug from "debug";

const log = debug("page-loader");

const generateResourceFilename = (resourceUrl) => {
  const parsedUrl = new URL(resourceUrl);
  const extension = path.extname(parsedUrl.pathname);
  let cleanUrl = `${parsedUrl.hostname}${parsedUrl.pathname}`
    .replace(extension, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/-$/, "");
  return cleanUrl + extension;
};

const pageLoader = (websiteUrl, outputDir = process.cwd()) => {
  const parsedWebsiteUrl = new URL(websiteUrl);
  const htmlExtension = path.extname(parsedWebsiteUrl.pathname) || ".html";
  const baseFilename = generateResourceFilename(websiteUrl).replace(htmlExtension, "");
  const htmlFilename = `${baseFilename}.html`;
  const filePath = path.join(outputDir, htmlFilename);
  const assetsDir = path.join(outputDir, `${baseFilename}_files`);

  log("Inicio de descarga de página:", websiteUrl);

  return axios
    .get(websiteUrl)
    .then((response) => {
      log("Página descargada correctamente");
      return fs.mkdir(assetsDir, { recursive: true }).then(() => response.data);
    })
    .then((html) => {
      const $ = cheerio.load(html);
      const selectors = ["img", "link[rel='stylesheet']", "script[src]"];
      const resourcePromises = [];
      const elements = [];

      selectors.forEach((selector) => {
        $(selector).each((_, element) => {
          const tagName = element.name;
          const attr = tagName === "link" ? "href" : "src";
          const resourceUrl = $(element).attr(attr);

          if (resourceUrl && new URL(resourceUrl, websiteUrl).origin === parsedWebsiteUrl.origin) {
            elements.push({ element, attr });
            const resourcePromise = downloadResource(resourceUrl, assetsDir, websiteUrl);
            resourcePromises.push(resourcePromise);
          }
        });
      });

      return Promise.all(resourcePromises).then((resourcePaths) => {
        resourcePaths.forEach((resourcePath, index) => {
          if (resourcePath) {
            const relativePath = path.relative(path.dirname(filePath), resourcePath)
              .replace(/\\/g, "/");
            log("Reemplazando ruta en HTML:", relativePath);
            $(elements[index].element).attr(elements[index].attr, relativePath);
          }
        });
        return $.html();
      });
    })
    .then((updatedHtml) => fs.writeFile(filePath, updatedHtml, "utf-8"))
    .then(() => {
      log("Archivo HTML guardado en:", filePath);
      return filePath;
    })
    .catch((error) => {
      log("Error durante la descarga:", error.message);
      throw new Error(`Error al descargar la página: ${error.message}`);
    });
};

const downloadResource = (resourceUrl, outputDir, baseUrl) => {
  const absoluteUrl = new URL(resourceUrl, baseUrl).href;
  const filename = generateResourceFilename(absoluteUrl);
  const filePath = path.join(outputDir, filename);

  log("Descargando recurso:", absoluteUrl);

  return axios({
    method: "get",
    url: absoluteUrl,
    responseType: "arraybuffer",
  })
    .then((response) => fs.writeFile(filePath, response.data).then(() => {
      log("Recurso guardado:", filePath);
      return filePath;
    }))
    .catch((error) => {
      log(`Error descargando recurso ${absoluteUrl}: ${error.message}`);
      return null;
    });
};

export default pageLoader;
