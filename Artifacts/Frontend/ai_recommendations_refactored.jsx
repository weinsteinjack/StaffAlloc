var React = window.React;
window.Components = window.Components || {};

function AiRecommendations(props) {
  var portfolio = props.portfolio || {};
  var forecast = props.forecast || null;
  var isLoading = props.isLoading || false;

  var fteByRole = portfolio.fte_by_role || {};
  var overAllocated = portfolio.over_allocated_employees || [];

  function renderRoleList() {
    var keys = Object.keys(fteByRole);
    if (keys.length === 0) {
      return React.createElement("p", { style: { color: "#6b7280" } }, "No utilisation data yet.");
    }
    return React.createElement("ul", { className: "simple-list" },
      keys.map(function (role) {
        var value = Number(fteByRole[role]);
        var formatted = isNaN(value) ? "0.0" : value.toFixed(1);
        return React.createElement("li", { key: role },
          React.createElement("strong", null, role),
          ": ",
          formatted,
          "%"
        );
      })
    );
  }

  function renderOverAllocated() {
    if (!overAllocated || overAllocated.length === 0) {
      return React.createElement("p", { style: { color: "#6b7280" } }, "All clear - no over-allocations detected.");
    }
    return React.createElement("ul", { className: "simple-list" },
      overAllocated.map(function (item, index) {
        return React.createElement("li", { key: index }, JSON.stringify(item));
      })
    );
  }

  return React.createElement("div", null,
    React.createElement("h3", { style: { margin: 0 } }, "AI Highlights"),
    React.createElement("p", { style: { margin: "0.35rem 0 1rem", color: "#6b7280" } },
      "Based on `/reports/portfolio-dashboard` and `/ai/forecast`."
    ),
    isLoading ? (
      React.createElement("p", { style: { color: "#6b7280" } }, "Generating insights…")
    ) : (
      React.createElement("div", { className: "grid two" },
        React.createElement("div", { className: "card", style: { boxShadow: "none", padding: 0 } },
          React.createElement("h4", { style: { marginTop: 0 } }, "Utilisation by Role"),
          renderRoleList()
        ),
        React.createElement("div", { className: "card", style: { boxShadow: "none", padding: 0 } },
          React.createElement("h4", { style: { marginTop: 0 } }, "Forecast"),
          forecast ? (
            React.createElement("p", { style: { color: "#1d4ed8" } }, forecast.message || "Forecast data unavailable.")
          ) : (
            React.createElement("p", { style: { color: "#6b7280" } }, "No forecast available.")
          )
        )
      )
    ),
    React.createElement("div", { style: { marginTop: "1.5rem" } },
      React.createElement("h4", { style: { marginBottom: "0.5rem" } }, "Over-allocated Employees"),
      renderOverAllocated()
    )
  );
}

window.Components.AiRecommendations = AiRecommendations;