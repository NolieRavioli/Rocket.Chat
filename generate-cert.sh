#!/bin/bash

# Generate self-signed certificate for Rocket.Chat
echo "Generating self-signed certificate..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✓ Created .env file"
    else
        echo "❌ Error: .env.example not found!"
        exit 1
    fi
fi

# Create certs directory if it doesn't exist
mkdir -p ./certs

# Generate private key and certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ./certs/private.key \
  -out ./certs/certificate.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo "Certificate generated successfully!"
echo "Files created:"
echo "  - ./certs/private.key"
echo "  - ./certs/certificate.crt"
echo ""
echo "Run: docker compose -f docker-compose-local.yml up"
