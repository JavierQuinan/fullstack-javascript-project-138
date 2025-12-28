<div align="center">

# 📥 Page Loader

[![Actions Status](https://github.com/JavierQuinan/fullstack-javascript-project-138/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/JavierQuinan/fullstack-javascript-project-138/actions)
[![Maintainability](https://img.shields.io/badge/maintainability-A-green.svg)](https://github.com/JavierQuinan/fullstack-javascript-project-138)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

**Una herramienta de línea de comandos profesional para descargar páginas web completas**

[Características](#-características) • [Instalación](#-instalación) • [Uso](#-uso) • [Tecnologías](#-tecnologías) • [Ejemplos](#-ejemplos)

</div>

---

<div align="center">

### 🛠️ Stack Tecnológico

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)

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

## 💼 Portafolio Profesional

Este proyecto incluye una **plantilla de portafolio profesional** moderna y completamente personalizable, perfecta para desarrolladores Full Stack que desean mostrar sus habilidades y proyectos.

### 🎨 Características del Portafolio

- **🌙 Diseño oscuro profesional** con gradientes modernos
- **🎯 Stack tecnológico destacado** con badges animados (JavaScript, TypeScript, React, Node.js, MongoDB, etc.)
- **📱 Diseño responsive** optimizado para móviles, tablets y escritorio
- **✨ Efectos visuales modernos**:
  - Glassmorphism en cards y secciones
  - Animaciones suaves en hover
  - Gradientes dinámicos
  - Transiciones fluidas
- **📂 Secciones completas**:
  - Header con perfil y stack tecnológico
  - Sobre mí / About
  - Proyectos destacados con cards interactivas
  - Habilidades organizadas por categorías
  - Contacto con enlaces profesionales

### 🚀 Demo del Portafolio

Puedes ver el portafolio de ejemplo en: [demo-captured/example.com.html](demo-captured/example.com.html)

Para visualizarlo, simplemente abre el archivo en tu navegador:

```bash
# Windows
start demo-captured/example.com.html

# Linux/macOS
open demo-captured/example.com.html
```

### ✏️ Personalización

El portafolio es completamente personalizable. Solo necesitas editar el HTML para:

1. **Cambiar tu información personal**:
   - Nombre y título profesional
   - Descripción "Sobre mí"
   - Enlaces de contacto (email, GitHub, LinkedIn)

2. **Actualizar tus proyectos**:
   - Añadir/eliminar project cards
   - Modificar descripciones y tecnologías
   - Actualizar enlaces a repositorios

3. **Ajustar el stack tecnológico**:
   - Modificar badges de tecnologías en el header
   - Actualizar las secciones de habilidades
   - Cambiar colores de badges

4. **Personalizar el diseño**:
   - Modificar colores del tema en el CSS
   - Ajustar tamaños y espaciados
   - Cambiar fuentes y estilos

### 🎨 Paleta de Colores

El portafolio usa una paleta moderna y profesional:

- **Fondo**: Gradiente oscuro (`#0f172a` → `#1e293b`)
- **Acento primario**: Azul (`#60a5fa`, `#3b82f6`, `#2563eb`)
- **Texto**: Tonos grises claros (`#e2e8f0`, `#cbd5e1`, `#94a3b8`)
- **Cards**: Glassmorphism con transparencias

### 📱 Responsive Design

El portafolio se adapta automáticamente a:
- 📱 Móviles (< 768px)
- 📱 Tablets (768px - 1024px)
- 💻 Escritorio (> 1024px)

## 🛠️ Tecnologías

<div align="center">

### **Core**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![ES Modules](https://img.shields.io/badge/ES_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://nodejs.org/api/esm.html)

### **Dependencias Principales**

[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![Cheerio](https://img.shields.io/badge/Cheerio-E88C18?style=for-the-badge&logo=javascript&logoColor=white)](https://cheerio.js.org/)
[![Commander.js](https://img.shields.io/badge/Commander.js-00ADD8?style=for-the-badge&logo=gnu-bash&logoColor=white)](https://github.com/tj/commander.js)
[![Listr2](https://img.shields.io/badge/Listr2-4FC08D?style=for-the-badge&logo=checkmarx&logoColor=white)](https://github.com/cenk1cenk2/listr2)
[![Lodash](https://img.shields.io/badge/Lodash-3492FF?style=for-the-badge&logo=lodash&logoColor=white)](https://lodash.com/)
[![Debug](https://img.shields.io/badge/Debug-CC6699?style=for-the-badge&logo=debug&logoColor=white)](https://github.com/debug-js/debug)
[![ansi-colors](https://img.shields.io/badge/ansi--colors-FF6B6B?style=for-the-badge&logo=colors&logoColor=white)](https://github.com/doowb/ansi-colors)

### **Herramientas de Desarrollo**

[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Nock](https://img.shields.io/badge/Nock-00C7B7?style=for-the-badge&logo=insomnia&logoColor=white)](https://github.com/nock/nock)
[![TypeScript ESLint](https://img.shields.io/badge/TS_ESLint-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescript-eslint.io/)
[![Airbnb](https://img.shields.io/badge/Airbnb_Style-FF5A5F?style=for-the-badge&logo=airbnb&logoColor=white)](https://github.com/airbnb/javascript)

### **Otros**

[![js-yaml](https://img.shields.io/badge/js--yaml-4A90E2?style=for-the-badge&logo=yaml&logoColor=white)](https://github.com/nodeca/js-yaml)
[![axios-debug-log](https://img.shields.io/badge/axios--debug-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://github.com/Gerhut/axios-debug-log)
[![cross-env](https://img.shields.io/badge/cross--env-00C853?style=for-the-badge&logo=dotenv&logoColor=white)](https://github.com/kentcdodds/cross-env)

</div>

---

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

<div align="center">

**Francisco Quinteros**

[![GitHub](https://img.shields.io/badge/GitHub-JavierQuinan-181717?style=for-the-badge&logo=github)](https://github.com/JavierQuinan)
[![Profile Views](https://img.shields.io/badge/Profile_Views-2.6K-green?style=for-the-badge)](https://github.com/JavierQuinan)

</div>

---

<div align="center">

### ⭐ Si este proyecto te resulta útil, considera darle una estrella ⭐

**Desarrollado con ❤️ por Francisco Quinteros**

[![License](https://img.shields.io/badge/license-ISC-blue.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

