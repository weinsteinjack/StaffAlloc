# StaffAlloc Backend - Deployment Scripts

This directory contains all the scripts and configuration files needed to deploy the StaffAlloc backend to AWS EC2.

## Files Overview

### 1. `setup_ec2.sh`
Initial EC2 instance setup script. Run this once on a fresh Ubuntu 22.04 instance.

**Usage:**
```bash
sudo bash setup_ec2.sh
```

**What it does:**
- Updates system packages
- Installs Python 3.10+, Nginx, Certbot, AWS CLI
- Creates application directory at `/opt/staffalloc`
- Configures firewall (UFW)
- Sets up proper permissions

### 2. `start_server.sh`
Application startup script used by systemd.

**What it does:**
- Activates Python virtual environment
- Sets environment variables for production
- Creates necessary directories
- Initializes database if needed
- Starts Uvicorn with optimal settings for t2.micro

### 3. `staffalloc.service`
Systemd service file for managing the application as a system service.

**Installation:**
```bash
sudo cp staffalloc.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable staffalloc
sudo systemctl start staffalloc
```

**Management commands:**
```bash
sudo systemctl status staffalloc   # Check status
sudo systemctl restart staffalloc  # Restart service
sudo systemctl stop staffalloc     # Stop service
sudo journalctl -u staffalloc -f   # View logs
```

### 4. `nginx.conf`
Nginx reverse proxy configuration.

**Features:**
- HTTP to HTTPS redirect
- SSL/TLS configuration
- Reverse proxy to FastAPI app
- Security headers
- Logging configuration

**Installation:**
```bash
sudo cp nginx.conf /etc/nginx/sites-available/staffalloc
sudo ln -s /etc/nginx/sites-available/staffalloc /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

**Important:** Update the SSL certificate paths in `nginx.conf` after generating certificates.

## Deployment Workflow

### Initial Deployment

1. **Launch EC2 instance** (t2.micro, Ubuntu 22.04 LTS)

2. **Connect to EC2:**
   ```bash
   ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
   ```

3. **Download and run setup script:**
   ```bash
   # Upload setup script or copy contents
   sudo bash setup_ec2.sh
   ```

4. **Upload application code:**
   ```bash
   # From your local machine
   cd path/to/StaffAlloc/Artifacts/backend
   tar -czf staffalloc-backend.tar.gz app/ requirements-prod.txt deploy/
   scp -i your-key.pem staffalloc-backend.tar.gz ubuntu@<EC2-PUBLIC-IP>:/opt/staffalloc/
   
   # On EC2
   cd /opt/staffalloc
   tar -xzf staffalloc-backend.tar.gz
   ```

5. **Setup Python environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install --upgrade pip
   pip install -r requirements-prod.txt
   ```

6. **Initialize database:**
   ```bash
   mkdir -p data
   python -c "from app.db.session import create_db_and_tables; create_db_and_tables()"
   ```

7. **Configure AWS Parameter Store** (see main deployment plan)

8. **Install systemd service:**
   ```bash
   sudo cp deploy/staffalloc.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable staffalloc
   sudo systemctl start staffalloc
   sudo systemctl status staffalloc
   ```

9. **Setup SSL certificate:**

   **Option A: Let's Encrypt (with domain):**
   ```bash
   # Update nginx.conf with your domain name first
   sudo certbot --nginx -d yourdomain.com
   ```

   **Option B: Self-signed (testing):**
   ```bash
   sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout /etc/ssl/private/staffalloc-selfsigned.key \
     -out /etc/ssl/certs/staffalloc-selfsigned.crt
   ```

10. **Configure and start Nginx:**
    ```bash
    sudo cp deploy/nginx.conf /etc/nginx/sites-available/staffalloc
    sudo ln -s /etc/nginx/sites-available/staffalloc /etc/nginx/sites-enabled/
    sudo rm /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl restart nginx
    ```

11. **Verify deployment:**
    ```bash
    curl http://localhost:8000/health
    curl https://<EC2-PUBLIC-IP>/api/v1/health
    ```

### Updates and Redeployment

To deploy code updates:

```bash
# On local machine
cd path/to/StaffAlloc/Artifacts/backend
tar -czf staffalloc-backend.tar.gz app/
scp -i your-key.pem staffalloc-backend.tar.gz ubuntu@<EC2-PUBLIC-IP>:/opt/staffalloc/

# On EC2
cd /opt/staffalloc
tar -xzf staffalloc-backend.tar.gz
sudo systemctl restart staffalloc
```

## Troubleshooting

### Check service status
```bash
sudo systemctl status staffalloc
```

### View logs
```bash
# Application logs
sudo journalctl -u staffalloc -f

# Nginx access logs
sudo tail -f /var/log/nginx/staffalloc_access.log

# Nginx error logs
sudo tail -f /var/log/nginx/staffalloc_error.log
```

### Common issues

**Service won't start:**
- Check logs: `sudo journalctl -u staffalloc -n 50`
- Verify Python virtual environment exists: `ls -la /opt/staffalloc/venv`
- Test manually: `cd /opt/staffalloc && bash deploy/start_server.sh`

**Database errors:**
- Ensure data directory exists: `mkdir -p /opt/staffalloc/data`
- Check permissions: `ls -la /opt/staffalloc/data`
- Reinitialize: `python -c "from app.db.session import create_db_and_tables; create_db_and_tables()"`

**Nginx errors:**
- Test config: `sudo nginx -t`
- Check if port 80/443 are available: `sudo netstat -tlnp | grep ':80\|:443'`
- Verify SSL certificates exist: `ls -la /etc/ssl/certs/ /etc/ssl/private/`

**Can't connect to Parameter Store:**
- Verify IAM role attached to EC2: `aws sts get-caller-identity`
- Check IAM role has SSM permissions
- Test manually: `aws ssm get-parameter --name /staffalloc/prod/SECRET_KEY --with-decryption`

## Security Notes

- Never commit `.env` files or secrets to git
- Use AWS Parameter Store for production secrets
- Keep the EC2 security group restricted (only allow necessary ports)
- Regularly update packages: `sudo apt update && sudo apt upgrade`
- Monitor CloudWatch for unusual activity
- Set up automatic security updates: `sudo apt install unattended-upgrades`

## Resource Monitoring

Monitor EC2 resource usage:

```bash
# CPU and Memory
htop

# Disk usage
df -h

# Network connections
sudo netstat -tlnp

# Application resource usage
ps aux | grep uvicorn
```

## Backup

Regular database backups:

```bash
# Backup to S3
aws s3 cp /opt/staffalloc/data/staffalloc.db s3://your-backup-bucket/backups/staffalloc-$(date +%Y%m%d-%H%M%S).db

# Create backup script
cat > /opt/staffalloc/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
aws s3 cp /opt/staffalloc/data/staffalloc.db s3://your-backup-bucket/backups/staffalloc-$DATE.db
EOF

# Schedule daily backups with cron
crontab -e
# Add: 0 2 * * * /opt/staffalloc/backup.sh
```

