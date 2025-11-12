# StaffAlloc - Complete AWS Deployment Guide

This guide provides step-by-step instructions to deploy the StaffAlloc application to AWS using EC2, S3, and CloudFront.

## Architecture Overview

```
┌─────────────────┐
│   CloudFront    │ ← HTTPS Frontend (React SPA)
│   Distribution  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   S3 Bucket     │ ← Static Files (HTML, JS, CSS)
│  (Frontend)     │
└─────────────────┘

┌─────────────────┐
│  EC2 Instance   │ ← HTTPS Backend (FastAPI)
│   (Backend)     │
│                 │
│ • Nginx         │
│ • Uvicorn       │
│ • SQLite        │
└─────────────────┘

┌─────────────────┐
│ AWS Parameter   │ ← Secrets Storage
│     Store       │
└─────────────────┘
```

## Quick Links

- **Detailed Plan:** See `aws-deployment-plan.plan.md`
- **Backend Deploy Scripts:** `Artifacts/backend/deploy/`
- **Frontend Deploy Scripts:** `reactapp/deploy/`
- **Infrastructure Tools:** `infrastructure/`
- **Setup Checklist:** `infrastructure/aws-setup-checklist.md`

## Prerequisites

- [ ] AWS account with free tier enabled
- [ ] AWS CLI installed: https://aws.amazon.com/cli/
- [ ] Node.js 18+ installed
- [ ] Python 3.10+ installed
- [ ] SSH client (OpenSSH, PuTTY, etc.)
- [ ] Git Bash or WSL (for Windows users)

## Part A: Preparation (Local Machine)

### 1. Generate Production Secrets

**Linux/Mac:**
```bash
cd infrastructure
chmod +x generate-secrets.sh
./generate-secrets.sh
# Save the output - you'll need it for Parameter Store
```

**Windows:**
```powershell
cd infrastructure
.\generate-secrets.ps1
# Save the output - you'll need it for Parameter Store
```

This creates a `secrets.txt` file. **Delete it after storing in AWS Parameter Store!**

### 2. Configure AWS CLI

```bash
aws configure
# Enter your Access Key ID
# Enter your Secret Access Key
# Default region: us-east-1
# Default output format: json

# Verify configuration
aws sts get-caller-identity
```

## Part B: Backend Deployment (EC2)

### Step 1: Create EC2 Key Pair

```bash
# Via AWS CLI
aws ec2 create-key-pair \
  --key-name staffalloc-key \
  --query 'KeyMaterial' \
  --output text > staffalloc-key.pem

# Secure the key
chmod 400 staffalloc-key.pem
```

Or use AWS Console: EC2 → Key Pairs → Create Key Pair

### Step 2: Create Security Group

```bash
# Create security group
aws ec2 create-security-group \
  --group-name staffalloc-backend-sg \
  --description "Security group for StaffAlloc backend"

# Add inbound rules
aws ec2 authorize-security-group-ingress \
  --group-name staffalloc-backend-sg \
  --protocol tcp --port 22 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name staffalloc-backend-sg \
  --protocol tcp --port 80 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name staffalloc-backend-sg \
  --protocol tcp --port 443 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name staffalloc-backend-sg \
  --protocol tcp --port 8000 --cidr 0.0.0.0/0
```

Or use AWS Console: EC2 → Security Groups → Create Security Group

### Step 3: Launch EC2 Instance

Use AWS Console (easier for first-time setup):

1. Go to EC2 Console → Launch Instance
2. Name: `staffalloc-backend`
3. AMI: Ubuntu Server 22.04 LTS
4. Instance type: `t2.micro` (free tier)
5. Key pair: `staffalloc-key`
6. Security group: `staffalloc-backend-sg`
7. Storage: 8 GB
8. Launch instance
9. **Note the Public IPv4 address!**

### Step 4: Connect to EC2

```bash
ssh -i staffalloc-key.pem ubuntu@<YOUR-EC2-PUBLIC-IP>
```

### Step 5: Setup EC2 Environment

On the EC2 instance:

```bash
# Download setup script
wget https://raw.githubusercontent.com/your-repo/main/infrastructure/setup_ec2.sh

# Or upload from local:
# From local machine: scp -i staffalloc-key.pem Artifacts/backend/deploy/setup_ec2.sh ubuntu@<EC2-IP>:~/

# Run setup
sudo bash setup_ec2.sh
```

### Step 6: Upload Application Code

From your local machine:

