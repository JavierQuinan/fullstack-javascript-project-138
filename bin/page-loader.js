#!/usr/bin/env node

import { Command } from "commander";
import pageLoader from "../src/page-loader.js";

const program = new Command();

program
  .version("1.0.0")
  .description("Page loader utility")
  .option("-o, --output <dir>", "Output directory", process.cwd())
  .argument("<url>", "URL to download")
  .action((url, options) => {
    pageLoader(url, options.output)
      .then((filePath) => console.log(`Archivo guardado en: ${filePath}`))
      .catch((err) => console.error(`Error: ${err.message}`));
  });

program.parse();
