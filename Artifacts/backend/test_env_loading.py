"""Test script to verify .env file is loaded correctly."""

import os
import sys
from pathlib import Path

# Add app to path
sys.path.insert(0, str(Path(__file__).parent))

print("=" * 60)
print("Testing .env File Loading")
print("=" * 60)

# Test 1: Check current working directory
print(f"\n1. Current working directory: {os.getcwd()}")

# Test 2: Check if .env exists
env_path = Path(".env")
print(f"\n2. .env file exists in current dir: {env_path.exists()}")
if env_path.exists():
    print(f"   Path: {env_path.absolute()}")

# Test 3: Load dotenv explicitly
from dotenv import load_dotenv
load_dotenv()
print("\n3. load_dotenv() called")

# Test 4: Check Ollama configuration
print("\n4. Checking Ollama configuration...")
from app.core.config import settings
print(f"   OLLAMA_API_URL: {settings.OLLAMA_API_URL}")
print(f"   LLM_MODEL_NAME: {settings.LLM_MODEL_NAME}")

# Test 5: Try importing ollama module
print("\n5. Testing ollama module import...")
try:
    from app.services.ai import ollama
    print("   ✅ Ollama module imported successfully")
    
    # Test 6: Try to check Ollama connectivity
    print("\n6. Testing Ollama server connectivity...")
    try:
        import httpx
        with httpx.Client(timeout=5.0) as client:
            response = client.get(settings.OLLAMA_API_URL)
            if response.status_code == 200:
                print("   ✅ Ollama server is running!")
            else:
                print(f"   ⚠️ Ollama server responded with status: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Cannot connect to Ollama: {e}")
        print(f"   💡 Make sure Ollama is installed and running: ollama serve")
        
except Exception as e:
    print(f"   ❌ Failed to import: {e}")

print("\n" + "=" * 60)
print("Test Complete")
print("=" * 60)

