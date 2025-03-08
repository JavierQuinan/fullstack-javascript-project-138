import { promises as fs } from "fs";
import os from "os";
import path from "path";
import nock from "nock";
import pageLoader from "../src/page-loader.js";

describe("Page Loader - Descarga de Imágenes", () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "page-loader-"));
  });

  test("Debe descargar imágenes y modificar el HTML correctamente", async () => {
    const url = "https://codica.la/cursos";
    const expectedFilename = "codica-la-cursos.html";
    const expectedFilesDir = "codica-la-cursos_files";
    const expectedImage = "codica-la-assets-professions-nodejs.png";

    // 🔹 Simulamos la respuesta del servidor con una imagen
    nock("https://codica.la")
      .get("/cursos")
      .reply(
        200,
        `
        <html>
          <body>
            <img src="/assets/professions/nodejs.png" />
          </body>
        </html>
      `
      );

    nock("https://codica.la")
      .get("/assets/professions/nodejs.png")
      .reply(200, "IMAGEN_BLOB", {
        "Content-Type": "image/png",
      });

    const filePath = await pageLoader(url, tempDir);
    const fileContent = await fs.readFile(filePath, "utf-8");

    expect(path.basename(filePath)).toBe(expectedFilename);
    expect(fileContent).toContain(`${expectedFilesDir}/${expectedImage}`);

    const imagePath = path.join(tempDir, expectedFilesDir, expectedImage);
    const imageExists = await fs.stat(imagePath).then(() => true).catch(() => false);

    expect(imageExists).toBe(true);
  });
});

