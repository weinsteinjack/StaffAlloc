#!/bin/bash
# StaffAlloc - Generate Production Secrets
# Run this script to generate secure secrets for production deployment

echo "=========================================="
echo "StaffAlloc - Generate Production Secrets"
echo "=========================================="
echo ""

# Generate JWT Secret Key
echo "Generating JWT Secret Key..."
JWT_SECRET=$(openssl rand -hex 32)
echo ""
echo "JWT_SECRET_KEY:"
echo "$JWT_SECRET"
echo ""

# Save to file for reference
cat > secrets.txt << EOF
# StaffAlloc Production Secrets
# Generated on: $(date)
# 
# IMPORTANT: 
# - Store these in AWS Systems Manager Parameter Store
# - DO NOT commit this file to git
# - Delete this file after storing in AWS

# JWT Secret Key
# Store at: /staffalloc/prod/SECRET_KEY
JWT_SECRET=$JWT_SECRET

# Database URL
# Store at: /staffalloc/prod/DATABASE_URL
DATABASE_URL=sqlite:///./data/staffalloc.db

# CORS Origins (update after CloudFront creation)
# Store at: /staffalloc/prod/CORS_ORIGINS
# Example: https://d1234abcd.cloudfront.net,http://localhost:5173
CORS_ORIGINS=http://localhost:5173
EOF

echo "Secrets saved to: secrets.txt"
echo ""
echo "Next steps:"
echo "1. Go to AWS Systems Manager → Parameter Store"
echo "2. Create parameter: /staffalloc/prod/SECRET_KEY"
echo "   - Type: SecureString"
echo "   - Value: $JWT_SECRET"
echo "3. Create parameter: /staffalloc/prod/DATABASE_URL"
echo "   - Type: String"
echo "   - Value: sqlite:///./data/staffalloc.db"
echo "4. Create parameter: /staffalloc/prod/CORS_ORIGINS"
echo "   - Type: String"
echo "   - Value: (update after CloudFront creation)"
echo ""
echo "WARNING: Delete secrets.txt after storing in AWS Parameter Store"
echo "Run: rm secrets.txt"
echo ""

