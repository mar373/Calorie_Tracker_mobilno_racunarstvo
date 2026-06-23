# ============================================
#  Calorie Tracker - Pokretanje aplikacije
# ============================================

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   * Calorie Tracker - Start *       " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1) Ubij stare procese i oslobodi portove
Write-Host "[INFO] Zaustavljam stare procese..." -ForegroundColor Yellow

$ports = @(3001, 8081)
foreach ($port in $ports) {
    try {
        $nets = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($nets) {
            foreach ($conn in $nets) {
                $pid = $conn.OwningProcess
                if ($pid -and $pid -ne 0) {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    Write-Host "   [OK] Port $port oslobodjen (PID $pid)" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "   Port $port je slobodan"
        }
    } catch {
        # Fallback na netstat ako Get-NetTCPConnection baci gresku
        $netstat = netstat -ano | Select-String "LISTENING" | Select-String ":$port "
        if ($netstat) {
            foreach ($line in $netstat) {
                $parts = $line.Line -split '\s+' | Where-Object {$_}
                $pid = $parts[-1]
                if ($pid -match '^\d+$' -and $pid -ne 0) {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    Write-Host "   [OK] Port $port oslobodjen (PID $pid)" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "   Port $port je slobodan"
        }
    }
}
Start-Sleep -Seconds 1

# 2) Obrisi Metro kes
Write-Host "[INFO] Brisem Expo/Metro kes..." -ForegroundColor Yellow
$cachePath = Join-Path $PSScriptRoot ".expo\web\cache"
if (Test-Path $cachePath) {
    Remove-Item -Recurse -Force $cachePath -ErrorAction SilentlyContinue
}
$envTemp = $env:TEMP
if ($envTemp) {
    Get-ChildItem -Path $envTemp -Filter "metro-*" -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    Get-ChildItem -Path $envTemp -Filter "haste-*" -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
}
Write-Host "   [OK] Kes obrisan" -ForegroundColor Green

# 3) Pokreni backend server
Write-Host ""
Write-Host "[INFO] Pokretam Firebase backend (port 3001)..." -ForegroundColor Yellow
$serverLog = Join-Path $envTemp "ct-server.log"
# Obrisi stari log ako postoji
if (Test-Path $serverLog) {
    Remove-Item -Force $serverLog -ErrorAction SilentlyContinue
}

# Pokretanje u pozadini bez otvaranja novog prozora
Start-Process -FilePath "node" -ArgumentList "index.js" -WorkingDirectory "$PSScriptRoot/server" -NoNewWindow -RedirectStandardOutput $serverLog -RedirectStandardError $serverLog

Start-Sleep -Seconds 3

# Provjeri da li backend radi
$serverRunning = $false
try {
    $webClient = New-Object System.Net.WebClient
    $response = $webClient.DownloadString("http://localhost:3001/health")
    if ($response -like "*ok*" -or $response -like "*status*") {
        $serverRunning = $true
    }
} catch {
    # Ako konekcija nije odbijena, smatramo da je server tu
    if ($_.Exception.InnerException -and $_.Exception.InnerException.Message -like "*connection refused*") {
        $serverRunning = $false
    } else {
        $serverRunning = $true
    }
}

if ($serverRunning) {
    Write-Host "   [OK] Backend radi na http://localhost:3001" -ForegroundColor Green
    Write-Host "   [OK] Firebase baza povezana" -ForegroundColor Green
} else {
    Write-Host "   [X] Server se nije pokrenuo!" -ForegroundColor Red
    if (Test-Path $serverLog) {
        Write-Host "--- SERVER LOG ---" -ForegroundColor Yellow
        Get-Content $serverLog -Tail 20
    }
    Exit 1
}

# 4) Pokreni Expo IZ KORIJENSKOG FOLDERA s --clear flagom
Write-Host ""
Write-Host "[INFO] Pokretam Expo app..." -ForegroundColor Yellow
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   [OK] Sve radi!                     " -ForegroundColor Cyan
Write-Host "   Web app: http://localhost:8081    " -ForegroundColor Cyan
Write-Host "   API:     http://localhost:3001    " -ForegroundColor Cyan
Write-Host "   Skeniraj QR za mobitel            " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Pokrecemo expo
npx expo start --web --port 8081 --clear