```bash
cd "Artifacts/backend"

# Create deployment package
tar -czf staffalloc-backend.tar.gz app/ requirements-prod.txt deploy/

# Upload to EC2
scp -i ../../staffalloc-key.pem staffalloc-backend.tar.gz ubuntu@<EC2-IP>:/opt/staffalloc/

# SSH back to EC2
ssh -i ../../staffalloc-key.pem ubuntu@<EC2-IP>

# Extract on EC2
cd /opt/staffalloc
tar -xzf staffalloc-backend.tar.gz
```

### Step 7: Setup Python Environment on EC2

```bash
cd /opt/staffalloc

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements-prod.txt

# Create data directory
mkdir -p data

# Initialize database
python -c "from app.db.session import create_db_and_tables; create_db_and_tables()"
```

### Step 8: Configure AWS Parameter Store

Back on your local machine or AWS Console:

```bash
# Store JWT secret
aws ssm put-parameter \
  --name "/staffalloc/prod/SECRET_KEY" \
  --value "<YOUR-JWT-SECRET-FROM-GENERATE-SECRETS>" \
  --type SecureString

# Store database URL
aws ssm put-parameter \
  --name "/staffalloc/prod/DATABASE_URL" \
  --value "sqlite:///./data/staffalloc.db" \
  --type String

# Store CORS origins (update after CloudFront creation)
aws ssm put-parameter \
  --name "/staffalloc/prod/CORS_ORIGINS" \
  --value "http://localhost:5173" \
  --type String
```

### Step 9: Grant EC2 Access to Parameter Store

1. Go to IAM Console → Roles → Create Role
2. Trusted entity: EC2
3. Attach policy: `AmazonSSMReadOnlyAccess`
4. Role name: `staffalloc-ec2-role`
5. Go to EC2 Console → Select instance → Actions → Security → Modify IAM Role
6. Attach the role

Test from EC2:
```bash
aws ssm get-parameter --name /staffalloc/prod/SECRET_KEY --with-decryption
```

### Step 10: Install and Start Application Service

On EC2:

```bash
# Install systemd service
sudo cp /opt/staffalloc/deploy/staffalloc.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable staffalloc
sudo systemctl start staffalloc

# Check status
sudo systemctl status staffalloc

# View logs
sudo journalctl -u staffalloc -f
```

### Step 11: Configure Nginx

On EC2:

```bash
# Install nginx config
sudo cp /opt/staffalloc/deploy/nginx.conf /etc/nginx/sites-available/staffalloc
sudo ln -s /etc/nginx/sites-available/staffalloc /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### Step 12: Setup SSL Certificate

**Option A: Self-Signed (Quick Test)**
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/staffalloc-selfsigned.key \
  -out /etc/ssl/certs/staffalloc-selfsigned.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=staffalloc"

# Nginx is already configured for self-signed cert
sudo systemctl restart nginx
```

**Option B: Let's Encrypt (With Domain)**
```bash
# Update nginx.conf with your domain first
sudo nano /etc/nginx/sites-available/staffalloc
# Replace server_name _ with your domain

# Run certbot
sudo certbot --nginx -d yourdomain.com

# Follow prompts - it will auto-configure nginx
```

### Step 13: Verify Backend

```bash
# Test locally on EC2
curl http://localhost:8000/health

# Test from your local machine
curl https://<EC2-PUBLIC-IP>/api/v1/health

# Or visit in browser (accept self-signed cert warning if using Option A)
https://<EC2-PUBLIC-IP>/api/docs
```

## Part C: Frontend Deployment (S3 + CloudFront)

### Step 1: Create S3 Bucket

```bash
# Choose a globally unique bucket name
BUCKET_NAME="staffalloc-frontend-prod-$(date +%s)"

# Create bucket
aws s3 mb s3://$BUCKET_NAME --region us-east-1

# Configure for static website hosting
aws s3 website s3://$BUCKET_NAME \
  --index-document index.html \
  --error-document index.html

# Set bucket policy for public read
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket $BUCKET_NAME \
  --policy file://bucket-policy.json

# Disable block public access
aws s3api put-public-access-block \
  --bucket $BUCKET_NAME \
  --public-access-block-configuration \
    BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
```

### Step 2: Build Frontend

On your local machine:

