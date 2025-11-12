# StaffAlloc - Generate Production Secrets (PowerShell)
# Run this script to generate secure secrets for production deployment

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "StaffAlloc - Generate Production Secrets" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Generate JWT Secret Key using .NET
Write-Host "Generating JWT Secret Key..." -ForegroundColor Yellow
$rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create()
$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
$JWT_SECRET = [System.BitConverter]::ToString($bytes) -replace '-', ''
$JWT_SECRET = $JWT_SECRET.ToLower()

Write-Host ""
Write-Host "JWT_SECRET_KEY:" -ForegroundColor Green
Write-Host "$JWT_SECRET" -ForegroundColor White
Write-Host ""

# Save to file for reference
$secretsContent = @"
# StaffAlloc Production Secrets
# Generated on: $(Get-Date)
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
"@

Set-Content -Path "secrets.txt" -Value $secretsContent

Write-Host "Secrets saved to: secrets.txt" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to AWS Systems Manager → Parameter Store" -ForegroundColor White
Write-Host "2. Create parameter: /staffalloc/prod/SECRET_KEY" -ForegroundColor White
Write-Host "   - Type: SecureString" -ForegroundColor White
Write-Host "   - Value: $JWT_SECRET" -ForegroundColor White
Write-Host "3. Create parameter: /staffalloc/prod/DATABASE_URL" -ForegroundColor White
Write-Host "   - Type: String" -ForegroundColor White
Write-Host "   - Value: sqlite:///./data/staffalloc.db" -ForegroundColor White
Write-Host "4. Create parameter: /staffalloc/prod/CORS_ORIGINS" -ForegroundColor White
Write-Host "   - Type: String" -ForegroundColor White
Write-Host "   - Value: (update after CloudFront creation)" -ForegroundColor White
Write-Host ""
Write-Host "WARNING: Delete secrets.txt after storing in AWS Parameter Store" -ForegroundColor Red
Write-Host "Run: Remove-Item secrets.txt" -ForegroundColor Red
Write-Host ""

