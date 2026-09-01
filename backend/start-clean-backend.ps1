<#
==============================================================================
SCRIPT: start-clean-backend.ps1

OBJETIVO
------------------------------------------------------------------------------
Este script se utiliza cuando el backend muestra comportamientos extraños:

- Rutas nuevas que aparentemente no existen.
- Cambios en código que no se reflejan.
- Endpoints que devuelven "Cannot GET".
- Múltiples procesos Node escuchando el mismo puerto.
- Conflictos con Docker, WSL o nodemon antiguos.

ACCIONES
------------------------------------------------------------------------------
1. Busca quién está usando el puerto 5000.
2. Muestra los procesos encontrados.
3. Mata los procesos que ocupan dicho puerto.
4. Verifica que el puerto queda libre.
5. Arranca el backend desde cero.

CUÁNDO USARLO
------------------------------------------------------------------------------
- Después de crear un módulo nuevo.
- Cuando una ruta nueva no responde.
- Cuando hay sospechas de múltiples procesos Node.
- Antes de comenzar una sesión de desarrollo.

==============================================================================
#>

$PORT = 5000

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " LIMPIEZA DE BACKEND AUTOESCUELA" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Buscando procesos en puerto $PORT ..." -ForegroundColor Yellow

$connections = netstat -ano | Select-String ":$PORT"

if ($connections) {

$pids = $connections |
ForEach-Object {
($_ -split '\s+')[-1]
} |
Sort-Object -Unique

Write-Host ""
Write-Host "Procesos encontrados:" -ForegroundColor Yellow

foreach ($pid in $pids) {

if ($pid -match '^\d+$') {

try {
tasklist /FI "PID eq $pid"

Write-Host ""
Write-Host "Finalizando PID $pid" -ForegroundColor Red

taskkill /PID $pid /F | Out-Null
}
catch {
Write-Host "No se pudo finalizar PID $pid"
}
}
}
}
else {
Write-Host "No hay procesos utilizando el puerto $PORT" -ForegroundColor Green
}

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Verificando puerto..." -ForegroundColor Yellow

$check = netstat -ano | Select-String ":$PORT"

if ($check) {
Write-Host "ATENCION: Aun existe algun proceso en el puerto $PORT" -ForegroundColor Red
Write-Host $check
exit
}

Write-Host ""
Write-Host "Puerto libre." -ForegroundColor Green

Write-Host ""
Write-Host "Iniciando backend..." -ForegroundColor Cyan
Write-Host ""

npm run dev