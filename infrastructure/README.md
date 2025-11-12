# StaffAlloc Infrastructure Tools

This directory contains helper scripts and documentation for deploying StaffAlloc to AWS.

## Files in This Directory

### 1. `generate-secrets.sh` (Linux/Mac)
Generates cryptographically secure secrets for production deployment.

**Usage:**
```bash
chmod +x generate-secrets.sh
./generate-secrets.sh
```

**Output:**
- Prints JWT secret key to console
- Creates `secrets.txt` file with all secrets
- **Important:** Delete `secrets.txt` after storing secrets in AWS Parameter Store

### 2. `generate-secrets.ps1` (Windows)
PowerShell version of the secret generation script.

**Usage:**
```powershell
.\generate-secrets.ps1
```

**Output:**
- Same as bash version
- Uses .NET cryptography for secure random generation

### 3. `aws-setup-checklist.md`
Comprehensive checklist to track your deployment progress.

**How to use:**
1. Print or open in a text editor
2. Fill in blank fields as you complete tasks
3. Check off items as you complete them
4. Keep for reference and troubleshooting

**Sections:**
- IAM Setup
- EC2 Backend Setup
- Parameter Store Configuration
- Backend Service Configuration
- Frontend S3 + CloudFront
- Testing & Verification
- Monitoring & Maintenance

## Quick Start

### First-Time Deployment

1. **Generate Secrets:**
   ```bash
   # Linux/Mac
   ./generate-secrets.sh
   
   # Windows
   .\generate-secrets.ps1
   ```

2. **Save Secrets:**
   - Copy the JWT secret key
   - Store in AWS Parameter Store (see main deployment guide)
   - Delete `secrets.txt` file

3. **Use the Checklist:**
   - Open `aws-setup-checklist.md`
   - Follow along as you deploy
   - Fill in configuration details
   - Check off completed items

4. **Follow the Main Guide:**
   - See `../AWS-DEPLOYMENT-GUIDE.md` for detailed instructions
   - Reference the checklist to track progress

## Secrets Management

### What Secrets to Generate

1. **JWT_SECRET:** Used for signing authentication tokens
2. **DATABASE_URL:** Database connection string (SQLite for EC2)
3. **CORS_ORIGINS:** Allowed frontend origins (CloudFront URL)

### Where to Store Secrets

**Development:**
- Local `.env` file (never commit to git)

**Production:**
- AWS Systems Manager Parameter Store
- Encrypted with AWS KMS
- Accessed via IAM role (no hardcoded credentials)

### Parameter Store Setup

After generating secrets, create these parameters in AWS:

1. **`/staffalloc/prod/SECRET_KEY`**
   - Type: SecureString
   - Value: Generated JWT secret
   - Description: "JWT signing secret for StaffAlloc"

2. **`/staffalloc/prod/DATABASE_URL`**
   - Type: String
   - Value: `sqlite:///./data/staffalloc.db`
   - Description: "Database connection string"

3. **`/staffalloc/prod/CORS_ORIGINS`**
   - Type: String
   - Value: `https://YOUR-CLOUDFRONT-URL,http://localhost:5173`
   - Description: "Allowed CORS origins"

### AWS CLI Commands

```bash
# Store JWT secret
aws ssm put-parameter \
  --name "/staffalloc/prod/SECRET_KEY" \
  --value "YOUR_GENERATED_SECRET" \
  --type SecureString

# Store database URL
aws ssm put-parameter \
  --name "/staffalloc/prod/DATABASE_URL" \
  --value "sqlite:///./data/staffalloc.db" \
  --type String

# Store CORS origins (update after CloudFront creation)
aws ssm put-parameter \
  --name "/staffalloc/prod/CORS_ORIGINS" \
  --value "https://YOUR-CLOUDFRONT-URL" \
  --type String
```

### Update Existing Parameters

```bash
aws ssm put-parameter \
  --name "/staffalloc/prod/CORS_ORIGINS" \
  --value "https://d1234.cloudfront.net,http://localhost:5173" \
  --overwrite
```

### View Parameters

```bash
# List all parameters
aws ssm describe-parameters

# Get specific parameter
aws ssm get-parameter \
  --name "/staffalloc/prod/SECRET_KEY" \
  --with-decryption
```

## Security Best Practices

### ✅ Do:
- Use strong, randomly generated secrets (use the provided scripts)
- Store secrets in AWS Parameter Store
- Delete local `secrets.txt` after storing in AWS
- Use IAM roles for EC2 to access Parameter Store
- Regularly rotate secrets
- Enable CloudWatch logging for Parameter Store access
- Use SecureString type for sensitive parameters

### ❌ Don't:
- Commit secrets to git
- Share secrets via email or chat
- Store secrets in code or config files
- Use weak or predictable secrets
- Hardcode secrets in application
- Store secrets in plaintext files

## Troubleshooting

### Can't access Parameter Store from EC2

**Issue:** Application can't load secrets from Parameter Store

**Solution:**
1. Verify IAM role is attached to EC2:
   ```bash
   aws sts get-caller-identity
   ```

2. Check IAM role has SSM permissions:
   - Policy: `AmazonSSMReadOnlyAccess` or custom policy with `ssm:GetParameter`

3. Test parameter access:
   ```bash
   aws ssm get-parameter --name /staffalloc/prod/SECRET_KEY --with-decryption
   ```

4. Check parameter exists:
   ```bash
   aws ssm describe-parameters | grep staffalloc
   ```

### Secrets.txt not deleted

**Issue:** Forgot to delete secrets.txt after deployment

**Solution:**
```bash
# Securely delete on Linux/Mac
shred -u secrets.txt

# Or standard delete
rm secrets.txt

# On Windows
Remove-Item secrets.txt
```

### Need to regenerate secrets

**Issue:** Secret compromised or lost

**Solution:**
1. Generate new secret:
   ```bash
   openssl rand -hex 32
   ```

2. Update in Parameter Store:
   ```bash
   aws ssm put-parameter \
     --name "/staffalloc/prod/SECRET_KEY" \
     --value "NEW_SECRET" \
     --overwrite
   ```

3. Restart application:
   ```bash
   ssh -i key.pem ubuntu@<EC2-IP> "sudo systemctl restart staffalloc"
   ```

## Checklist Template

Use `aws-setup-checklist.md` or create your own:

```markdown
## My Deployment

- [ ] Generated secrets
- [ ] Stored in Parameter Store
- [ ] IAM role created
- [ ] IAM role attached to EC2
- [ ] Verified Parameter Store access
- [ ] Updated CORS after CloudFront creation
- [ ] Deleted local secrets.txt

**EC2 IP:** ______________
**CloudFront URL:** ______________
**Deployment Date:** ______________
```

## Additional Resources

- **Main Deployment Guide:** `../AWS-DEPLOYMENT-GUIDE.md`
- **Backend Deploy Scripts:** `../Artifacts/backend/deploy/`
- **Frontend Deploy Scripts:** `../reactapp/deploy/`
- **AWS Parameter Store Docs:** https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
- **AWS Secrets Manager:** https://aws.amazon.com/secrets-manager/ (alternative to Parameter Store)

## Support

For deployment issues:
1. Check the main deployment guide
2. Review AWS CloudWatch logs
3. Verify IAM permissions
4. Test Parameter Store access
5. Check application logs: `sudo journalctl -u staffalloc -f`

---

**Remember:** Security is critical. Never commit secrets to version control!

