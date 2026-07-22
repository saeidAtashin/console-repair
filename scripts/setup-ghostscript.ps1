$ErrorActionPreference = "Stop"

function Find-Ghostscript {
    $candidates = @()

    foreach ($root in @("C:\Program Files\gs", "C:\Program Files (x86)\gs")) {
        if (-not (Test-Path $root)) { continue }
        Get-ChildItem $root -Directory | ForEach-Object {
            $bin = Join-Path $_.FullName "bin\gswin64c.exe"
            if (Test-Path $bin) { $candidates += $bin }
        }
    }

    $scoopPath = Join-Path $env:USERPROFILE "scoop\apps\ghostscript\current\bin\gswin64c.exe"
    if (Test-Path $scoopPath) { $candidates += $scoopPath }

    $cmd = Get-Command gswin64c -ErrorAction SilentlyContinue
    if ($cmd) { $candidates += $cmd.Source }

    return $candidates | Select-Object -First 1
}

function Ensure-Scoop {
    $scoopCmd = Get-Command scoop -ErrorAction SilentlyContinue
    if ($scoopCmd) { return $true }

    Write-Host "Scoop not found. Installing Scoop (user-local, no admin required)..."
    try {
        $policy = Get-ExecutionPolicy -Scope CurrentUser
        if ($policy -eq "Restricted" -or $policy -eq "Undefined") {
            Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        }
    } catch {
        Write-Host "Note: could not update execution policy (continuing anyway)."
    }

    Invoke-RestMethod -Uri "https://get.scoop.sh" | Invoke-Expression
    return $null -ne (Get-Command scoop -ErrorAction SilentlyContinue)
}

$existing = Find-Ghostscript
if ($existing) {
    Write-Host "Ghostscript already available: $existing"
    exit 0
}

Write-Host "Ghostscript not found. Attempting user-local install via Scoop..."

if (-not (Ensure-Scoop)) {
    Write-Error @"
Could not install Scoop.

Install Ghostscript manually from https://ghostscript.com/releases/gsdnld.html
Then re-run: npm run convert:designed
"@
}

Write-Host "Installing ghostscript via Scoop..."
& scoop install ghostscript

$installed = Find-Ghostscript
if (-not $installed) {
    Write-Error @"
Ghostscript install finished but gswin64c.exe was not found.

Install manually from https://ghostscript.com/releases/gsdnld.html
Then re-run: npm run convert:designed
"@
}

Write-Host "Ghostscript installed: $installed"
Write-Host "Run: npm run convert:designed"
