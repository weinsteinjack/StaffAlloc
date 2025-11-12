# StaffAlloc Frontend - Deployment Guide

This directory contains deployment scripts and configuration for deploying the React frontend to AWS S3 and CloudFront.

## Files Overview

### 1. `env.production.template`
Template for production environment configuration.

**Setup:**
```bash
# Copy template to .env.production
cp env.production.template .env.production

# Edit with your EC2 backend URL
# Update VITE_API_BASE_URL with your EC2 public IP or domain
```

### 2. `deploy-to-s3.sh` (Linux/Mac)
Bash script to build and deploy the frontend to S3.

**Prerequisites:**
- AWS CLI installed and configured
- Node.js and npm installed
- S3 bucket created
- CloudFront distribution created (optional)

**Usage:**
```bash
cd reactapp
chmod +x deploy/deploy-to-s3.sh

# Edit the script to update your bucket name
# S3_BUCKET="your-bucket-name"
# CLOUDFRONT_DISTRIBUTION_ID="your-distribution-id"

./deploy/deploy-to-s3.sh
```

### 3. `deploy-to-s3.ps1` (Windows PowerShell)
PowerShell script to build and deploy from Windows.

**Usage:**
```powershell
cd reactapp

# Basic deployment
.\deploy\deploy-to-s3.ps1

# With custom bucket name
.\deploy\deploy-to-s3.ps1 -BucketName "your-bucket-name"

# With CloudFront invalidation
.\deploy\deploy-to-s3.ps1 -BucketName "your-bucket-name" -CloudFrontDistributionId "E1234ABCD5678"
```

## Deployment Workflow

### First-Time Setup

1. **Create `.env.production` file:**
   ```bash
   cp ../env.production.template ../.env.production
   # Edit with your actual EC2 URL
   ```

2. **Update deployment scripts with your bucket name**

3. **Ensure AWS CLI is configured:**
   ```bash
   aws configure
   # Enter your Access Key ID and Secret Access Key
   ```

### Regular Deployment

1. **Make code changes in `src/`**

2. **Test locally:**
   ```bash
   npm run dev
   ```

3. **Deploy to production:**
   ```bash
   # Linux/Mac
   ./deploy/deploy-to-s3.sh
   
   # Windows
   .\deploy\deploy-to-s3.ps1
   ```

4. **Verify deployment:**
   - Visit your CloudFront URL
   - Test all functionality
   - Check browser console for errors

## Build Configuration

### Production Build Settings

The `vite.config.ts` is already configured for production builds:

```typescript
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false,  // Disable sourcemaps in production
    minify: 'terser',   // Minification
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
});
```

### Cache Control Strategy

The deployment scripts set appropriate cache headers:

- **Static assets** (JS, CSS, images): 1 year cache (`immutable`)
- **index.html**: No cache (for immediate updates)

### Environment Variables

Available in code via `import.meta.env`:

```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const environment = import.meta.env.VITE_ENVIRONMENT;
```

## CloudFront Configuration

### Cache Behaviors

Recommended settings for CloudFront:

- **Default (*)**: CachingOptimized policy
- **Path**: `/index.html` → CachingDisabled policy

### Custom Error Responses

Configure for React Router:

1. **403 Forbidden:**
   - Response page: `/index.html`
   - HTTP code: 200

2. **404 Not Found:**
   - Response page: `/index.html`
   - HTTP code: 200

### Origin Settings

- **Origin**: S3 bucket (via dropdown)
- **Origin access**: Public
- **Enable Origin Shield**: No (to stay in free tier)

## Troubleshooting

### Build fails

```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### S3 upload fails

```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify bucket exists
aws s3 ls

# Check bucket policy allows public read
aws s3api get-bucket-policy --bucket your-bucket-name
```

### CloudFront shows old version

```bash
# Manual invalidation
aws cloudfront create-invalidation \
  --distribution-id YOUR-DIST-ID \
  --paths "/*"

# Wait 5-10 minutes for invalidation to complete
```

### API calls fail (CORS errors)

1. Check backend CORS configuration includes CloudFront URL
2. Verify API URL in `.env.production` is correct
3. Ensure backend is using HTTPS
4. Check browser console for specific CORS errors

### 404 errors on routes

1. Verify CloudFront custom error responses are configured
2. Check that both 403 and 404 redirect to `/index.html`
3. Ensure S3 bucket has `index.html` as index document

## Manual Deployment (Without Scripts)

If you prefer manual deployment:

```bash
# 1. Build
npm run build

# 2. Upload to S3
aws s3 sync dist/ s3://your-bucket-name/ --delete

# 3. Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR-DIST-ID \
  --paths "/*"
```

## Rollback Procedure

If a deployment has issues:

1. **Build and deploy previous version:**
   ```bash
   git checkout <previous-commit>
   npm install
   ./deploy/deploy-to-s3.sh
   ```

2. **Or restore from S3 versioning** (if enabled):
   ```bash
   aws s3api list-object-versions \
     --bucket your-bucket-name \
     --prefix index.html
   
   # Restore specific version
   aws s3api copy-object \
     --copy-source your-bucket-name/index.html?versionId=VERSION-ID \
     --bucket your-bucket-name \
     --key index.html
   ```

## Performance Optimization

### Bundle Size Analysis

```bash
npm run build -- --mode=analyze
```

### Lighthouse Audit

Use Chrome DevTools → Lighthouse to audit:
- Performance
- Accessibility
- Best Practices
- SEO

### Image Optimization

Ensure images are:
- Compressed (use TinyPNG or similar)
- Properly sized (no oversized images)
- Using modern formats (WebP when possible)

## Security Considerations

- **HTTPS only**: CloudFront enforces HTTPS
- **No sensitive data in frontend**: All secrets in backend
- **Content Security Policy**: Consider adding CSP headers
- **SRI**: Consider Subresource Integrity for critical scripts

## Cost Monitoring

### Free Tier Limits

- **CloudFront**: 1 TB data transfer, 10M requests/month
- **S3**: 5 GB storage, 20K GET requests

### Monitor Usage

```bash
# Check S3 bucket size
aws s3 ls s3://your-bucket-name --recursive --summarize

# CloudFront metrics in AWS Console
# Go to CloudFront → Your Distribution → Monitoring
```

## Automation

### CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
      - name: Deploy to S3
        run: aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }}/ --delete
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Support

For issues or questions:
1. Check AWS CloudWatch logs
2. Review browser console errors
3. Verify all configuration files
4. Test API endpoints directly with curl/Postman

