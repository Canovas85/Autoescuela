Write-Host ""
Write-Host "====================================="
Write-Host " AUTOESCUELA - DIAGNOSTICO"
Write-Host "====================================="
Write-Host ""

Write-Host "CONTENEDORES"
Write-Host "------------"
docker compose ps

Write-Host ""
Write-Host "BACKEND LOGS"
Write-Host "------------"
docker compose logs --tail=50 backend

Write-Host ""
Write-Host "PRISMA GENERATE"
Write-Host "---------------"
docker compose exec backend npx prisma generate

Write-Host ""
Write-Host "ALUMNOS REPOSITORY"
Write-Host "------------------"
docker compose exec backend cat /app/src/features/alumnos/alumnos.repository.js

Write-Host ""
Write-Host "DIAGNOSTICO COMPLETADO"
Write-Host ""