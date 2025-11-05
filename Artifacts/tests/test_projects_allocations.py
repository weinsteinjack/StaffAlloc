"""Integration tests for project and allocation workflows."""

from __future__ import annotations

from datetime import date


def _create_project(client, api_prefix, code="PRJ-001"):
    payload = {
        "name": "Project Alpha",
        "code": code,
        "client": "Acme Corp",
        "start_date": date.today().isoformat(),
        "sprints": 6,
        "status": "Active",
    }
    return client.post(f"{api_prefix}/projects/", json=payload)


def test_project_crud_and_overrides(client, api_prefix):
    create_response = _create_project(client, api_prefix)
    assert create_response.status_code == 201
    project = create_response.json()
    project_id = project["id"]

    list_response = client.get(f"{api_prefix}/projects/")
    assert list_response.status_code == 200
    assert any(p["id"] == project_id for p in list_response.json())

    detail_response = client.get(f"{api_prefix}/projects/{project_id}")
    assert detail_response.status_code == 200
    detail = detail_response.json()
    assert detail["assignments"] == []
    assert detail["monthly_hour_overrides"] == []

    update_response = client.put(
        f"{api_prefix}/projects/{project_id}",
        json={"status": "Closed", "client": "Globex"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["status"] == "Closed"

    override_payload = {
        "project_id": project_id,
        "year": 2025,
        "month": 1,
        "overridden_hours": 120,
    }
    override_response = client.post(
        f"{api_prefix}/projects/overrides", json=override_payload
    )
    assert override_response.status_code == 201
    override_id = override_response.json()["id"]

    override_update = client.put(
        f"{api_prefix}/projects/overrides/{override_id}",
        json={"overridden_hours": 150},
    )
    assert override_update.status_code == 200
    assert override_update.json()["overridden_hours"] == 150

    delete_override = client.delete(
        f"{api_prefix}/projects/overrides/{override_id}"
    )
    assert delete_override.status_code == 204

    delete_project = client.delete(f"{api_prefix}/projects/{project_id}")
    assert delete_project.status_code == 204

    missing_response = client.get(f"{api_prefix}/projects/{project_id}")
    assert missing_response.status_code == 404


def test_allocation_workflow(client, api_prefix):
    role_resp = client.post(
        f"{api_prefix}/admin/roles/",
        json={"name": "Data Analyst", "description": "Analyzes data"},
    )
    assert role_resp.status_code == 201
    role_id = role_resp.json()["id"]

    lcat_resp = client.post(
        f"{api_prefix}/admin/lcats/",
        json={"name": "Level 2", "description": "Mid level"},
    )
    assert lcat_resp.status_code == 201
    lcat_id = lcat_resp.json()["id"]

    user_resp = client.post(
        f"{api_prefix}/employees/",
        json={
            "email": "john.doe@example.com",
            "full_name": "John Doe",
            "password": "Password1!",
            "system_role": "Employee",
            "is_active": True,
        },
    )
    assert user_resp.status_code == 201
    user_id = user_resp.json()["id"]

    project_resp = _create_project(client, api_prefix, code="PRJ-ALLOC")
    assert project_resp.status_code == 201
    project_id = project_resp.json()["id"]

    assignment_payload = {
        "project_id": project_id,
        "user_id": user_id,
        "role_id": role_id,
        "lcat_id": lcat_id,
        "funded_hours": 400,
    }
    assignment_resp = client.post(
        f"{api_prefix}/allocations/assignments", json=assignment_payload
    )
    assert assignment_resp.status_code == 201
    assignment = assignment_resp.json()
    assignment_id = assignment["id"]

    assignment_detail = client.get(
        f"{api_prefix}/allocations/assignments/{assignment_id}"
    )
    assert assignment_detail.status_code == 200
    assert assignment_detail.json()["allocations"] == []

    assignment_update = client.put(
        f"{api_prefix}/allocations/assignments/{assignment_id}",
        json={"funded_hours": 420},
    )
    assert assignment_update.status_code == 200
    assert assignment_update.json()["funded_hours"] == 420

    allocation_payload = {
        "project_assignment_id": assignment_id,
        "year": 2025,
        "month": 2,
        "allocated_hours": 160,
    }
    allocation_resp = client.post(
        f"{api_prefix}/allocations/", json=allocation_payload
    )
    assert allocation_resp.status_code == 201
    allocation_id = allocation_resp.json()["id"]

    allocation_detail = client.get(
        f"{api_prefix}/allocations/{allocation_id}"
    )
    assert allocation_detail.status_code == 200
    assert allocation_detail.json()["allocated_hours"] == 160

    allocation_update = client.put(
        f"{api_prefix}/allocations/{allocation_id}",
        json={"allocated_hours": 170},
    )
    assert allocation_update.status_code == 200
    assert allocation_update.json()["allocated_hours"] == 170

    summary_resp = client.get(
        f"{api_prefix}/allocations/users/{user_id}/summary"
    )
    assert summary_resp.status_code == 200
    summary = summary_resp.json()
    assert summary == [{"year": 2025, "month": 2, "total_hours": 170}]

    delete_allocation = client.delete(
        f"{api_prefix}/allocations/{allocation_id}"
    )
    assert delete_allocation.status_code == 204

    delete_assignment = client.delete(
        f"{api_prefix}/allocations/assignments/{assignment_id}"
    )
    assert delete_assignment.status_code == 204


