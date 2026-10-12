param(
  [switch]$FullReset,
  [switch]$Rebuild,
  [switch]$GeneratePrisma
)

$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " AUTOESCUELA EGUZKILORE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# -------------------------------------------------------
# 1. Comprobar Docker Desktop
# -------------------------------------------------------

Write-Host "[1/7] Verificando Docker Desktop..." -ForegroundColor Yellow

try {
  docker ps | Out-Null
  Write-Host "Docker Desktop disponible." -ForegroundColor Green
}
catch {
  Write-Host "Docker Desktop no esta iniciado." -ForegroundColor Yellow

  $dockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"

  if (Test-Path $dockerDesktop) {
    Start-Process $dockerDesktop

    Write-Host "Esperando a Docker Desktop..." -ForegroundColor Yellow

    $dockerReady = $false

    for ($i = 1; $i -le 60; $i++) {
      try {
        docker ps | Out-Null
        $dockerReady = $true
        break
      }
      catch {
        Start-Sleep -Seconds 2
      }
    }

    if (-not $dockerReady) {
      Write-Error "Docker Desktop no ha arrancado correctamente."
      exit 1
    }
  }
  else {
    Write-Error "No se encontro Docker Desktop."
    exit 1
  }
}

# -------------------------------------------------------
# 2. Levantar Compose (rapido por defecto)
# -------------------------------------------------------

Write-Host ""
Write-Host "[2/7] Levantando Docker Compose..." -ForegroundColor Yellow

if ($FullReset) {
  Write-Host "Full reset activado: apagando stack actual..." -ForegroundColor DarkYellow
  try {
    docker compose down --remove-orphans
  }
  catch {
  }
}

if ($Rebuild) {
  Write-Host "Rebuild activado: reconstruyendo imagenes..." -ForegroundColor DarkYellow
  docker compose up -d --build
}
else {
  docker compose up -d
}

Write-Host "Docker Compose activo." -ForegroundColor Green

# -------------------------------------------------------
# 3. Esperar PostgreSQL listo
# -------------------------------------------------------

Write-Host ""
Write-Host "[3/7] Esperando PostgreSQL..." -ForegroundColor Yellow

$postgresReady = $false

for ($i = 1; $i -le 60; $i++) {
  try {
    $null = docker compose exec -T postgres pg_isready -U postgres -d autodrive_db
    if ($LASTEXITCODE -eq 0) {
      $postgresReady = $true
      break
    }
  }
  catch {
  }

  Start-Sleep -Seconds 1
}

if (-not $postgresReady) {
  Write-Error "PostgreSQL no esta listo."
  exit 1
}

Write-Host "PostgreSQL disponible." -ForegroundColor Green

# -------------------------------------------------------
# 4. Prisma
# -------------------------------------------------------

Write-Host ""
Write-Host "[4/7] Aplicando migraciones Prisma..." -ForegroundColor Yellow

docker compose exec -T backend npx prisma migrate deploy

if ($GeneratePrisma) {
  docker compose exec -T backend npx prisma generate
}

Write-Host "Prisma sincronizado." -ForegroundColor Green

# -------------------------------------------------------
# 5. Esperar Backend
# -------------------------------------------------------

Write-Host ""
Write-Host "[5/7] Esperando Backend..." -ForegroundColor Yellow

$backendReady = $false
$backendContainerId = docker compose ps -q backend

for ($i = 1; $i -le 60; $i++) {
  if ($backendContainerId) {
    $backendStatus = docker inspect -f "{{.State.Status}}" $backendContainerId 2>$null
    if ($backendStatus -in @("exited", "dead")) {
      Write-Host "El contenedor backend se ha detenido ($backendStatus)." -ForegroundColor Red
      Write-Host "Mostrando ultimos logs del backend:" -ForegroundColor Yellow
      docker compose logs --tail=120 backend
      exit 1
    }
  }

  try {
    $response = Invoke-WebRequest `
      -Uri "http://localhost:5000/api/health" `
      -UseBasicParsing `
      -TimeoutSec 3

    if ($response.StatusCode -eq 200) {
      $backendReady = $true
      break
    }
  }
  catch {
    if (($i % 10) -eq 0) {
      Write-Host "Esperando backend... intento $i/60" -ForegroundColor DarkYellow
    }
    Start-Sleep -Seconds 1
  }
}

if (-not $backendReady) {
  Write-Host "Backend no disponible tras 60 intentos. Ultimos logs:" -ForegroundColor Red
  docker compose logs --tail=120 backend
  Write-Error "Backend no disponible."
  exit 1
}

Write-Host "Backend operativo." -ForegroundColor Green

# -------------------------------------------------------
# 6. Reiniciar Vite
# -------------------------------------------------------

Write-Host ""
Write-Host "[6/7] Levantando Frontend..." -ForegroundColor Yellow

$viteProcesses =
  Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
  Where-Object {
    $_.Name -eq "node.exe" -and
    $_.CommandLine -match "vite"
  }

foreach ($proc in $viteProcesses) {
  Stop-Process -Id $proc.ProcessId -Force -ErrorAction SilentlyContinue
}

$frontendPath = Join-Path $PSScriptRoot "frontend"

if (-not (Test-Path (Join-Path $frontendPath "node_modules"))) {
  Push-Location $frontendPath
  npm install
  Pop-Location
}

$frontendCommand =
  "Set-Location '$frontendPath'; npm run dev -- --host 0.0.0.0"

Start-Process powershell `
  -ArgumentList "-NoExit", "-Command", $frontendCommand

Start-Sleep -Seconds 2

# -------------------------------------------------------
# 7. Abrir navegador
# -------------------------------------------------------

Write-Host ""
Write-Host "[7/7] Abriendo aplicacion..." -ForegroundColor Yellow

Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " SISTEMA OPERATIVO COMPLETAMENTE" -ForegroundColor Green
Write-Host " LEVANTADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Frontend : http://localhost:5173" -ForegroundColor Green
Write-Host "Backend : http://localhost:5000" -ForegroundColor Green
Write-Host "Swagger : http://localhost:5000/api-docs" -ForegroundColor Green
Write-Host "Health : http://localhost:5000/api/health" -ForegroundColor Green
Write-Host ""
Write-Host "Modo rapido activo por defecto." -ForegroundColor DarkGray
Write-Host "Opciones disponibles: -FullReset -Rebuild -GeneratePrisma" -ForegroundColor DarkGray
