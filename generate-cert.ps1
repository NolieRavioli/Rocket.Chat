# Generate self-signed certificate for Rocket.Chat
Write-Host "Generating self-signed certificate..." -ForegroundColor Green

# Create certs directory if it doesn't exist
New-Item -ItemType Directory -Force -Path ".\certs" | Out-Null

# Generate private key and certificate using OpenSSL
# Note: You need OpenSSL installed. If you don't have it:
# - Install via Chocolatey: choco install openssl
# - Or download from: https://slproweb.com/products/Win32OpenSSL.html
# - Or use Git Bash which includes OpenSSL

$opensslPath = Get-Command openssl -ErrorAction SilentlyContinue

if ($null -eq $opensslPath) {
    Write-Host "OpenSSL not found. Trying Git Bash path..." -ForegroundColor Yellow
    $gitBashOpenSSL = "C:\Program Files\Git\usr\bin\openssl.exe"
    if (Test-Path $gitBashOpenSSL) {
        $opensslPath = $gitBashOpenSSL
        Write-Host "Using OpenSSL from Git Bash" -ForegroundColor Green
    } else {
        Write-Host "ERROR: OpenSSL not found!" -ForegroundColor Red
        Write-Host "Please install OpenSSL or run generate-cert.sh in Git Bash" -ForegroundColor Yellow
        exit 1
    }
} else {
    $opensslPath = "openssl"
}

# Generate certificate
& $opensslPath req -x509 -nodes -days 365 -newkey rsa:2048 `
  -keyout ".\certs\private.key" `
  -out ".\certs\certificate.crt" `
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nCertificate generated successfully!" -ForegroundColor Green
    Write-Host "Files created:" -ForegroundColor Cyan
    Write-Host "  - .\certs\private.key"
    Write-Host "  - .\certs\certificate.crt"
    Write-Host "`nRun: docker-compose -f docker-compose-local.yml up" -ForegroundColor Yellow
} else {
    Write-Host "Error generating certificate" -ForegroundColor Red
    exit 1
}
