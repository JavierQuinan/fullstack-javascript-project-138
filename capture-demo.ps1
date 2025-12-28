# Script para Capturar/Documentar Ejecuciones de Page Loader
# Autor: Francisco Quinteros (Javier_Quinan)
# Este script registra toda la salida de las ejecuciones en archivos de texto

param(
    [string]$Url = "https://example.com",
    [string]$OutputDir = ".\screenshots-demo",
    [switch]$ConDebug
)

# Crear directorio para screenshots/logs
$screenshotsDir = ".\screenshots-logs"
if (-not (Test-Path $screenshotsDir)) {
    New-Item -ItemType Directory -Path $screenshotsDir | Out-Null
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = Join-Path $screenshotsDir "page-loader-demo-$timestamp.log"

function Write-Log {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
    $Message | Out-File -Append -FilePath $logFile
}

# Banner
Write-Log "╔════════════════════════════════════════════════════════════════╗" "Cyan"
Write-Log "║     PAGE LOADER - Captura de Ejecución                         ║" "Cyan"
Write-Log "║     Autor: Francisco Quinteros (Javier_Quinan)                ║" "Cyan"
Write-Log "║     Fecha: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')          ║" "Cyan"
Write-Log "╚════════════════════════════════════════════════════════════════╝" "Cyan"
Write-Log ""

# Información del sistema
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Yellow"
Write-Log "INFORMACIÓN DEL SISTEMA" "Green"
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Yellow"
Write-Log "Sistema Operativo: $([System.Environment]::OSVersion.VersionString)"
Write-Log "PowerShell: $($PSVersionTable.PSVersion.ToString())"
Write-Log "Node.js: $(node --version)"
Write-Log "npm: $(npm --version)"
Write-Log ""

# Información del proyecto
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Yellow"
Write-Log "INFORMACIÓN DEL PROYECTO" "Green"
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Yellow"
$packageJson = Get-Content .\package.json | ConvertFrom-Json
Write-Log "Nombre: $($packageJson.name)"
Write-Log "Versión: $($packageJson.version)"
Write-Log "Descripción: Descargador de páginas web con recursos locales"
Write-Log "Autor: Francisco Quinteros (Javier_Quinan)"
Write-Log ""

# Parámetros de la ejecución
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Yellow"
Write-Log "PARÁMETROS DE EJECUCIÓN" "Green"
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Yellow"
Write-Log "URL: $Url"
Write-Log "Directorio de salida: $OutputDir"
Write-Log "Modo debug: $ConDebug"
Write-Log "Archivo de log: $logFile"
Write-Log ""

# Limpiar directorio de salida si existe
if (Test-Path $OutputDir) {
    Write-Log "Limpiando directorio existente..." "Yellow"
    Remove-Item -Recurse -Force $OutputDir
}
New-Item -ItemType Directory -Path $OutputDir | Out-Null
Write-Log "Directorio creado: $OutputDir" "Green"
Write-Log ""

# Construir comando
$command = "node .\bin\page-loader.js -o $OutputDir $Url"
if ($ConDebug) {
    $env:DEBUG = "page-loader"
    Write-Log "Modo DEBUG activado" "Cyan"
}

# Ejecutar comando
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Yellow"
Write-Log "EJECUTANDO PAGE LOADER" "Green"
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Yellow"
Write-Log "Comando: $command" "Cyan"
Write-Log ""

$startTime = Get-Date

# Capturar salida del comando
$output = & node .\bin\page-loader.js -o $OutputDir $Url 2>&1
$output | ForEach-Object {
    Write-Log $_.ToString()
}

$endTime = Get-Date
$duration = $endTime - $startTime

if ($ConDebug) {
    $env:DEBUG = ""
}

Write-Log ""
Write-Log "Tiempo de ejecución: $($duration.TotalSeconds) segundos" "Yellow"
Write-Log ""

# Mostrar archivos descargados
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Yellow"
Write-Log "ARCHIVOS DESCARGADOS" "Green"
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Yellow"

if (Test-Path $OutputDir) {
    $files = Get-ChildItem -Path $OutputDir -Recurse
    $totalSize = ($files | Where-Object {-not $_.PSIsContainer} | Measure-Object -Property Length -Sum).Sum
    
    Write-Log "Total de archivos: $($files.Count)"
    Write-Log "Tamaño total: $([math]::Round($totalSize/1KB, 2)) KB"
    Write-Log ""
    Write-Log "Estructura de archivos:"
    
    $files | ForEach-Object {
        $relativePath = $_.FullName.Replace($OutputDir, "").TrimStart('\')
        $indent = "  " * (($relativePath.Split('\').Count) - 1)
        
        if ($_.PSIsContainer) {
            Write-Log "$indent[DIR] $($_.Name)" "Yellow"
        } else {
            $size = "{0:N2} KB" -f ($_.Length / 1KB)
            Write-Log "$indent[FILE] $($_.Name) - $size" "White"
        }
    }
} else {
    Write-Log "No se encontraron archivos descargados" "Red"
}

Write-Log ""

# Crear screenshot HTML con la información
$htmlReport = @"
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Loader - Reporte de Ejecucion</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        h1 {
            color: #667eea;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        h2 {
            color: #764ba2;
            margin-top: 30px;
        }
        .info-box {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
        .success {
            color: #28a745;
            font-weight: bold;
        }
        .warning {
            color: #ffc107;
            font-weight: bold;
        }
        .code {
            background: #282c34;
            color: #abb2bf;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-family: 'Consolas', 'Monaco', monospace;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #667eea;
            color: white;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            text-align: center;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Page Loader - Reporte de Ejecución</h1>
        
        <div class="info-box">
            <strong>Autor:</strong> Francisco Quinteros (Javier_Quinan)<br>
            <strong>Fecha:</strong> $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')<br>
            <strong>Duración:</strong> $($duration.TotalSeconds) segundos
        </div>

        <h2>Parámetros de Ejecución</h2>
        <table>
            <tr><th>Parámetro</th><th>Valor</th></tr>
            <tr><td>URL</td><td>$Url</td></tr>
            <tr><td>Directorio de salida</td><td>$OutputDir</td></tr>
            <tr><td>Modo debug</td><td>$ConDebug</td></tr>
            <tr><td>Node.js</td><td>$(node --version)</td></tr>
            <tr><td>npm</td><td>$(npm --version)</td></tr>
        </table>

        <h2>Comando Ejecutado</h2>
        <div class="code">$command</div>

        <h2>Resultados</h2>
        <div class="info-box success">
            Descarga completada exitosamente
        </div>

        <h2>Archivos Generados</h2>
        <pre>$(Get-ChildItem -Path $OutputDir -Recurse | Out-String)</pre>

        <div class="footer">
            <p>Generado por <strong>Page Loader</strong></p>
            <p>Desarrollado por Francisco Quinteros</p>
            <p>GitHub: <a href="https://github.com/JavierQuinan">@JavierQuinan</a></p>
        </div>
    </div>
</body>
</html>
"@

$htmlFile = Join-Path $screenshotsDir "reporte-$timestamp.html"
$htmlReport | Out-File -FilePath $htmlFile -Encoding UTF8

Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Yellow"
Write-Log "CAPTURA COMPLETADA" "Green"
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Yellow"
Write-Log ""
Write-Log "Log guardado en: $logFile" "Cyan"
Write-Log "Reporte HTML: $htmlFile" "Cyan"
Write-Log ""
Write-Log "Para ver el reporte HTML:" "Yellow"
Write-Log "  Start-Process '$htmlFile'" "White"
Write-Log ""

# Abrir el reporte automáticamente
$openReport = Read-Host "¿Deseas abrir el reporte HTML ahora? (S/N)"
if ($openReport -eq 'S' -or $openReport -eq 's') {
    Start-Process $htmlFile
}

Write-Host ""
Write-Host "Desarrollado por Francisco Quinteros (Javier_Quinan)" -ForegroundColor Magenta
Write-Host "GitHub: https://github.com/JavierQuinan" -ForegroundColor Magenta
