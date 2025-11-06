var React = window.React;
window.Components = window.Components || {};

const statusChipClass = function (status) {
  var normalized = (status || "").toLowerCase();
  if (normalized === "active") return "status-chip active";
  if (normalized === "planning") return "status-chip planning";
  if (normalized === "on hold" || normalized === "on_hold") return "status-chip onhold";
  return "status-chip";
};

function ProjectsList(props) {
  var projects = props.projects || [];
  var isLoading = props.isLoading || false;
  var selectedId = props.selectedId;
  var onSelectProject = props.onSelectProject;

  function handleSelect(projectId) {
    if (typeof onSelectProject === "function") {
      onSelectProject(projectId);
    }
  }

  return (
    React.createElement("div", null,
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
        React.createElement("div", null,
          React.createElement("h3", { style: { margin: 0 } }, "Projects"),
          React.createElement("p", { style: { margin: "0.35rem 0 0", color: "#6b7280" } },
            "Populated from ",
            React.createElement("code", null, "/api/v1/projects/"),
            "."
          )
        ),
        React.createElement("span", { className: "badge" }, projects.length, " total")
      ),
      isLoading ? (
        React.createElement("p", { style: { marginTop: "1rem", color: "#6b7280" } }, "Loading projects…")
      ) : projects.length === 0 ? (
        React.createElement("div", { style: { textAlign: "center", padding: "1.5rem 0" } },
          React.createElement("p", { style: { margin: 0, color: "#6b7280" } }, "No projects found.")
        )
      ) : (
        React.createElement("div", { style: { marginTop: "1rem", overflowX: "auto" } },
          React.createElement("table", null,
            React.createElement("thead", null,
              React.createElement("tr", null,
                React.createElement("th", null, "Code"),
                React.createElement("th", null, "Name"),
                React.createElement("th", null, "Client"),
                React.createElement("th", null, "Status"),
                React.createElement("th", null, "Manager")
              )
            ),
            React.createElement("tbody", null,
              projects.map(function (project) {
                var manager = project.manager || {};
                var managerName = manager.full_name || manager.name || "Unassigned";
                var status = project.status || "unknown";
                return React.createElement("tr", {
                  key: project.id,
                  onClick: function () { handleSelect(project.id); },
                  style: {
                    cursor: "pointer",
                    background: project.id === selectedId ? "rgba(59, 130, 246, 0.12)" : undefined
                  }
                },
                  React.createElement("td", { style: { fontWeight: 600, color: "#1d4ed8" } }, project.code),
                  React.createElement("td", null, project.name),
                  React.createElement("td", null, project.client || "—"),
                  React.createElement("td", null,
                    React.createElement("span", { className: statusChipClass(status) }, status.toLowerCase())
                  ),
                  React.createElement("td", null, managerName)
                );
              })
            )
          )
        )
      )
    )
  );
}

window.Components.ProjectsList = ProjectsList;