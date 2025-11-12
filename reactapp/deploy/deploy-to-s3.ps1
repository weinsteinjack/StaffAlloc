# StaffAlloc Frontend - S3 Deployment Script (PowerShell)
# This script builds the React app and deploys it to S3 from Windows

param(
    [string]$BucketName = "staffalloc-frontend-prod",
    [string]$CloudFrontDistributionId = ""
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "StaffAlloc Frontend - S3 Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "Error: .env.production file not found!" -ForegroundColor Red
    Write-Host "Please create .env.production with your EC2 API URL" -ForegroundColor Yellow
    Write-Host "Example: Copy-Item .env.production.example .env.production" -ForegroundColor Yellow
    exit 1
}

# Display environment file contents (for verification)
Write-Host "Using production environment configuration:" -ForegroundColor Green
Get-Content .env.production | Where-Object { $_ -notmatch "^#" -and $_ -ne "" }
Write-Host ""

# Ask for confirmation
$confirmation = Read-Host "Is this configuration correct? (y/n)"
if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Build the application
Write-Host "Building React application for production..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if (-not (Test-Path "dist")) {
    Write-Host "Error: Build failed! dist/ directory not found." -ForegroundColor Red
    exit 1
}

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host ""

# Deploy to S3
Write-Host "Deploying to S3 bucket: $BucketName" -ForegroundColor Yellow

# Upload all files except index.html
aws s3 sync dist/ s3://$BucketName/ --delete `
    --cache-control "public, max-age=31536000, immutable" `
    --exclude "index.html" `
    --exclude "*.map"

# Upload index.html separately with no-cache (for SPA routing)
aws s3 cp dist/index.html s3://${BucketName}/index.html `
    --cache-control "no-cache, no-store, must-revalidate" `
    --content-type "text/html"

Write-Host ""
Write-Host "S3 upload completed!" -ForegroundColor Green

# Invalidate CloudFront cache if distribution ID is provided
if ($CloudFrontDistributionId -ne "") {
    Write-Host "Invalidating CloudFront cache..." -ForegroundColor Yellow
    aws cloudfront create-invalidation `
        --distribution-id $CloudFrontDistributionId `
        --paths "/*"
    Write-Host "CloudFront invalidation initiated!" -ForegroundColor Green
} else {
    Write-Host "Note: CloudFrontDistributionId not provided. Skipping CloudFront invalidation." -ForegroundColor Yellow
    Write-Host "Run with -CloudFrontDistributionId parameter to enable automatic cache invalidation." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your frontend is now deployed to:" -ForegroundColor Green
Write-Host "S3 Bucket: https://$BucketName.s3.amazonaws.com" -ForegroundColor White
if ($CloudFrontDistributionId -ne "") {
    Write-Host "CloudFront: Check your distribution URL in AWS Console" -ForegroundColor White
}
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the CloudFront URL in your browser" -ForegroundColor White
Write-Host "2. Verify API connectivity" -ForegroundColor White
Write-Host "3. Test login and core functionality" -ForegroundColor White
Write-Host ""

