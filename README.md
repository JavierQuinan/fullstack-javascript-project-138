<div align="center">

# Page Loader

### Node.js CLI for downloading web pages and local assets

[![Actions Status](https://github.com/JavierQuinan/fullstack-javascript-project-138/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/JavierQuinan/fullstack-javascript-project-138/actions)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ESM-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-ISC-blue)

</div>

## Overview

Page Loader is a command-line application that downloads an HTML page, discovers same-origin assets referenced by `img`, `link` and `script` elements, stores those assets locally and rewrites the downloaded HTML to reference the local copies.

This repository is maintained as **verified Node.js / CLI engineering evidence**. The README intentionally documents only capabilities that are present in the current codebase.

## Verified capabilities

- CLI built with Commander
- HTTP requests with Axios
- HTML parsing and rewriting with Cheerio
- same-origin asset discovery
- local filename and output-path normalization
- concurrent asset downloads through Listr2
- debug namespaces via `debug`
- Jest-based automated tests
- HTTP mocking with Nock
- ESLint / Airbnb-style linting
- GitHub Actions validation

## Stack

`Node.js` · `JavaScript / ES Modules` · `Axios` · `Cheerio` · `Commander` · `Listr2` · `Lodash` · `Jest` · `Nock` · `ESLint`

## How it works

```text
CLI input
   │
   ▼
Validate URL / output directory
   │
   ▼
Download HTML
   │
   ▼
Parse img/link/script references
   │
   ├── keep same-origin resources
   └── rewrite resource paths
   │
   ▼
Write HTML + create asset directory
   │
   ▼
Download assets concurrently
```

The core implementation is in `src/pageLoader.js`; CLI configuration is in `src/cli.js`.

## Installation

```bash
git clone https://github.com/JavierQuinan/fullstack-javascript-project-138.git
cd fullstack-javascript-project-138
npm install
npm link
```

## Usage

```bash
page-loader <url>
page-loader -o ./downloads <url>
page-loader --help
```

Example:

```bash
page-loader -o ./downloads https://example.com
```

## Debugging

Linux/macOS:

```bash
DEBUG=page-loader page-loader https://example.com
```

PowerShell:

```powershell
$env:DEBUG="page-loader"
page-loader https://example.com
```

## Quality checks

```bash
npm test
npm run lint
```

Coverage can be requested through Jest:

```bash
npm test -- --coverage
```

## Repository structure

```text
bin/
  page-loader.js
src/
  cli.js
  pageLoader.js
  utils.js
__tests__/
package.json
```

## Engineering notes

The implementation deliberately restricts downloaded resources to the same origin as the requested page. Asset download failures are isolated so one unavailable resource does not prevent the HTML document from being written.

This is a technical portfolio repository, not a claim of a production web-crawling platform. Features such as distributed crawling, browser rendering, authentication-aware scraping, TypeScript implementation or a separate portfolio website are outside the current verified scope.

## Portfolio classification

**Category:** Node.js / CLI engineering evidence  
**Visibility:** Public  
**Portfolio priority:** Medium  
**Recommended use:** Demonstrates filesystem work, HTTP processing, HTML transformation, concurrency, testing and CLI design.

## Author

Francisco Quinteros — [GitHub](https://github.com/JavierQuinan)

## License

ISC
