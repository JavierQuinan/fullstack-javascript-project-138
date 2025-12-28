# Scripts de Demostración - Page Loader

> **Autor:** Francisco Quinteros (Javier_Quinan)  
> **Proyecto:** Page Loader - Descargador de páginas web

---

## Descripción

Este directorio contiene scripts de PowerShell para demostrar y documentar el funcionamiento del Page Loader. Los scripts están diseñados para ejecutar el programa, capturar la salida y generar reportes detallados.

## Scripts Disponibles

### 1. `run-demo-simple.ps1`

**Propósito:** Ejecución rápida y simple del page-loader

**Características:**
- Descarga una página de ejemplo
- Muestra los archivos descargados
- Interfaz visual con colores

**Uso:**
```powershell
.\run-demo-simple.ps1
```

**Salida:**
- Descarga https://example.com al directorio `.\directorio`
- Lista los archivos descargados con su tamaño

---

### 2. `demo.ps1`

**Propósito:** Demostración completa paso a paso del page-loader

**Características:**
- ✅ Muestra información del proyecto
- ✅ Verifica instalación de dependencias
- ✅ Ejecuta el comando con diferentes opciones
- ✅ Demuestra modo debug
- ✅ Muestra manejo de errores
- ✅ Interfaz interactiva

**Uso:**
```powershell
.\demo.ps1
```

**Flujo del script:**
1. Información del proyecto
2. Verificación de dependencias
3. Mostrar ayuda del comando
4. Mostrar versión
5. Crear directorio de prueba
6. Descargar página de ejemplo
7. Listar archivos descargados
8. (Opcional) Ejecutar con modo DEBUG
9. Demostrar manejo de errores

---

### 3. `capture-demo.ps1`

**Propósito:** Capturar y documentar ejecuciones del page-loader

**Características:**
- Genera logs de texto detallados
- Crea reportes HTML profesionales
- Captura información del sistema
- Mide tiempo de ejecución
- Lista estructura de archivos descargados

**Uso Básico:**
```powershell
.\capture-demo.ps1
```

**Uso con Parámetros:**
```powershell
# Especificar URL y directorio
.\capture-demo.ps1 -Url "https://example.com" -OutputDir ".\mi-demo"

# Ejecutar con modo debug
.\capture-demo.ps1 -ConDebug

# Combinando parámetros
.\capture-demo.ps1 -Url "https://codica.la" -OutputDir ".\demo-codica" -ConDebug
```

**Parámetros:**
- `-Url`: URL a descargar (default: https://example.com)
- `-OutputDir`: Directorio de salida (default: .\screenshots-demo)
- `-ConDebug`: Activar modo debug (switch)

**Archivos Generados:**
- `screenshots-logs/page-loader-demo-YYYY-MM-DD_HH-mm-ss.log` - Log de texto
- `screenshots-logs/reporte-YYYY-MM-DD_HH-mm-ss.html` - Reporte HTML visual

---

## Casos de Uso

### Para Desarrollo y Testing
```powershell
# Prueba rápida
.\run-demo-simple.ps1

# Prueba completa con verificación
.\demo.ps1
```

### Para Documentación y Presentaciones
```powershell
# Generar reporte profesional
.\capture-demo.ps1 -Url "https://example.com"

# Demo con debug para mostrar logs
.\capture-demo.ps1 -Url "https://codica.la" -ConDebug
```

### Para Grabar con Asciinema (Linux/macOS)
```bash
# Grabar la ejecución
asciinema rec demo-recording.cast

# Ejecutar el demo
./run-demo-simple.ps1

# Detener grabación (Ctrl+D)

# Subir a asciinema.org
asciinema upload demo-recording.cast
```

---

## Estructura de Archivos Generados

```
fullstack-javascript-project-138/
├── screenshots-logs/              # Capturas y reportes
│   ├── page-loader-demo-*.log    # Logs de texto
│   └── reporte-*.html            # Reportes HTML
├── demo-output/                   # Salida del demo.ps1
├── demo-captured/                 # Salida del capture-demo.ps1
└── directorio/                    # Salida del run-demo-simple.ps1
```

---

## Ejemplos de Salida

### Log de Texto
```
╔════════════════════════════════════════════════════════════════╗
║     📸 PAGE LOADER - Captura de Ejecución                      ║
║     Autor: Francisco Quinteros (Javier_Quinan)                ║
║     Fecha: 28/12/2025 17:50:29                                ║
╚════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                INFORMACIÓN DEL SISTEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sistema Operativo: Microsoft Windows NT 10.0.26200.0
PowerShell: 7.4.6
Node.js: v22.18.0
npm: 10.9.2
```

### Reporte HTML
El reporte HTML incluye:
- Diseño profesional con gradientes
- Tablas con información del sistema
- Listado de archivos descargados
- Tiempo de ejecución
- Información del autor

---

## Requisitos

- Windows 10/11
- PowerShell 5.1 o superior (PowerShell 7 recomendado)
- Node.js v18+
- npm v9+
- Dependencias del proyecto instaladas (`npm install`)

---

## Personalización

### Modificar URL por Defecto
Edita el parámetro en `capture-demo.ps1`:
```powershell
param(
    [string]$Url = "https://tu-url-aqui.com",
    ...
)
```

### Cambiar Colores del Output
Modifica las llamadas a `Write-Host`:
```powershell
Write-Host "Texto" -ForegroundColor TuColor
# Colores: White, Cyan, Green, Yellow, Red, Magenta, Blue
```

---

## Solución de Problemas

### Error: "No se puede ejecutar scripts"
```powershell
# Verificar política de ejecución
Get-ExecutionPolicy

# Permitir ejecución (como administrador)
Set-ExecutionPolicy RemoteSigned
```

### Error: "node no se reconoce"
- Verifica que Node.js esté instalado: `node --version`
- Añade Node.js al PATH del sistema

### Error: "Directorio no existe"
- El script `capture-demo.ps1` crea automáticamente los directorios
- Asegúrate de tener permisos de escritura

---

## Referencias

- [Page Loader - README Principal](./README.md)
- [Node.js Documentation](https://nodejs.org/docs/)
- [PowerShell Documentation](https://docs.microsoft.com/powershell/)
- [Asciinema - Terminal Recording](https://asciinema.org/)

---

## Autor

**Francisco Quinteros** ([@Javier_Quinan](https://github.com/JavierQuinan))

- GitHub: [@JavierQuinan](https://github.com/JavierQuinan)
- Proyecto: [fullstack-javascript-project-138](https://github.com/JavierQuinan/fullstack-javascript-project-138)

---

## Licencia

ISC License - Ver archivo LICENSE para más detalles

---

<div align="center">

** Si estos scripts te resultan útiles, considera darle una estrella al proyecto **

Desarrollado por Francisco Quinteros

</div>
