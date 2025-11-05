"""Tests for AI-related endpoints."""

from __future__ import annotations

import pytest


@pytest.fixture
def ai_setup(client, api_prefix):
    role_id = client.post(
        f"{api_prefix}/admin/roles/",
        json={"name": "AI Specialist", "description": "Supports AI workflows"},
    ).json()["id"]

    project_id = client.post(
        f"{api_prefix}/projects/",
        json={
            "name": "AI Project",
            "code": "PRJ-AI",
            "client": "Cyberdyne",
            "start_date": "2025-03-01",
            "sprints": 3,
            "status": "Active",
        },
    ).json()["id"]

    return {"role_id": role_id, "project_id": project_id}


def test_chat_endpoint_placeholder(client, api_prefix):
    response = client.post(
        f"{api_prefix}/ai/chat",
        json={"query": "What is the status of Project X?", "context_limit": 3},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["answer"].startswith("AI chat functionality is not yet implemented")


def test_recommend_staff_placeholder(client, api_prefix, ai_setup):
    payload = {
        "project_id": ai_setup["project_id"],
        "role_id": ai_setup["role_id"],
        "year": 2025,
        "month": 5,
        "required_hours": 120,
    }
    response = client.post(f"{api_prefix}/ai/recommend-staff", json=payload)
    assert response.status_code == 200
    assert response.json()["candidates"] == []


def test_conflict_forecast_balance_and_reindex(client, api_prefix, ai_setup):
    conflicts = client.get(f"{api_prefix}/ai/conflicts")
    assert conflicts.status_code == 200
    assert conflicts.json()["message"].endswith("not yet implemented.")

    forecast = client.get(
        f"{api_prefix}/ai/forecast", params={"months_ahead": 6}
    )
    assert forecast.status_code == 200
    assert forecast.json()["forecast_period_months"] == 6

    balance = client.get(
        f"{api_prefix}/ai/balance-suggestions",
        params={"project_id": ai_setup["project_id"]},
    )
    assert balance.status_code == 200
    assert balance.json()["suggestions"] == []

    reindex = client.post(f"{api_prefix}/ai/reindex")
    assert reindex.status_code == 202
    assert reindex.json()["status"] == "accepted"