```bash
cd reactapp

# Create production environment file
cp env.production.template .env.production

# Edit with your EC2 IP or domain
# Update: VITE_API_BASE_URL=https://<YOUR-EC2-IP>
nano .env.production

# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

### Step 3: Deploy to S3

**Linux/Mac:**
```bash
cd reactapp
chmod +x deploy/deploy-to-s3.sh

# Edit the script to set your bucket name
nano deploy/deploy-to-s3.sh
# Update: S3_BUCKET="your-bucket-name"

# Deploy
./deploy/deploy-to-s3.sh
```

**Windows:**
```powershell
cd reactapp

# Deploy with custom bucket name
.\deploy\deploy-to-s3.ps1 -BucketName "your-bucket-name"
```

**Manual deployment:**
```bash
cd reactapp
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete
```

### Step 4: Create CloudFront Distribution

Use AWS Console (recommended for first-time):

1. Go to CloudFront Console → Create Distribution
2. **Origin domain:** Select your S3 bucket from dropdown
3. **Origin access:** Public
4. **Viewer protocol policy:** Redirect HTTP to HTTPS
5. **Allowed HTTP methods:** GET, HEAD, OPTIONS
6. **Cache policy:** CachingOptimized
7. **WAF:** Disable (free tier)
8. **Default root object:** `index.html`
9. **Create distribution**
10. Wait 5-15 minutes for Status: Enabled
11. **Note the Distribution domain name**

### Step 5: Configure CloudFront Error Pages

1. Select distribution → Error Pages tab
2. Create custom error response:
   - HTTP error code: **403**
   - Customize error response: **Yes**
   - Response page path: **/index.html**
   - HTTP response code: **200**
3. Create another:
   - HTTP error code: **404**
   - Same settings as above

### Step 6: Update Backend CORS

Update Parameter Store with CloudFront URL:

```bash
# Replace with your actual CloudFront URL
CLOUDFRONT_URL="https://d1234abcd.cloudfront.net"

aws ssm put-parameter \
  --name "/staffalloc/prod/CORS_ORIGINS" \
  --value "$CLOUDFRONT_URL,http://localhost:5173" \
  --overwrite

# Restart backend to pick up new CORS settings
ssh -i staffalloc-key.pem ubuntu@<EC2-IP> "sudo systemctl restart staffalloc"
```

## Part D: Testing & Verification

### Backend Tests

```bash
# Health check
curl https://<EC2-IP>/api/v1/health

# API documentation
open https://<EC2-IP>/api/docs
```

### Frontend Tests

1. Visit CloudFront URL: `https://<CLOUDFRONT-DOMAIN>`
2. Verify login page loads
3. Open browser DevTools → Console (check for errors)
4. Try logging in (if you have test credentials)
5. Navigate between pages
6. Check Network tab for API calls

### Integration Tests

1. Create test account (via API or frontend)
2. Create test project
3. Add test employee
4. Create allocation
5. Verify data persists
6. Check dashboard displays correctly

## Part E: Monitoring & Maintenance

### Setup CloudWatch Alarms

```bash
# CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name staffalloc-cpu-high \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

### Setup Billing Alerts

1. Go to AWS Billing Dashboard → Billing Preferences
2. Enable "Receive Free Tier Usage Alerts"
3. Enable "Receive Billing Alerts"
4. Go to CloudWatch → Create Alarm → Billing → Total Estimated Charge
5. Set threshold (e.g., $10)

### Regular Maintenance

```bash
# Check disk usage
ssh -i staffalloc-key.pem ubuntu@<EC2-IP> "df -h"

# View application logs
ssh -i staffalloc-key.pem ubuntu@<EC2-IP> "sudo journalctl -u staffalloc -n 100"

# Update backend code
cd Artifacts/backend
tar -czf staffalloc-backend.tar.gz app/
scp -i ../../staffalloc-key.pem staffalloc-backend.tar.gz ubuntu@<EC2-IP>:/opt/staffalloc/
ssh -i ../../staffalloc-key.pem ubuntu@<EC2-IP> \
  "cd /opt/staffalloc && tar -xzf staffalloc-backend.tar.gz && sudo systemctl restart staffalloc"

# Update frontend
cd reactapp
npm run build
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete
aws cloudfront create-invalidation --distribution-id <YOUR-DIST-ID> --paths "/*"
```

## Troubleshooting

### Backend Won't Start

```bash
# Check service status
sudo systemctl status staffalloc

# View logs
sudo journalctl -u staffalloc -n 50 --no-pager

