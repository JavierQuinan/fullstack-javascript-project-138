import { promises as fs } from "fs";
import os from "os";
import path from "path";
import nock from "nock";
import pageLoader from "../src/page-loader.js";

describe("Page Loader - Manejo de errores y descarga HTML", () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "page-loader-"));
  });

  test("Debe descargar correctamente el HTML de la página", async () => {
    const url = "https://codica.la/cursos";
    const expectedFileName = "codica-la-cursos.html";

    nock("https://codica.la")
      .get("/cursos")
      .reply(200, "<html><body><h1>Cursos</h1></body></html>");

    const filePath = await pageLoader(url, tempDir);
    const fileContent = await fs.readFile(filePath, "utf-8");

    expect(fileContent).toContain("<h1>Cursos</h1>");
    expect(filePath).toContain(expectedFileName);
  });

  test("Debe lanzar error si la página devuelve 404", async () => {
    const url = "https://ejemplo.com/pagina-invalida";

    nock("https://ejemplo.com").get("/pagina-invalida").reply(404);

    await expect(pageLoader(url, tempDir)).rejects.toThrow(/Respuesta HTTP 404/);
  });

  test("Debe lanzar error si no se puede escribir en el directorio", async () => {
    const url = "https://ejemplo.com";

    nock("https://ejemplo.com").get("/").reply(200, "<html></html>");

    const protectedDir = "/root/protegido"; // Intenta escribir donde no hay permisos

    await expect(pageLoader(url, protectedDir)).rejects.toThrow(/EACCES|permiso/i);
  });
});
