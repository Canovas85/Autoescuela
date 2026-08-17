Write-Host ""
Write-Host "====================================="
Write-Host " AUTOESCUELA - REINICIO RAPIDO"
Write-Host "====================================="
Write-Host ""

docker compose restart backend

Write-Host ""
Write-Host "Estado de contenedores:"
Write-Host ""

docker compose ps

Write-Host ""
Write-Host "Ultimos logs backend:"
Write-Host ""

docker compose logs --tail=20 backend

Write-Host ""
Write-Host "Proceso completado."
Write-Host ""