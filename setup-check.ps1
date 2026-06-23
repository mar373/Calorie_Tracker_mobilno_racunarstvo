# ============================================
#  Calorie Tracker - Provjera okruzenja
#  Pokreni jednom na novom racunaru: .\setup-check.ps1
# ============================================

$ERRORS = 0

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   * Calorie Tracker - Provjera okruzenja * " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1) Node.js
Write-Host "1. Node.js" -ForegroundColor Yellow
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    $nodeVer = & node --version
    $nodeVer = $nodeVer.Trim()
    Write-Host "   [OK] Node.js $nodeVer pronadjen" -ForegroundColor Green
} else {
    Write-Host "   [X] Node.js nije instaliran!" -ForegroundColor Red
    Write-Host "       Instalacija: https://nodejs.org" -ForegroundColor Red
    $ERRORS++
}

# 2) npm
Write-Host "2. npm" -ForegroundColor Yellow
$npm = Get-Command npm -ErrorAction SilentlyContinue
if ($npm) {
    $npmVer = & npm --version
    $npmVer = $npmVer.Trim()
    Write-Host "   [OK] npm $npmVer pronadjen" -ForegroundColor Green
} else {
    Write-Host "   [X] npm nije instaliran!" -ForegroundColor Red
    $ERRORS++
}

# 3) Root node_modules
Write-Host "3. Root zavisnosti (node_modules)" -ForegroundColor Yellow
if (Test-Path "$PSScriptRoot/node_modules") {
    Write-Host "   [OK] Instalirane" -ForegroundColor Green
} else {
    Write-Host "   [X] Nedostaju! Pokreni: npm install" -ForegroundColor Red
    $ERRORS++
}

# 4) Server node_modules
Write-Host "4. Server zavisnosti (server/node_modules)" -ForegroundColor Yellow
if (Test-Path "$PSScriptRoot/server/node_modules") {
    Write-Host "   [OK] Instalirane" -ForegroundColor Green
} else {
    Write-Host "   [X] Nedostaju! Pokreni: cd server; npm install" -ForegroundColor Red
    $ERRORS++
}

# 5) server/.env
Write-Host "5. Firebase konfiguracija (server/.env)" -ForegroundColor Yellow
$envPath = "$PSScriptRoot/server/.env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath
    $hasPlaceholder = $false
    foreach ($line in $envContent) {
        if ($line -like "*your-*") {
            $hasPlaceholder = $true
            break
        }
    }
    if ($hasPlaceholder) {
        Write-Host "   [X] server/.env postoji ali sadrzi placeholder vrijednosti!" -ForegroundColor Red
        Write-Host "       Popuni Firebase kredencijale." -ForegroundColor Red
        $ERRORS++
    } else {
        Write-Host "   [OK] server/.env pronadjen s kredencijalima" -ForegroundColor Green
    }
} else {
    Write-Host "   [X] server/.env ne postoji!" -ForegroundColor Red
    Write-Host "       Kopiraj fajl s originalnog racunara ili popuni:" -ForegroundColor Red
    Write-Host "       Copy-Item server/.env.example server/.env" -ForegroundColor Red
    $ERRORS++
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan

# Rezultat
if ($ERRORS -eq 0) {
    Write-Host "   [OK] Sve je spremno! Pokreni: .\start.ps1" -ForegroundColor Green
} else {
    Write-Host "   [X] Pronadjeno $ERRORS problem(a). Popravi ih gore." -ForegroundColor Red
    Write-Host ""
    Write-Host "Brzo rjesenje - instalacija zavisnosti:" -ForegroundColor Yellow
    Write-Host "   npm install"
    Write-Host "   cd server; npm install; cd .."
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
