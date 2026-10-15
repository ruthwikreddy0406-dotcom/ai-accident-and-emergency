Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   Starting RoadGuard AI - Single Unified Production Server" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "Serving unified platform at: http://localhost:8000/" -ForegroundColor Yellow
Write-Host ""

$pythonExe = "C:\Users\ruthw\AppData\Local\Programs\Python311\python.exe"
$backendDir = Join-Path $PSScriptRoot "backend"

Set-Location $backendDir
& $pythonExe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
