"""AI service utilities for StaffAlloc."""

from .gemini import (
    AIConfigurationError,
    AIInvocationError,
    generate_chat_response,
    generate_forecast_insights,
    generate_workload_balance_suggestions,
    scan_allocation_conflicts,
    suggest_header_mapping,
)

# Legacy aliases for backward compatibility
GeminiConfigurationError = AIConfigurationError
GeminiInvocationError = AIInvocationError
from .rag import retrieve_rag_context, reindex_rag_cache

__all__ = [
    "AIConfigurationError",
    "AIInvocationError",
    "GeminiConfigurationError",  # Legacy alias
    "GeminiInvocationError",      # Legacy alias
    "generate_chat_response",
    "scan_allocation_conflicts",
    "generate_forecast_insights",
    "generate_workload_balance_suggestions",
    "retrieve_rag_context",
    "reindex_rag_cache",
    "suggest_header_mapping",
]

