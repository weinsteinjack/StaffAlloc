# AWS Deployment Setup Checklist

Use this checklist to track your progress through the AWS deployment process.

## Prerequisites

- [ ] AWS account created and verified
- [ ] Credit card added to AWS account
- [ ] AWS CLI installed on local machine
- [ ] SSH client available (Windows: PuTTY or OpenSSH)
- [ ] Git Bash or WSL installed (for Windows users running bash scripts)

## Phase 1: IAM Setup

- [ ] Created IAM user: `staffalloc-deployer`
- [ ] Attached policies:
  - [ ] AmazonEC2FullAccess
  - [ ] AmazonS3FullAccess
  - [ ] CloudFrontFullAccess
  - [ ] AmazonSSMFullAccess
- [ ] Created access key for CLI
- [ ] Saved Access Key ID: `__________________`
- [ ] Saved Secret Access Key: `__________________` (keep secure!)
- [ ] Configured AWS CLI: `aws configure`
- [ ] Tested AWS CLI: `aws sts get-caller-identity`

## Phase 2: EC2 Backend Setup

### Step 2.1: Key Pair
- [ ] Created EC2 key pair: `staffalloc-key`
- [ ] Downloaded .pem file
- [ ] Secured .pem file (chmod 400 on Linux/Mac)
- [ ] Key location: `__________________`

### Step 2.2: Security Group
- [ ] Created security group: `staffalloc-backend-sg`
- [ ] Added inbound rules:
  - [ ] SSH (22) - My IP
  - [ ] HTTP (80) - 0.0.0.0/0
  - [ ] HTTPS (443) - 0.0.0.0/0
  - [ ] Custom TCP (8000) - 0.0.0.0/0

### Step 2.3: EC2 Instance
- [ ] Launched EC2 instance: `staffalloc-backend`
- [ ] Instance type: t2.micro (free tier)
- [ ] AMI: Ubuntu Server 22.04 LTS
- [ ] Storage: 8 GB
- [ ] Instance is running
- [ ] Public IPv4 address: `__________________`
- [ ] Public IPv4 DNS: `__________________`

### Step 2.4: EC2 Initial Setup
- [ ] Connected via SSH successfully
- [ ] Ran setup_ec2.sh script
- [ ] System packages updated
- [ ] Python 3.10+ installed
- [ ] Nginx installed
- [ ] Certbot installed
- [ ] AWS CLI installed on EC2
- [ ] Created /opt/staffalloc directory

### Step 2.5: Application Deployment
- [ ] Created deployment package
- [ ] Uploaded code to EC2
- [ ] Created Python virtual environment
- [ ] Installed production dependencies
- [ ] Created data directory
- [ ] Initialized database

## Phase 3: AWS Parameter Store

### Step 3.1: Generate Secrets
- [ ] Ran generate-secrets script
- [ ] Saved JWT secret: `__________________` (temporary)

### Step 3.2: Create Parameters
- [ ] Created: `/staffalloc/prod/SECRET_KEY` (SecureString)
- [ ] Created: `/staffalloc/prod/DATABASE_URL` (String)
- [ ] Created: `/staffalloc/prod/CORS_ORIGINS` (String - temporary value)

### Step 3.3: IAM Role
- [ ] Created IAM role: `staffalloc-ec2-role`
- [ ] Attached policy: AmazonSSMReadOnlyAccess
- [ ] Attached role to EC2 instance
- [ ] Tested parameter access from EC2

## Phase 4: Backend Service Configuration

### Step 4.1: Systemd Service
- [ ] Copied staffalloc.service to /etc/systemd/system/
- [ ] Ran systemctl daemon-reload
- [ ] Enabled service
- [ ] Started service
- [ ] Verified service is running
- [ ] Tested health endpoint: `curl http://localhost:8000/health`

### Step 4.2: Nginx Configuration
- [ ] Copied nginx.conf to /etc/nginx/sites-available/
- [ ] Created symbolic link to sites-enabled
- [ ] Removed default site
- [ ] Tested nginx config: `nginx -t`
- [ ] Restarted nginx

### Step 4.3: SSL Certificate
Choose one:

**Option A: Let's Encrypt (with domain)**
- [ ] Domain name: `__________________`
- [ ] DNS pointed to EC2 IP
- [ ] Ran certbot --nginx
- [ ] Certificate installed
- [ ] Auto-renewal configured
- [ ] Tested renewal: `certbot renew --dry-run`

**Option B: Self-Signed (testing)**
- [ ] Generated self-signed certificate
- [ ] Updated nginx config with cert paths
- [ ] Restarted nginx

