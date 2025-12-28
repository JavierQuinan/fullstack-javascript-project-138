# Ejecución Simple de Page Loader
# Autor: Francisco Quinteros (Javier_Quinan)

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  PAGE LOADER - Demo Rápida" -ForegroundColor Cyan
Write-Host "  Autor: Francisco Quinteros" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Crear directorio de salida
$outputDir = ".\directorio"
Write-Host " Directorio de salida: $outputDir" -ForegroundColor Yellow

# URL de ejemplo
$url = "https://example.com"
Write-Host " URL a descargar: $url" -ForegroundColor Yellow
Write-Host ""
Write-Host " Descargando..." -ForegroundColor Green
Write-Host ""

# Ejecutar el page-loader
node .\bin\page-loader.js -o $outputDir $url

Write-Host ""
Write-Host " ¡Descarga completada!" -ForegroundColor Green
Write-Host ""
Write-Host " Archivos descargados:" -ForegroundColor Cyan
Get-ChildItem -Path $outputDir -Recurse | Format-Table Name, Length, LastWriteTime -AutoSize
