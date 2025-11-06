var React = window.React;
window.Components = window.Components || {};

function AllocationsOverview(props) {
  var project = props.project;
  var assignments = props.assignments || [];
  var isLoading = props.isLoading || false;

  var totalFunded = assignments.reduce(function (sum, item) {
    return sum + (item && item.funded_hours ? item.funded_hours : 0);
  }, 0);

  function renderTable() {
    return React.createElement("div", { style: { marginTop: "1rem", overflowX: "auto" } },
      React.createElement("table", null,
        React.createElement("thead", null,
          React.createElement("tr", null,
            React.createElement("th", null, "Employee"),
            React.createElement("th", null, "Role"),
            React.createElement("th", null, "LCAT"),
            React.createElement("th", null, "Funded Hours")
          )
        ),
        React.createElement("tbody", null,
          assignments.map(function (assignment) {
            var user = assignment.user || {};
            var role = assignment.role || {};
            var lcat = assignment.lcat || {};
            return React.createElement("tr", { key: assignment.id },
              React.createElement("td", null, user.full_name || "Unknown"),
              React.createElement("td", null, role.name || "—"),
              React.createElement("td", null, lcat.name || "—"),
              React.createElement("td", null, assignment.funded_hours)
            );
          })
        )
      )
    );
  }

  return React.createElement("div", null,
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
      React.createElement("div", null,
        React.createElement("h3", { style: { margin: 0 } }, "Project Staffing"),
        React.createElement("p", { style: { margin: "0.35rem 0 0", color: "#6b7280" } },
          project ? "Assignments for " + project.name : "Select a project to view assignments."
        )
      ),
      project ? React.createElement("span", { className: "badge" }, "Total funded: ", totalFunded, " hrs") : null
    ),
    isLoading ? (
      React.createElement("p", { style: { marginTop: "1rem", color: "#6b7280" } }, "Loading assignments…")
    ) : !project ? (
      React.createElement("div", { style: { textAlign: "center", padding: "1.5rem 0" } },
        React.createElement("p", { style: { margin: 0, color: "#6b7280" } }, "Choose a project above to see staffing details.")
      )
    ) : assignments.length === 0 ? (
      React.createElement("div", { style: { textAlign: "center", padding: "1.5rem 0" } },
        React.createElement("p", { style: { margin: 0, color: "#6b7280" } }, "No assignments found for this project.")
      )
    ) : renderTable()
  );
}

window.Components.AllocationsOverview = AllocationsOverview;