# Anthropic Claude API Setup for RAG Features

## Overview

The StaffAlloc application's RAG (Retrieval-Augmented Generation) features have been refactored to use Anthropic's Claude Sonnet model instead of Google Gemini. This provides better performance and more reliable AI-powered features.

## Setup Instructions

### 1. Get Your Anthropic API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key or copy your existing one

### 2. Configure Your Environment

Add the following to your `.env` file in the project root:

```env
ANTHROPIC_API_KEY=your_actual_api_key_here
```

**Example `.env` file:**
```env
# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Other settings...
DATABASE_URL=sqlite:///./data/staffalloc.db
SECRET_KEY=your_secret_key_here
```

### 3. Model Configuration

The application uses **Claude 3.5 Sonnet** (`claude-3-5-sonnet-20241022`) by default, which provides:
- Excellent performance for RAG applications
- Large context window (200K tokens)
- Fast response times
- Advanced reasoning capabilities

This is configured in:
- `Artifacts/backend/app/core/config.py` - Application settings
- `Artifacts/backend/app/services/ai/gemini.py` - AI service implementation

### 4. Test Your Configuration

Run the test script to verify your setup:

```bash
cd Artifacts/backend
python test_claude.py
```

Expected output:
```
============================================================
Testing Claude Integration
============================================================

1. ANTHROPIC_API_KEY loaded: Yes
   Key starts with: sk-ant-api03-...

2. Testing anthropic SDK import...
   Success: anthropic SDK imported

3. Initializing Claude client...
   Success: Claude client initialized

4. Testing Claude API call...
   Success: Claude responded with: Hello from Claude!

5. Testing AI service integration...
   Success: AI service modules imported

6. Testing _call_claude function...
   Success: _call_claude returned: 4

============================================================
All tests passed! Claude integration is working.
============================================================
```

## Features Powered by Claude

The following AI features use Claude Sonnet:

### 1. RAG Chat (`/api/v1/ai/chat`)
Ask natural language questions about your staffing data:
- "Who is available this month?"
- "Show me all over-allocated employees"
- "What projects need more staff?"

### 2. Conflict Detection (`/api/v1/ai/conflicts`)
Automatically detect and analyze resource allocation conflicts with AI-powered recommendations.

### 3. Capacity Forecasting (`/api/v1/ai/forecast`)
Get AI-driven insights on future capacity needs and staffing gaps.

### 4. Workload Balancing (`/api/v1/ai/balance-suggestions`)
Receive intelligent suggestions for redistributing work across your team.

### 5. Smart Import (`/api/v1/ai/suggest-mapping`)
Use AI to automatically map spreadsheet headers to expected fields during data import.

## Configuration Details

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes | None | Your Anthropic API key |
| `CLAUDE_MODEL` | No | `claude-3-5-sonnet-20241022` | Claude model to use |

### Application Settings

The configuration is defined in `Artifacts/backend/app/core/config.py`:

```python
# Anthropic Claude API configuration for RAG features
# Set ANTHROPIC_API_KEY in .env file to enable Claude-powered AI features
ANTHROPIC_API_KEY: Optional[str] = None
CLAUDE_MODEL: str = "claude-3-5-sonnet-20241022"  # Claude 3.5 Sonnet
```

## Migration Notes

### Changed from Previous Setup

- **Old API Key:** `WINDSURF_API_KEY` → **New API Key:** `ANTHROPIC_API_KEY`
- **Old Provider:** Windsurf Cascade → **New Provider:** Anthropic Claude direct
- All RAG features now use the official Anthropic SDK

### No Code Changes Required

If you're using the API endpoints, no changes are needed to your frontend or client code. The API contract remains the same:

```typescript
// Example API call (unchanged)
const response = await fetch('/api/v1/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'Who is available this month?',
    context_limit: 5
  })
});
```

## Troubleshooting

### Error: "ANTHROPIC_API_KEY is not configured"

**Solution:** Make sure you have:
1. Created a `.env` file in the project root
2. Added `ANTHROPIC_API_KEY=your_key_here` to the file
3. Restarted the backend server

### Error: "anthropic SDK is not installed"

**Solution:** Install the required package:
```bash
pip install anthropic
```

Or reinstall all dependencies:
```bash
pip install -r requirements.txt
```

### Error: Connection Error / SSL Certificate Issues

**Symptoms:**
- "Connection error" when calling Claude API
- SSL certificate verification failures
- Timeout errors

**Solutions:**

1. **Corporate Proxy Environment** (Most Common):
   The application already includes SSL verification bypass for corporate proxies. Make sure you're using the updated test script:
   ```bash
   cd Artifacts/backend
   python test_claude.py  # Should work with SSL bypass
   ```

2. **Check Network Connectivity**:
   ```bash
   # Test DNS resolution
   ping api.anthropic.com
   
   # Test HTTPS connectivity
   curl -v https://api.anthropic.com/
   ```

3. **Firewall Settings**:
   - Ensure `api.anthropic.com` is not blocked by your firewall
   - Check with your IT department if corporate firewall blocks external AI services
   - You may need to request an exception for Anthropic's API

4. **Proxy Configuration** (if using HTTP proxy):
   Set environment variables:
   ```bash
   export HTTP_PROXY=http://proxy.company.com:8080
   export HTTPS_PROXY=http://proxy.company.com:8080
   export NO_PROXY=localhost,127.0.0.1
   ```

5. **For Production** (Replace SSL bypass with proper certificates):
   ```python
   http_client = httpx.Client(
       verify='/path/to/ca-bundle.crt',
       timeout=60.0
   )
   ```

**Verification:**
The test script now includes network diagnostics:
```bash
python test_claude.py
# Step 0 will test DNS and HTTPS connectivity
```

### Rate Limiting

Anthropic has rate limits on API calls. If you encounter rate limit errors:
1. Wait a moment before retrying
2. Consider reducing the number of concurrent requests
3. Check your Anthropic dashboard for usage limits

## Support

For issues related to:
- **Anthropic API:** Visit [Anthropic Support](https://support.anthropic.com)
- **StaffAlloc Application:** Check the main README or contact your development team

## Related Files

- `Artifacts/backend/app/services/ai/gemini.py` - Core AI service implementation
- `Artifacts/backend/app/services/ai/rag.py` - RAG context retrieval
- `Artifacts/backend/app/api/ai.py` - AI API endpoints
- `Artifacts/backend/app/core/config.py` - Configuration settings
- `Artifacts/backend/test_claude.py` - Integration test script
- `utils/providers/anthropic.py` - Anthropic provider utilities

## API Documentation

For detailed API documentation, see:
- Swagger UI: `http://localhost:8000/docs` (when running locally)
- ReDoc: `http://localhost:8000/redoc`

