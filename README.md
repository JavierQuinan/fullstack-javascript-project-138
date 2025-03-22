## Hexlet tests and linter status:
[![Actions Status](https://github.com/JavierQuinan/fullstack-javascript-project-138/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/JavierQuinan/fullstack-javascript-project-138/actions)

## 📌 Uso del paquete

Aquí tienes un ejemplo de cómo funciona `page-loader`:

[![asciinema](https://asciinema.org/a/6y493hscKXbbvjMTPqLKuYKag.svg)](https://asciinema.org/a/6y493hscKXbbvjMTPqLKuYKag)

![image](https://github.com/user-attachments/assets/ede1c576-f516-430b-824a-33f09a6bc3b8)

## 📌 Uso del paquete con Descarga de Imágenes

Aquí tienes un ejemplo de cómo `page-loader` ahora también descarga imágenes:

[![asciinema](https://asciinema.org/a/ZsG2mAw1rFT2EccatYKWzVlj6.svg)](https://asciinema.org/a/ZsG2mAw1rFT2EccatYKWzVlj6)

## 🐞 Debug y registro de logs

Este proyecto usa la biblioteca [`debug`](https://www.npmjs.com/package/debug) para registrar eventos clave de ejecución. También se habilita el debug de `axios` y `nock`.

### 🔍 Ejemplo de ejecución con debug:

[![asciinema](https://asciinema.org/a/Tfr7ocBnCAWlRqIesfuohb3sx.svg)](https://asciinema.org/a/Tfr7ocBnCAWlRqIesfuohb3sx)

```bash
DEBUG=page-loader,axios,nock.* npm test

## Ejemplo de Error en la Ejecución

Este proyecto maneja errores de red y de sistema de archivos. A continuación, se muestra una ejecución donde ocurre un error:

[![asciicast](https://asciinema.org/a/P5fEroeHCnoqh26Fno9jL2Amb.svg)](https://asciinema.org/a/P5fEroeHCnoqh26Fno9jL2Amb)