# Test manually
cd /opt/staffalloc
source venv/bin/activate
bash deploy/start_server.sh
```

### Frontend Shows Old Version

```bash
# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <YOUR-DIST-ID> \
  --paths "/*"
```

### CORS Errors

```bash
# Check backend CORS settings
aws ssm get-parameter --name /staffalloc/prod/CORS_ORIGINS

# Update if needed
aws ssm put-parameter \
  --name "/staffalloc/prod/CORS_ORIGINS" \
  --value "https://<CLOUDFRONT-URL>,http://localhost:5173" \
  --overwrite

# Restart backend
ssh -i staffalloc-key.pem ubuntu@<EC2-IP> "sudo systemctl restart staffalloc"
```

### Can't Connect to Parameter Store

```bash
# Check IAM role from EC2
aws sts get-caller-identity

# Test parameter access
aws ssm get-parameter --name /staffalloc/prod/SECRET_KEY --with-decryption

# If fails, check IAM role has AmazonSSMReadOnlyAccess policy
```

## Cost Monitoring

### Free Tier Limits

- **EC2:** 750 hours/month of t2.micro (one instance 24/7)
- **S3:** 5 GB storage, 20,000 GET, 2,000 PUT requests
- **CloudFront:** 1 TB data transfer, 10M requests
- **Parameter Store:** 10,000 API calls/month

### Monitor Usage

```bash
# S3 usage
aws s3 ls s3://$BUCKET_NAME --recursive --summarize | grep "Total Size"

# Check billing
aws ce get-cost-and-usage \
  --time-period Start=2025-11-01,End=2025-11-30 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

## Backup Strategy

```bash
# Backup database
ssh -i staffalloc-key.pem ubuntu@<EC2-IP> \
  "aws s3 cp /opt/staffalloc/data/staffalloc.db s3://your-backup-bucket/backups/staffalloc-$(date +%Y%m%d).db"

# Schedule with cron (on EC2)
echo "0 2 * * * aws s3 cp /opt/staffalloc/data/staffalloc.db s3://your-backup-bucket/backups/staffalloc-\$(date +\%Y\%m\%d).db" | crontab -
```

## Cleanup / Teardown

To remove everything:

```bash
# Stop EC2
aws ec2 stop-instances --instance-ids <INSTANCE-ID>

# Delete CloudFront (wait for distribution to disable first)
aws cloudfront delete-distribution --id <DIST-ID> --if-match <ETAG>

# Empty and delete S3
aws s3 rm s3://$BUCKET_NAME --recursive
aws s3 rb s3://$BUCKET_NAME

# Terminate EC2
aws ec2 terminate-instances --instance-ids <INSTANCE-ID>

# Delete security group (after EC2 terminates)
aws ec2 delete-security-group --group-name staffalloc-backend-sg

# Delete key pair
aws ec2 delete-key-pair --key-name staffalloc-key

# Delete parameters
aws ssm delete-parameter --name /staffalloc/prod/SECRET_KEY
aws ssm delete-parameter --name /staffalloc/prod/DATABASE_URL
aws ssm delete-parameter --name /staffalloc/prod/CORS_ORIGINS

# Delete IAM role
aws iam delete-role --role-name staffalloc-ec2-role
```

## Support & Resources

- **AWS Free Tier:** https://aws.amazon.com/free/
- **EC2 User Guide:** https://docs.aws.amazon.com/ec2/
- **S3 User Guide:** https://docs.aws.amazon.com/s3/
- **CloudFront Guide:** https://docs.aws.amazon.com/cloudfront/
- **AWS CLI Reference:** https://docs.aws.amazon.com/cli/

## Quick Reference

### Important URLs

- **Backend API:** `https://<EC2-PUBLIC-IP>/api/docs`
- **Frontend:** `https://<CLOUDFRONT-DOMAIN>`
- **AWS Console:** https://console.aws.amazon.com/

### SSH Command

```bash
ssh -i staffalloc-key.pem ubuntu@<EC2-PUBLIC-IP>
```

### Common Commands

```bash
# Restart backend
sudo systemctl restart staffalloc

# View logs
sudo journalctl -u staffalloc -f

# Check status
sudo systemctl status staffalloc nginx

# Update code and restart
cd /opt/staffalloc && tar -xzf staffalloc-backend.tar.gz && sudo systemctl restart staffalloc
```

---

**Deployment Date:** _____________  
**EC2 IP:** _____________  
**CloudFront URL:** _____________  
**S3 Bucket:** _____________

