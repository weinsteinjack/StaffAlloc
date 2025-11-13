"""Test script to verify Claude integration."""

import os
import sys
from pathlib import Path

# Add app to path
sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 60)
print("Testing Claude Integration")
print("=" * 60)

# Test 0: Check network connectivity
print("\n0. Checking network connectivity...")
try:
    import socket
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    # Test DNS resolution
    socket.gethostbyname("api.anthropic.com")
    print("   [OK] DNS resolution working (api.anthropic.com)")
    
    # Test HTTPS connectivity
    import httpx
    test_client = httpx.Client(verify=False, timeout=10.0)
    try:
        response = test_client.get("https://api.anthropic.com/")
        print(f"   [OK] HTTPS connectivity working (status: {response.status_code})")
    except Exception as conn_err:
        print(f"   [WARN] HTTPS connection test: {conn_err}")
        print("   Note: This may be normal - proceeding with API test...")
    finally:
        test_client.close()
        
except Exception as e:
    print(f"   [WARN] Network check warning: {e}")
    print("   Proceeding anyway - this check is informational only...")

# Test 1: Check API key
api_key = os.getenv("ANTHROPIC_API_KEY")
print(f"\n1. ANTHROPIC_API_KEY loaded: {'Yes' if api_key else 'No'}")
if api_key:
    print(f"   Key starts with: {api_key[:20]}...")
else:
    print("   ERROR: API key not found!")
    sys.exit(1)

# Test 2: Import anthropic
print("\n2. Testing anthropic SDK import...")
try:
    import anthropic
    print("   Success: anthropic SDK imported")
except ImportError as e:
    print(f"   ERROR: Failed to import anthropic: {e}")
    sys.exit(1)

# Test 3: Initialize Claude client
print("\n3. Initializing Claude client...")
try:
    # Use the same SSL configuration as the production service
    # This disables SSL verification for corporate proxy environments
    import httpx
    http_client = httpx.Client(verify=False, timeout=60.0)
    client = anthropic.Anthropic(api_key=api_key, http_client=http_client)
    print("   Success: Claude client initialized (SSL verification disabled for corporate proxy)")
except Exception as e:
    print(f"   ERROR: Failed to initialize client: {e}")
    sys.exit(1)

# Test 4: Make a simple query
print("\n4. Testing Claude API call...")
print("   (This may take a few seconds...)")
try:
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=100,
        messages=[
            {
                "role": "user",
                "content": "Say 'Hello from Claude!' and nothing else."
            }
        ]
    )
    
    # Extract text from response
    if hasattr(response, "content") and response.content:
        text_blocks = [block.text for block in response.content if hasattr(block, "text")]
        if text_blocks:
            result = "\n".join(text_blocks).strip()
            print(f"   Success: Claude responded with: {result}")
        else:
            print("   ERROR: No text in response")
    else:
        print("   ERROR: Unexpected response format")
        
except Exception as e:
    print(f"   ERROR: API call failed: {e}")
    print("\n   Troubleshooting:")
    print("   - Check your internet connection")
    print("   - Verify your API key is valid at https://console.anthropic.com/")
    print("   - If behind a corporate proxy, SSL verification is already disabled")
    print("   - Check firewall settings (Anthropic API uses api.anthropic.com)")
    print("   - Try running: ping api.anthropic.com")
    sys.exit(1)

# Test 5: Test AI service functions
print("\n5. Testing AI service integration...")
try:
    from app.services.ai.gemini import _call_claude, AIConfigurationError, AIInvocationError
    print("   Success: AI service modules imported")
    
    # Test the _call_claude function
    print("\n6. Testing _call_claude function...")
    answer = _call_claude("What is 2+2? Answer with just the number.", max_output_tokens=50)
    print(f"   Success: _call_claude returned: {answer}")
    
except Exception as e:
    print(f"   ERROR: Failed to test AI service: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 60)
print("All tests passed! Claude integration is working.")
print("=" * 60)

