var React = window.React;
window.Components = window.Components || {};

function EmployeesList(props) {
  var employees = props.employees || [];
  var isLoading = props.isLoading || false;

  function renderRows() {
    return employees.map(function (employee) {
      var statusClass = employee.is_active ? "status-chip active" : "status-chip onhold";
      var created = employee.created_at ? new Date(employee.created_at).toLocaleDateString() : "";
      return React.createElement("tr", { key: employee.id },
        React.createElement("td", { style: { fontWeight: 600 } }, employee.full_name),
        React.createElement("td", null, employee.email),
        React.createElement("td", null, employee.system_role),
        React.createElement("td", null,
          React.createElement("span", { className: statusClass }, employee.is_active ? "active" : "inactive")
        ),
        React.createElement("td", null, created)
      );
    });
  }

  return React.createElement("div", null,
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
      React.createElement("div", null,
        React.createElement("h3", { style: { margin: 0 } }, "Employees"),
        React.createElement("p", { style: { margin: "0.35rem 0 0", color: "#6b7280" } },
          "Populated from ",
          React.createElement("code", null, "/api/v1/employees/"),
          "."
        )
      ),
      React.createElement("span", { className: "badge" }, employees.length, " total")
    ),
    isLoading ? (
      React.createElement("p", { style: { marginTop: "1rem", color: "#6b7280" } }, "Loading employees…")
    ) : employees.length === 0 ? (
      React.createElement("div", { style: { textAlign: "center", padding: "1.5rem 0" } },
        React.createElement("p", { style: { margin: 0, color: "#6b7280" } }, "No employees found.")
      )
    ) : (
      React.createElement("div", { style: { marginTop: "1rem", overflowX: "auto" } },
        React.createElement("table", null,
          React.createElement("thead", null,
            React.createElement("tr", null,
              React.createElement("th", null, "Name"),
              React.createElement("th", null, "Email"),
              React.createElement("th", null, "Role"),
              React.createElement("th", null, "Status"),
              React.createElement("th", null, "Created")
            )
          ),
          React.createElement("tbody", null, renderRows())
        )
      )
    )
  );
}

window.Components.EmployeesList = EmployeesList;