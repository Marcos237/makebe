param(
    [int]$Port = 51730
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$buildPath = Join-Path $projectRoot "build"
$iisExpressPath = "C:\Program Files\IIS Express\iisexpress.exe"

if (-not (Test-Path $iisExpressPath)) {
    $iisExpressPath = "C:\Program Files (x86)\IIS Express\iisexpress.exe"
}

if (-not (Test-Path $iisExpressPath)) {
    Write-Error "IIS Express nao foi encontrado."
    exit 1
}

if (-not (Test-Path $buildPath)) {
    Write-Error "A pasta build nao existe. Rode 'npm run build' antes de iniciar o IIS Express."
    exit 1
}

Write-Host "Iniciando IIS Express em http://localhost:$Port"
& $iisExpressPath /path:$buildPath /port:$Port
