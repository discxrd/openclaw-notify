# Claw-Notify VPS Deployment Guide (For AI Agents)

This document provides step-by-step instructions for an AI agent to deploy `claw-notify` on a Linux VPS.

## Prerequisites

- Ubuntu 22.04+ or Debian 12+ VPS
- Root or sudo access
- Public IP address
- Open ports: 3000 (or your chosen port)

## Step 1: System Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should be v20.x.x
npm --version
```

## Step 2: Clone Repository

```bash
# Navigate to deployment directory
cd /opt

# Clone the repository (replace with actual repo URL)
sudo git clone https://github.com/YOUR_USERNAME/claw-notify.git
cd claw-notify/claw-notify

# Install dependencies
sudo npm install
```

## Step 3: Configure Environment

```bash
# Copy example config
sudo cp .env.example .env

# Edit configuration
sudo nano .env
```

**Required environment variables:**

```env
GEMINI_API_KEY=AIzaSy...          # Your Gemini API key
PORT=3000                          # Server port
PUBLIC_URL=wss://YOUR_VPS_IP:3000  # WebSocket URL for mobile app
FIREBASE_PROJECT_ID=your-project   # Firebase project ID
```

## Step 4: Add Firebase Credentials

Upload `serviceAccountKey.json` to `/opt/claw-notify/claw-notify/`:

```bash
# Option A: Copy from local machine using scp
# Run this on your LOCAL machine:
# scp serviceAccountKey.json user@YOUR_VPS_IP:/opt/claw-notify/claw-notify/

# Option B: Create file and paste content
sudo nano /opt/claw-notify/claw-notify/serviceAccountKey.json
# Paste the JSON content from Firebase Console
```

## Step 5: Configure Firewall

```bash
# Allow the port
sudo ufw allow 3000/tcp

# If using HTTPS reverse proxy, also allow 443
sudo ufw allow 443/tcp

# Enable firewall if not enabled
sudo ufw enable
```

## Step 6: Create Systemd Service

```bash
sudo tee /etc/systemd/system/claw-notify.service > /dev/null << 'EOF'
[Unit]
Description=Claw-Notify Bridge Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/claw-notify/claw-notify
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
```

## Step 7: Start Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable auto-start on boot
sudo systemctl enable claw-notify

# Start the service
sudo systemctl start claw-notify

# Check status
sudo systemctl status claw-notify
```

## Step 8: Verify Deployment

```bash
# Check if server is running
curl http://localhost:3000/

# Expected output: "Claw-Notify Bridge Server is running"

# Check logs
sudo journalctl -u claw-notify -f
```

## Optional: HTTPS with Nginx

For production, use Nginx as a reverse proxy with Let's Encrypt SSL:

```bash
# Install Nginx and Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# Create Nginx config
sudo tee /etc/nginx/sites-available/claw-notify > /dev/null << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/claw-notify /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d YOUR_DOMAIN.com
```

After SSL setup, update `.env`:
```env
PUBLIC_URL=wss://YOUR_DOMAIN.com
```

## Troubleshooting

### Service won't start
```bash
# Check logs for errors
sudo journalctl -u claw-notify -n 50 --no-pager

# Common issues:
# - Missing .env file
# - Missing serviceAccountKey.json
# - Port already in use
```

### WebSocket connection fails
```bash
# Verify firewall
sudo ufw status

# Test WebSocket locally
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://localhost:3000/
```

### Firebase errors
```bash
# Verify serviceAccountKey.json exists and is valid JSON
cat /opt/claw-notify/claw-notify/serviceAccountKey.json | jq .
```

## Quick Commands Reference

| Action | Command |
|--------|---------|
| Start server | `sudo systemctl start claw-notify` |
| Stop server | `sudo systemctl stop claw-notify` |
| Restart server | `sudo systemctl restart claw-notify` |
| View logs | `sudo journalctl -u claw-notify -f` |
| Check status | `sudo systemctl status claw-notify` |

## Security Checklist

- [ ] `.env` file has correct permissions (`chmod 600`)
- [ ] `serviceAccountKey.json` has correct permissions (`chmod 600`)
- [ ] Firewall is enabled and only necessary ports are open
- [ ] HTTPS is configured (for production)
- [ ] Server is not running as root (create dedicated user for production)

---

**Deployment complete!** The mobile app can now connect to `wss://YOUR_VPS_IP:3000` (or your domain if using HTTPS).
