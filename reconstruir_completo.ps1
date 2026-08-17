Write-Host ""
Write-Host "====================================="
Write-Host " AUTOESCUELA - RECONSTRUCCION TOTAL"
Write-Host "====================================="
Write-Host ""

Write-Host "Parando contenedores..."
docker compose down

Write-Host ""
Write-Host "Reconstruyendo backend..."
docker compose build --no-cache backend

Write-Host ""
Write-Host "Levantando contenedores..."
docker compose up -d

Write-Host ""
Write-Host "Esperando arranque..."
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Generando cliente Prisma..."
docker compose exec backend npx prisma generate

Write-Host ""
Write-Host "Reiniciando backend..."
docker compose restart backend

Write-Host ""
Write-Host "Estado de contenedores:"
docker compose ps

Write-Host ""
Write-Host "Ultimos logs backend:"
docker compose logs --tail=30 backend

Write-Host ""
Write-Host "Reconstruccion completada."
Write-Host ""