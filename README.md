# 📥 Page Loader

<div align="center">

[![Actions Status](https://github.com/JavierQuinan/fullstack-javascript-project-138/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/JavierQuinan/fullstack-javascript-project-138/actions)
[![Maintainability](https://img.shields.io/badge/maintainability-A-green.svg)](https://github.com/JavierQuinan/fullstack-javascript-project-138)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

Una herramienta de línea de comandos para descargar páginas web completas con todos sus recursos locales (imágenes, scripts, estilos).

[Características](#-características) • [Instalación](#-instalación) • [Uso](#-uso) • [Tecnologías](#-tecnologías) • [Ejemplos](#-ejemplos)

</div>

---

## 📋 Descripción

**Page Loader** es una aplicación CLI profesional desarrollada en Node.js que permite descargar páginas web completas junto con todos sus recursos locales (imágenes, scripts CSS/JS, hojas de estilo). La herramienta procesa el HTML, identifica todos los recursos del mismo dominio y los descarga de manera eficiente, mostrando el progreso en tiempo real.

## ✨ Características

- 🌐 **Descarga completa de páginas web** con todos sus recursos locales
- 📦 **Procesamiento automático de recursos**:
  - Imágenes (`<img src="...">`)
  - Hojas de estilo (`<link href="...">`)
  - Scripts JavaScript (`<script src="...">`)
- 📊 **Barra de progreso visual** con Listr2 para seguimiento de descargas
- 🔍 **Sistema de debug integrado** para monitoreo detallado
- ⚠️ **Manejo robusto de errores** (404, permisos, red)
- 🎨 **Salida coloreada** en consola con ansi-colors
- 🔄 **Descargas concurrentes** para optimizar el rendimiento
- 📝 **Nomenclatura segura de archivos** (sanitización de nombres)
- 🛡️ **Validación de directorios** (previene escritura en rutas del sistema)

## 🛠️ Tecnologías

Este proyecto utiliza tecnologías modernas de JavaScript/Node.js:

### Core
- **[Node.js](https://nodejs.org/)** (v18+) - Runtime de JavaScript
- **[ES Modules](https://nodejs.org/api/esm.html)** - Sistema de módulos moderno

### Dependencias Principales
- **[Axios](https://axios-http.com/)** v1.1.3 - Cliente HTTP para descargar páginas y recursos
- **[Cheerio](https://cheerio.js.org/)** v1.0.0 - Manipulación y parsing de HTML (jQuery para Node.js)
- **[Commander.js](https://github.com/tj/commander.js)** v12.1.0 - Framework para crear CLI
- **[Listr2](https://github.com/cenk1cenk2/listr2)** v8.2.5 - Lista de tareas con barra de progreso
- **[Lodash](https://lodash.com/)** v4.17.21 - Utilidades de JavaScript
- **[Debug](https://github.com/debug-js/debug)** v4.4.0 - Sistema de logging y debugging
- **[ansi-colors](https://github.com/doowb/ansi-colors)** v4.1.3 - Colores para terminal

### Herramientas de Desarrollo
- **[ESLint](https://eslint.org/)** v8.57.1 - Linter de código
- **[Jest](https://jestjs.io/)** v29.7.0 - Framework de testing
- **[Nock](https://github.com/nock/nock)** v13.5.6 - HTTP mocking para tests
- **[TypeScript ESLint](https://typescript-eslint.io/)** v8.18.0 - Reglas de linting
- **[Airbnb Style Guide](https://github.com/airbnb/javascript)** - Guía de estilo de código

### Otros
- **[js-yaml](https://github.com/nodeca/js-yaml)** v4.1.0 - Parser de YAML
- **[axios-debug-log](https://github.com/Gerhut/axios-debug-log)** v1.0.0 - Debug de peticiones HTTP
- **[cross-env](https://github.com/kentcdodds/cross-env)** v7.0.3 - Variables de entorno multiplataforma

## 📦 Instalación

### Requisitos Previos
- Node.js v18 o superior
- npm v9 o superior

### Instalación Global

```bash
# Clonar el repositorio
git clone https://github.com/JavierQuinan/fullstack-javascript-project-138.git

# Navegar al directorio
cd fullstack-javascript-project-138

# Instalar dependencias
npm install

# Instalar globalmente
npm link
```

## 🚀 Uso

### Sintaxis Básica

```bash
page-loader [opciones] <url>
```

### Opciones

```bash
-V, --version           Muestra la versión del programa
-o, --output [dir]      Directorio de salida (por defecto: directorio actual)
-h, --help              Muestra ayuda
```

### Ejemplos de Uso

```bash
# Descargar una página en el directorio actual
page-loader https://ejemplo.com

# Descargar en un directorio específico
page-loader -o /tmp/downloads https://ejemplo.com

# Ver la versión
page-loader --version

# Ver ayuda
page-loader --help
```

### Modo Debug

Para ver logs detallados de ejecución:

```bash
# Linux/macOS
DEBUG=page-loader page-loader https://ejemplo.com

# Windows (PowerShell)
$env:DEBUG="page-loader"; page-loader https://ejemplo.com

# Windows (CMD)
set DEBUG=page-loader && page-loader https://ejemplo.com
```

## 📂 Estructura del Proyecto

```
fullstack-javascript-project-138/
├── bin/
│   └── page-loader.js          # Ejecutable CLI
├── src/
│   ├── cli.js                  # Configuración de Commander
│   ├── pageLoader.js           # Lógica principal de descarga
│   └── utils.js                # Funciones utilitarias
├── __tests__/
│   └── page-loader.test.js     # Tests con Jest
├── eslint.config.mjs           # Configuración ESLint
├── jest.config.mjs             # Configuración Jest
└── package.json                # Dependencias y scripts
```

## 🎯 Ejemplos

### 📌 Descarga Básica

Ejemplo de cómo funciona `page-loader`:

[![asciinema](https://asciinema.org/a/6y493hscKXbbvjMTPqLKuYKag.svg)](https://asciinema.org/a/6y493hscKXbbvjMTPqLKuYKag)

![image](https://github.com/user-attachments/assets/ede1c576-f516-430b-824a-33f09a6bc3b8)

### 📌 Descarga con Imágenes

Ejemplo de descarga de página con recursos gráficos:

[![asciinema](https://asciinema.org/a/ZsG2mAw1rFT2EccatYKWzVlj6.svg)](https://asciinema.org/a/ZsG2mAw1rFT2EccatYKWzVlj6)

### 🐞 Modo Debug

Ejecución con logs de debug activados:

[![asciinema](https://asciinema.org/a/Tfr7ocBnCAWlRqIesfuohb3sx.svg)](https://asciinema.org/a/Tfr7ocBnCAWlRqIesfuohb3sx)

### 📉 Manejo de Errores

El proyecto incluye manejo robusto de errores para:

- ❌ Respuestas HTTP diferentes a 200 (por ejemplo, error 404)
- ❌ Problemas de red o timeout
- ❌ Errores de permisos al escribir archivos
- ❌ Directorios no existentes o restringidos

Ejemplo de ejecución con errores:

[![asciinema](https://asciinema.org/a/P5fEroeHCnoqh26Fno9jL2Amb.svg)](https://asciinema.org/a/P5fEroeHCnoqh26Fno9jL2Amb)

### 🎥 Instalación y Funcionamiento Completo

Demo completa mostrando instalación y descarga con progreso visual:

[![asciicast](https://asciinema.org/a/KcmtDLd5wd8ZvyOesCHiOZM94.svg)](https://asciinema.org/a/KcmtDLd5wd8ZvyOesCHiOZM94)

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura
npm test -- --coverage

# Ejecutar tests en modo watch
npm test -- --watch
```

## 🔍 Linting

```bash
# Ejecutar linter
npm run lint

# Arreglar problemas automáticamente
npm run lint -- --fix
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Funcionalidades Técnicas

- **Procesamiento HTML**: Utiliza Cheerio para parsear y modificar el DOM
- **Gestión de URLs**: Convierte URLs en nombres de archivos seguros
- **Concurrencia**: Descarga múltiples recursos simultáneamente
- **Sistema de archivos**: Manejo asíncrono con `fs.promises`
- **Validación**: Sanitización de rutas y nombres de archivo
- **Logging**: Sistema de debug granular con namespaces

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia ISC.

## 👤 Autor

**Francisco Quinteros** ([@Javier_Quinan](https://github.com/JavierQuinan))

- GitHub: [@JavierQuinan](https://github.com/JavierQuinan)
- Proyecto: [fullstack-javascript-project-138](https://github.com/JavierQuinan/fullstack-javascript-project-138)

---

<div align="center">

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub ⭐**

Desarrollado con ❤️ por Francisco Quinteros

</div>

