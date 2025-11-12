#!/bin/bash
# StaffAlloc Backend - EC2 Setup Script
# Run this script on a fresh Ubuntu 22.04 EC2 instance to set up the environment

set -e  # Exit on error

echo "=========================================="
echo "StaffAlloc Backend - EC2 Setup"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root or with sudo"
    exit 1
fi

# Update system packages
echo "Updating system packages..."
apt update && apt upgrade -y

# Install Python 3.10+
echo "Installing Python and dependencies..."
apt install -y python3 python3-pip python3-venv python3-dev build-essential

# Install Nginx
echo "Installing Nginx..."
apt install -y nginx

# Install Certbot for Let's Encrypt
echo "Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# Install AWS CLI (if not already installed)
echo "Installing AWS CLI..."
apt install -y awscli

# Install other useful utilities
echo "Installing utilities..."
apt install -y curl wget git htop vim

# Create application directory
echo "Creating application directory..."
mkdir -p /opt/staffalloc
chown ubuntu:ubuntu /opt/staffalloc

# Allow ubuntu user to manage systemd service
echo "Configuring permissions..."
# Create sudoers file for staffalloc service management
cat > /etc/sudoers.d/staffalloc << 'EOF'
ubuntu ALL=(ALL) NOPASSWD: /bin/systemctl start staffalloc
ubuntu ALL=(ALL) NOPASSWD: /bin/systemctl stop staffalloc
ubuntu ALL=(ALL) NOPASSWD: /bin/systemctl restart staffalloc
ubuntu ALL=(ALL) NOPASSWD: /bin/systemctl status staffalloc
ubuntu ALL=(ALL) NOPASSWD: /bin/systemctl daemon-reload
EOF
chmod 0440 /etc/sudoers.d/staffalloc

# Configure firewall (UFW)
echo "Configuring firewall..."
ufw --force enable
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw allow 8000/tcp # Direct API access (optional, can be removed later)
ufw status

echo ""
echo "=========================================="
echo "EC2 Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Upload your application code to /opt/staffalloc/"
echo "2. Run as ubuntu user:"
echo "   cd /opt/staffalloc"
echo "   python3 -m venv venv"
echo "   source venv/bin/activate"
echo "   pip install -r requirements-prod.txt"
echo "3. Initialize the database:"
echo "   mkdir -p data"
echo "   python -c 'from app.db.session import create_db_and_tables; create_db_and_tables()'"
echo "4. Configure and start the systemd service:"
echo "   sudo cp deploy/staffalloc.service /etc/systemd/system/"
echo "   sudo systemctl daemon-reload"
echo "   sudo systemctl enable staffalloc"
echo "   sudo systemctl start staffalloc"
echo "5. Configure Nginx:"
echo "   sudo cp deploy/nginx.conf /etc/nginx/sites-available/staffalloc"
echo "   sudo ln -s /etc/nginx/sites-available/staffalloc /etc/nginx/sites-enabled/"
echo "   sudo rm /etc/nginx/sites-enabled/default"
echo "   sudo nginx -t"
echo "   sudo systemctl restart nginx"
echo "6. Set up SSL certificate (Let's Encrypt or self-signed)"
echo ""

