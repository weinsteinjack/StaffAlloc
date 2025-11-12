#!/bin/bash
# StaffAlloc Backend - Production Server Startup Script
# This script is used by systemd to start the FastAPI application

set -e  # Exit on error

# Change to application directory
cd /opt/staffalloc

# Activate virtual environment
source venv/bin/activate

# Set environment variables
export ENVIRONMENT=production
export USE_AWS_SECRETS=true
export AWS_REGION=us-east-1

# Create necessary directories if they don't exist
mkdir -p data/reports
mkdir -p data/vector_store

# Initialize database if it doesn't exist
if [ ! -f "data/staffalloc.db" ]; then
    echo "Initializing database..."
    python -c "from app.db.session import create_db_and_tables; create_db_and_tables()"
fi

# Start the application with Uvicorn
# Using 4 workers for better performance on t2.micro (1 vCPU, 1 GB RAM)
# Adjust workers based on your instance type: workers = (2 x CPU cores) + 1
exec uvicorn app.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --workers 2 \
    --log-level info \
    --access-log \
    --no-use-colors \
    --proxy-headers \
    --forwarded-allow-ips='*'

