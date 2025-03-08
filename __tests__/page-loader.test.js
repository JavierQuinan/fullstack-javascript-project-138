import { promises as fs } from "fs";
import os from "os";
import path from "path";
import nock from "nock";
import pageLoader from "../src/page-loader.js";

describe("Page Loader", () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "page-loader-"));
  });

  test("Debe generar el nombre de archivo correctamente y descargar la página", async () => {
    const url = "https://codica.la/cursos";
    const expectedFilename = "codica-la-cursos.html";
    const expectedPath = path.join(tempDir, expectedFilename);

    // 🔹 Simulamos una respuesta HTTP usando nock
    nock("https://codica.la")
      .get("/cursos")
      .reply(200, "<html><body>Contenido de prueba</body></html>");

    const filePath = await pageLoader(url, tempDir);
    const fileContent = await fs.readFile(filePath, "utf-8");

    expect(path.basename(filePath)).toBe(expectedFilename);
    expect(fileContent).toContain("Contenido de prueba");
  });
});
