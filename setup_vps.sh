#!/bin/bash
# SHAPE CRM - VPS Auto Setup Script
# Run this on your Hostinger VPS after SSH login

echo "🔥 SHAPE CRM - Setting up your VPS..."
echo "======================================="

# 1. Update system
echo "📦 Updating system..."
apt update -y && apt upgrade -y

# 2. Install Nginx
echo "🌐 Installing Nginx..."
apt install nginx -y
systemctl start nginx
systemctl enable nginx

# 3. Create web directory
echo "📂 Setting up files..."
mkdir -p /var/www/shape-crm

# 4. Download CRM file (we'll copy it manually)
echo "📄 Creating placeholder..."

# 5. Configure Nginx
echo "⚙️ Configuring Nginx..."
cat > /etc/nginx/sites-available/shape << 'NGINX'
server {
    listen 80;
    server_name _;
    root /var/www/shape-crm;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/html text/css application/javascript;
    gzip_min_length 1000;
}
NGINX

# 6. Enable site
ln -sf /etc/nginx/sites-available/shape /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 7. Test and restart
nginx -t && systemctl restart nginx

# 8. Set permissions
chown -R www-data:www-data /var/www/shape-crm
chmod -R 755 /var/www/shape-crm

echo ""
echo "✅ VPS SETUP COMPLETE!"
echo "======================================="
echo ""
echo "Now do ONE more thing:"
echo ""
echo "1. On your LAPTOP, run this command to upload the CRM file:"
echo ""
echo "   scp ~/Downloads/SHAPE-CRM-v6.html root@89.116.34.143:/var/www/shape-crm/index.html"
echo ""
echo "2. Then open in browser: http://89.116.34.143"
echo ""
echo "🎉 Your SHAPE CRM is LIVE!"
