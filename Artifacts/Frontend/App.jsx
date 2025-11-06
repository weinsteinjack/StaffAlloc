(function () {
  const useEffect = React.useEffect;
  const useMemo = React.useMemo;
  const useState = React.useState;

  const API_BASE = "http://localhost:8000/api/v1";

  const Components = window.Components || {};
  const ProjectsList = Components.ProjectsList || function () { return null; };
  const EmployeesList = Components.EmployeesList || function () { return null; };
  const AllocationsOverview = Components.AllocationsOverview || function () { return null; };
  const AiRecommendations = Components.AiRecommendations || function () { return null; };

  const NAV_LINKS = [
    { label: "Dashboard", href: "#", active: true },
    { label: "Projects", href: "#projects" },
    { label: "Employees", href: "#employees" },
    { label: "Allocations", href: "#allocations" },
    { label: "AI", href: "#ai" }
  ];

  const initialLoadState = {
    projects: true,
    employees: true,
    projectAssignments: true,
    portfolio: true,
    ai: true
  };

  function App() {
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [portfolio, setPortfolio] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [forecast, setForecast] = useState(null);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(initialLoadState);

    useEffect(function () {
      loadProjects();
      loadEmployees();
      loadPortfolio();
      loadForecast();
    }, []);

    useEffect(function () {
      if (selectedProjectId == null) {
        return;
      }
      loadProjectDetails(selectedProjectId);
    }, [selectedProjectId]);

    const handleError = function (label, error) {
      console.error("[StaffAlloc:" + label + "]", error);
      setErrors(function (prev) {
        var message = error && error.message ? error.message : "Unexpected error";
        var alreadyTracked = prev.some(function (entry) {
          return entry.source === label && entry.message === message;
        });
        if (alreadyTracked) {
          return prev;
        }
        return prev.concat([{ source: label, message: message }]);
      });
    };

    const updateLoading = function (key, value) {
      setLoading(function (prev) {
        var next = {};
        for (var prop in prev) {
          if (Object.prototype.hasOwnProperty.call(prev, prop)) {
            next[prop] = prev[prop];
          }
        }
        next[key] = value;
        return next;
      });
    };

    const loadProjects = async function () {
      updateLoading("projects", true);
      try {
        const response = await fetch(API_BASE + "/projects/");
        if (!response.ok) {
          throw new Error("Projects request failed (" + response.status + ")");
        }
        const data = await response.json();
        setProjects(data);
        if (selectedProjectId == null && data && data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      } catch (error) {
        handleError("Projects", error);
      } finally {
        updateLoading("projects", false);
      }
    };

    const loadEmployees = async function () {
      updateLoading("employees", true);
      try {
        const response = await fetch(API_BASE + "/employees/");
        if (!response.ok) {
          throw new Error("Employees request failed (" + response.status + ")");
        }
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        handleError("Employees", error);
      } finally {
        updateLoading("employees", false);
      }
    };

    const loadPortfolio = async function () {
      updateLoading("portfolio", true);
      try {
        const response = await fetch(API_BASE + "/reports/portfolio-dashboard");
        if (!response.ok) {
          throw new Error("Portfolio dashboard failed (" + response.status + ")");
        }
        const data = await response.json();
        setPortfolio(data);
      } catch (error) {
        handleError("Portfolio Dashboard", error);
      } finally {
        updateLoading("portfolio", false);
      }
    };

    const loadForecast = async function () {
      updateLoading("ai", true);
      try {
        const response = await fetch(API_BASE + "/ai/forecast");
        if (!response.ok) {
          throw new Error("AI forecast failed (" + response.status + ")");
        }
        const data = await response.json();
        setForecast(data);
      } catch (error) {
        handleError("AI Forecast", error);
      } finally {
        updateLoading("ai", false);
      }
    };

    const loadProjectDetails = async function (projectId) {
      updateLoading("projectAssignments", true);
      try {
        const response = await fetch(API_BASE + "/projects/" + projectId);
        if (!response.ok) {
          throw new Error("Project " + projectId + " lookup failed (" + response.status + ")");
        }
        const data = await response.json();
        setSelectedProject(data);
        setAssignments(data && data.assignments ? data.assignments : []);
      } catch (error) {
        handleError("Project Detail", error);
      } finally {
        updateLoading("projectAssignments", false);
      }
    };

    const portfolioMetrics = useMemo(function () {
      if (!portfolio) {
        return [];
      }
      var utilizationNumber = typeof portfolio.overall_utilization_pct === "number"
        ? portfolio.overall_utilization_pct
        : 0;
      var utilizationValue = utilizationNumber.toFixed ? utilizationNumber.toFixed(1) + "%" : "0.0%";
      var overAllocatedCount = portfolio.over_allocated_employees && portfolio.over_allocated_employees.length
        ? portfolio.over_allocated_employees.length
        : 0;

      return [
        { label: "Projects", value: portfolio.total_projects },
        { label: "Employees", value: portfolio.total_employees },
        { label: "Utilization", value: utilizationValue },
        { label: "Over-allocated", value: overAllocatedCount }
      ];
    }, [portfolio]);

    return (
      <div className="app-shell">
        <aside className="sidebar">
          <h1>StaffAlloc</h1>
          {NAV_LINKS.map(function (link) {
            var classes = "nav-link" + (link.active ? " active" : "");
            return (
              <a
                key={link.label}
                className={classes}
                href={link.href}
              >
                {link.label}
              </a>
            );
          })}
        </aside>

        <main className="content">
          <div className="grid">
            <header>
              <h2 style={{ margin: 0, fontSize: "1.8rem" }}>Staffing Overview</h2>
              <p style={{ margin: "0.35rem 0 1.25rem", color: "#6b7280" }}>
                Minimal MVP wired directly to the FastAPI backend.
              </p>
              {portfolioMetrics.length > 0 && (
                <div className="metrics">
                  {portfolioMetrics.map(function (metric) {
                    return (
                      <div key={metric.label} className="card metrics-card">
                        <h3>{metric.label}</h3>
                        <p>{metric.value}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </header>

            {errors.length > 0 && (
              <div className="error-card">
                <strong>We hit a few snags:</strong>
                <ul className="simple-list">
                  {errors.map(function (entry, index) {
                    return (
                      <li key={entry.source + "-" + index}>
                        {entry.source}: {entry.message}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <section id="projects" className="card">
              <ProjectsList
                projects={projects}
                isLoading={loading.projects}
                selectedId={selectedProjectId}
                onSelectProject={setSelectedProjectId}
              />
            </section>

            <section id="employees" className="card">
              <EmployeesList employees={employees} isLoading={loading.employees} />
            </section>

            <section id="allocations" className="card">
              <AllocationsOverview
                project={selectedProject}
                assignments={assignments}
                isLoading={loading.projectAssignments}
              />
            </section>

            <section id="ai" className="card">
              <AiRecommendations
                portfolio={portfolio}
                forecast={forecast}
                isLoading={loading.ai || loading.portfolio}
              />
            </section>
          </div>
        </main>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
})();

