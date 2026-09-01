$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Reiniciando Autoescuela completa" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "[1/4] Cerrando contenedores de Docker Compose..." -ForegroundColor Yellow
try {
    docker compose down --remove-orphans
    Write-Host "Contenedores cerrados correctamente." -ForegroundColor Green
} catch {
    Write-Host "No habia contenedores activos o hubo un aviso al cerrarlos." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[2/4] Levantando backend y base de datos con Docker Compose..." -ForegroundColor Yellow
try {
    docker compose up -d --build
    Write-Host "Docker Compose levantado." -ForegroundColor Green
} catch {
    Write-Error "Fallo al levantar Docker Compose. Comprueba Docker Desktop y la configuracion de docker-compose.yml"
    exit 1
}

Write-Host ""
Write-Host "[3/4] Sincronizando esquema Prisma y aplicando migraciones..." -ForegroundColor Yellow
try {
    docker compose exec -T backend npx prisma migrate deploy
    docker compose exec -T backend npx prisma generate
    Write-Host "Prisma sincronizado correctamente." -ForegroundColor Green
} catch {
    Write-Host "No se pudo aplicar migrate deploy; se intentara con db push." -ForegroundColor Yellow
    try {
        docker compose exec -T backend npx prisma db push
        docker compose exec -T backend npx prisma generate
        Write-Host "Prisma sincronizado con db push." -ForegroundColor Green
    } catch {
        Write-Error "No se pudo sincronizar la base de datos. Revisa los logs de Prisma."
        exit 1
    }
}

Write-Host ""
Write-Host "[4/4] Esperando a que el backend responda..." -ForegroundColor Yellow
$backendReady = $false
for ($i = 1; $i -le 60; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 3
        if ($response.StatusCode -eq 200) {
            $backendReady = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 2
    }
}

if (-not $backendReady) {
    Write-Error "El backend no ha respondido en http://localhost:5000/api/health. Revisa logs con: docker compose logs -f"
    exit 1
}

Write-Host "Backend disponible en http://localhost:5000" -ForegroundColor Green

Write-Host ""
Write-Host "[5/5] Levantando frontend con Vite..." -ForegroundColor Yellow

$frontendPath = Join-Path $PSScriptRoot "frontend"

if (-not (Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "Instalando dependencias del frontend..." -ForegroundColor Yellow
    Push-Location $frontendPath
    npm install
    Pop-Location
}

$existingNode = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -eq "node.exe" -and $_.CommandLine -match "vite" }

if ($existingNode) {
    foreach ($proc in $existingNode) {
        Stop-Process -Id $proc.ProcessId -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Servidor Vite anterior detenido." -ForegroundColor Yellow
}

$frontendCommand = "Set-Location '$frontendPath'; npm run dev -- --host 0.0.0.0"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Todo levantado correctamente" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URL del frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "Documentacion de la API: http://localhost:5000/api-docs" -ForegroundColor Green
Write-Host "Health check backend: http://localhost:5000/api/health" -ForegroundColor Green
Write-Host ""

Start-Process "http://localhost:5173"
