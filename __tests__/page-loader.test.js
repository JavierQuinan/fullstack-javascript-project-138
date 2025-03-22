import { promises as fs, constants } from 'fs';
import path from 'path';
import os from 'os';
import nock from 'nock';
import pageLoader from '../src/pageLoader.js';
import { chmod } from 'fs/promises';

describe('Page Loader - Manejo de errores y descarga HTML', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });

  test('Debe descargar correctamente el HTML de la página', async () => {
    const url = 'https://codica.la/cursos';
    const expectedFilename = 'codica-la-cursos.html';
    const expectedFilesDir = 'codica-la-cursos_files';

    // HTML simulado con recursos locales
    nock('https://codica.la')
      .get('/cursos')
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

    // Recursos locales simulados
    nock('https://codica.la')
      .get('/assets/application.css')
      .reply(200, 'body { background: red; }');

    nock('https://codica.la')
      .get('/packs/js/runtime.js')
      .reply(200, 'console.log("JS");');

    nock('https://codica.la')
      .get('/assets/professions/nodejs.png')
      .reply(200, 'IMAGEN', {
        'Content-Type': 'image/png',
      });

    const filePath = await pageLoader(url, tempDir);
    const fileContent = await fs.readFile(filePath, 'utf-8');

    expect(fileContent).toContain(`${expectedFilesDir}/codica-la-assets-application.css`);
    expect(fileContent).toContain(`${expectedFilesDir}/codica-la-packs-js-runtime.js`);
    expect(fileContent).toContain(`${expectedFilesDir}/codica-la-assets-professions-nodejs.png`);
  });

  test('Debe lanzar error si la página devuelve 404', async () => {
    const url = 'https://ejemplo.com/pagina-invalida';
    nock('https://ejemplo.com').get('/pagina-invalida').reply(404);

    await expect(pageLoader(url, tempDir)).rejects.toThrow(/Error HTTP 404/);
  });

  test('Debe lanzar error si no se puede escribir en el directorio', async () => {
    const url = 'https://ejemplo.com';
    nock('https://ejemplo.com').get('/').reply(200, '<html></html>');

    const protectedDir = path.join(tempDir, 'sin-permisos');
    await fs.mkdir(protectedDir);
    await chmod(protectedDir, 0o444); // solo lectura

    await expect(pageLoader(url, protectedDir)).rejects.toThrow(/EACCES|permiso/i);
  });
});