### Step 4.4: Verification
- [ ] Backend health check works: `http://<EC2-IP>/health`
- [ ] HTTPS redirects working
- [ ] API docs accessible: `https://<EC2-IP>/api/docs`
- [ ] Can create test data via API

## Phase 5: Frontend S3 + CloudFront

### Step 5.1: S3 Bucket
- [ ] Created S3 bucket: `__________________`
- [ ] Region: us-east-1
- [ ] Disabled block public access
- [ ] Enabled static website hosting
- [ ] Set index.html as index document
- [ ] Set index.html as error document
- [ ] Applied bucket policy for public read
- [ ] S3 website endpoint: `__________________`

### Step 5.2: Frontend Build
- [ ] Created .env.production file
- [ ] Set VITE_API_BASE_URL to EC2 URL
- [ ] Ran npm install
- [ ] Ran npm run build
- [ ] Verified dist/ folder created

### Step 5.3: S3 Upload
- [ ] Uploaded dist/ contents to S3
- [ ] Verified files are accessible
- [ ] Tested S3 website endpoint

### Step 5.4: CloudFront Distribution
- [ ] Created CloudFront distribution
- [ ] Origin: S3 bucket
- [ ] Viewer protocol: Redirect HTTP to HTTPS
- [ ] Default root object: index.html
- [ ] Distribution status: Enabled
- [ ] CloudFront URL: `__________________`

### Step 5.5: CloudFront Error Pages
- [ ] Created custom error response for 403 → /index.html (200)
- [ ] Created custom error response for 404 → /index.html (200)

### Step 5.6: Update CORS
- [ ] Updated Parameter Store: /staffalloc/prod/CORS_ORIGINS
- [ ] New value includes CloudFront URL
- [ ] Restarted backend service
- [ ] Tested CORS from CloudFront

## Phase 6: Testing

### Step 6.1: Backend Testing
- [ ] Health endpoint returns 200
- [ ] API documentation loads
- [ ] Can authenticate
- [ ] Can create/read/update/delete resources

### Step 6.2: Frontend Testing
- [ ] CloudFront URL loads
- [ ] No console errors
- [ ] Login page displays
- [ ] Can login successfully
- [ ] All pages navigate correctly

### Step 6.3: Integration Testing
- [ ] Frontend → Backend API calls work
- [ ] CORS allows requests
- [ ] Authentication persists
- [ ] Data operations work end-to-end
- [ ] No mixed content warnings

## Phase 7: Monitoring & Maintenance

### Step 7.1: CloudWatch
- [ ] EC2 metrics visible in CloudWatch
- [ ] Optional: Created alarm for CPU > 80%
- [ ] Optional: Created alarm for status check failures

### Step 7.2: Billing Alerts
- [ ] Enabled Free Tier usage alerts
- [ ] Enabled billing alerts
- [ ] Email configured for alerts
- [ ] Created budget alert (e.g., $10 threshold)

### Step 7.3: Documentation
- [ ] Recorded all passwords/secrets securely
- [ ] Documented EC2 IP address
- [ ] Documented CloudFront URL
- [ ] Documented S3 bucket name
- [ ] Created runbook for common operations

## Post-Deployment

- [ ] Shared CloudFront URL with team
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] Documented any issues encountered
- [ ] Set calendar reminder for free tier limits

## Emergency Contacts & Info

**EC2 Instance ID:** `__________________`  
**EC2 Public IP:** `__________________`  
**S3 Bucket:** `__________________`  
**CloudFront Distribution ID:** `__________________`  
**IAM User:** `staffalloc-deployer`  
**Region:** `us-east-1`

## Rollback Plan

If issues occur:

1. **Backend issues:**
   ```bash
   sudo systemctl stop staffalloc
   sudo journalctl -u staffalloc -n 100
   # Fix issue, then restart
   sudo systemctl start staffalloc
   ```

2. **Frontend issues:**
   ```bash
   # Redeploy previous version
   git checkout <previous-commit>
   cd reactapp
   npm run build
   aws s3 sync dist/ s3://your-bucket/ --delete
   aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
   ```

3. **Complete rollback:**
   - Stop and terminate EC2 instance
   - Delete CloudFront distribution (wait for status)
   - Empty and delete S3 bucket
   - Delete Parameter Store parameters
   - Delete IAM roles and users

## Notes & Issues

```
Space for notes, issues encountered, and resolutions:






```

## Completion

- [ ] All checklist items completed
- [ ] Application fully functional
- [ ] Monitoring configured
- [ ] Documentation complete
- [ ] Team notified

**Deployment completed on:** `__________________`  
**Deployed by:** `__________________`

