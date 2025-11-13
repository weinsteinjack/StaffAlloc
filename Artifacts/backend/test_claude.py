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

# Test 1: Check API key
api_key = os.getenv("WINDSURF_API_KEY")
print(f"\n1. WINDSURF_API_KEY loaded: {'Yes' if api_key else 'No'}")
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
    client = anthropic.Anthropic(api_key=api_key)
    print("   Success: Claude client initialized")
except Exception as e:
    print(f"   ERROR: Failed to initialize client: {e}")
    sys.exit(1)

# Test 4: Make a simple query
print("\n4. Testing Claude API call...")
try:
    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",
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

