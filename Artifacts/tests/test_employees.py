"""Employee endpoint tests."""

from __future__ import annotations


def _create_employee(client, api_prefix, email="jane.doe@example.com"):
    payload = {
        "email": email,
        "full_name": "Jane Doe",
        "password": "SuperSecret1!",
        "system_role": "Employee",
        "is_active": True,
    }
    return client.post(f"{api_prefix}/employees/", json=payload)


def test_employee_crud_flow(client, api_prefix):
    create_response = _create_employee(client, api_prefix)
    assert create_response.status_code == 201
    employee = create_response.json()
    employee_id = employee["id"]
    assert employee["email"] == "jane.doe@example.com"
    assert employee["system_role"] == "Employee"

    duplicate_response = _create_employee(client, api_prefix)
    assert duplicate_response.status_code == 400

    list_response = client.get(f"{api_prefix}/employees/")
    assert list_response.status_code == 200
    users = list_response.json()
    assert len(users) == 1

    detail_response = client.get(f"{api_prefix}/employees/{employee_id}")
    assert detail_response.status_code == 200
    detail = detail_response.json()
    assert detail["assignments"] == []

    update_payload = {"full_name": "Jane Q. Public", "password": "NewSecret2!"}
    update_response = client.put(
        f"{api_prefix}/employees/{employee_id}", json=update_payload
    )
    assert update_response.status_code == 200
    assert update_response.json()["full_name"] == "Jane Q. Public"

    delete_response = client.delete(f"{api_prefix}/employees/{employee_id}")
    assert delete_response.status_code == 204

    missing_response = client.get(f"{api_prefix}/employees/{employee_id}")
    assert missing_response.status_code == 404


