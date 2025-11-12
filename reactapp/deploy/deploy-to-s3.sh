#!/bin/bash
# StaffAlloc Frontend - S3 Deployment Script
# This script builds the React app and deploys it to S3

set -e  # Exit on error

echo "=========================================="
echo "StaffAlloc Frontend - S3 Deployment"
echo "=========================================="
echo ""

# Configuration
S3_BUCKET="staffalloc-frontend-prod"  # Change this to your bucket name
CLOUDFRONT_DISTRIBUTION_ID=""  # Add your CloudFront distribution ID after creation

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "Error: .env.production file not found!"
    echo "Please create .env.production with your EC2 API URL"
    echo "Example: cp .env.production.example .env.production"
    exit 1
fi

# Display environment file contents (for verification)
echo "Using production environment configuration:"
cat .env.production | grep -v "^#" | grep -v "^$"
echo ""

# Ask for confirmation
read -p "Is this configuration correct? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the application
echo "Building React application for production..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "Error: Build failed! dist/ directory not found."
    exit 1
fi

echo "Build completed successfully!"
echo ""

# Deploy to S3
echo "Deploying to S3 bucket: $S3_BUCKET"
aws s3 sync dist/ s3://$S3_BUCKET/ --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "index.html" \
    --exclude "*.map"

# Upload index.html separately with no-cache (for SPA routing)
aws s3 cp dist/index.html s3://$S3_BUCKET/index.html \
    --cache-control "no-cache, no-store, must-revalidate" \
    --content-type "text/html"

echo ""
echo "S3 upload completed!"

# Invalidate CloudFront cache if distribution ID is provided
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*"
    echo "CloudFront invalidation initiated!"
else
    echo "Note: CLOUDFRONT_DISTRIBUTION_ID not set. Skipping CloudFront invalidation."
    echo "Update this script with your distribution ID to enable automatic cache invalidation."
fi

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Your frontend is now deployed to:"
echo "S3 Bucket: https://$S3_BUCKET.s3.amazonaws.com"
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "CloudFront: Check your distribution URL in AWS Console"
fi
echo ""
echo "Next steps:"
echo "1. Test the CloudFront URL in your browser"
echo "2. Verify API connectivity"
echo "3. Test login and core functionality"
echo ""

