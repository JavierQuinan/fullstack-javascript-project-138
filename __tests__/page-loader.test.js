import { promises as fs } from "fs";
import os from "os";
import path from "path";
import pageLoader from "../src/page-loader.js";

describe("Page Loader", () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "page-loader-"));
  });

  test("Debe descargar una página y guardarla", async () => {
    const url = "https://example.com";
    const expectedFilename = "example-com.html";
    const filePath = await pageLoader(url, tempDir);

    expect(path.basename(filePath)).toBe(expectedFilename);
    const fileContent = await fs.readFile(filePath, "utf-8");

    expect(fileContent).toContain("<html>");
  });
});


