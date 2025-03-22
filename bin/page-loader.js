#!/usr/bin/env node

import { Command } from "commander";
import pageLoader from "../src/page-loader.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const program = new Command();

program
  .version('1.0.0')
  .arguments('<url>')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .action(async (url, options) => {
    try {
      const filePath = await pageLoader(url, options.output);
      console.log(`Archivo guardado en: ${filePath}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  });

program.parse();
