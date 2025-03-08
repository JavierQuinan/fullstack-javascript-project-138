import { promises as fs } from "fs";
import os from "os";
import path from "path";
import nock from "nock";
import pageLoader from "../src/page-loader.js";

describe("Page Loader - Descarga de Recursos Locales", () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "page-loader-"));
  });

  test("Debe descargar imágenes, CSS y JS locales y modificar el HTML correctamente", async () => {
    const url = "https://codica.la/cursos";
    const expectedFilename = "codica-la-cursos.html";
    const expectedFilesDir = "codica-la-cursos_files";

    // 🔹 Simulación del HTML con imágenes, CSS y JS locales
    nock("https://codica.la")
      .get("/cursos")
      .reply(
        200,
        `
        <html>
          <head>
            <link rel="stylesheet" href="/assets/application.css">
            <script src="/packs/js/runtime.js"></script>
          </head>
          <body>
            <img src="/assets/professions/nodejs.png">
          </body>
        </html>
      `
      );

    // 🔹 Simulación de la respuesta de CSS
    nock("https://codica.la")
      .get("/assets/application.css")
      .reply(200, "body { background-color: red; }");

    // 🔹 Simulación de la respuesta de JS
    nock("https://codica.la")
      .get("/packs/js/runtime.js")
      .reply(200, "console.log('Hello World');");

    // 🔹 Simulación de la imagen
    nock("https://codica.la")
      .get("/assets/professions/nodejs.png")
      .reply(200, "IMAGEN_BLOB", {
        "Content-Type": "image/png",
      });

    const filePath = await pageLoader(url, tempDir);
    const fileContent = await fs.readFile(filePath, "utf-8");

    expect(fileContent).toContain(`${expectedFilesDir}/codica-la-assets-application.css`);
    expect(fileContent).toContain(`${expectedFilesDir}/codica-la-packs-js-runtime.js`);
    expect(fileContent).toContain(`${expectedFilesDir}/codica-la-assets-professions-nodejs.png`);
  });
});
