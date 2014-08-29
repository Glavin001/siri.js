#!/bin/bash

# Create SSL Certificate
echo "=== Generating SSL Certificate ==="
mkdir ssl_cert
cd ssl_cert
sudo openssl req -new -newkey rsa:1024 -days 3065 -nodes -x509 -keyout siri-api-key.pem -out siri-api-cert.pem
