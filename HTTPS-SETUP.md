# HTTPS Self-Signed Certificate Setup

Simple setup for running Rocket.Chat with a self-signed certificate.

## Quick Start

1. **Create your environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Generate the certificate:**
   ```powershell
   .\generate-cert.ps1
   ```
   Or if you're using Git Bash:
   ```bash
   chmod +x generate-cert.sh
   ./generate-cert.sh
   ```

3. **Start Rocket.Chat:**
   ```bash
   docker compose -f docker-compose-local.yml up
   ```

4. **Access Rocket.Chat:**
   - HTTPS: https://localhost:3443
   - HTTP (still available): http://localhost:3000

## What Changed

- Added self-signed certificate generation scripts
- Configured Traefik to use TLS/HTTPS on port 3443
- Mounted certificate files into Traefik container
- Enabled TLS on all routers

## Certificate Details

- **Valid for:** 365 days
- **Location:** `./certs/` directory
- **Files:** 
  - `private.key` - Private key
  - `certificate.crt` - Certificate file

## Browser Warning

Since this is a self-signed certificate, your browser will show a security warning. This is normal. You can:
- Click "Advanced" and "Proceed" (Chrome/Edge)
- Click "Advanced" and "Accept the Risk and Continue" (Firefox)

## Regenerating Certificate

Just run the generation script again:
```powershell
.\generate-cert.ps1
```

Then restart your containers:
```bash
docker-compose -f docker-compose-local.yml restart traefik
```

## Notes

- No Let's Encrypt or external certificate providers
- No monitoring services needed
- Works in non-air-gapped environments (internet accessible)
- Certificates are stored locally in `./certs/` directory
