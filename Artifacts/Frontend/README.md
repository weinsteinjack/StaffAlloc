# StaffAlloc Frontend MVP

This directory contains a no-build React MVP that consumes the existing FastAPI backend endpoints. React, ReactDOM, and Babel are loaded via CDN so you can run the UI with nothing more than a static file server.

## Prerequisites

- Python 3.10+ (to run the backend and serve the static files)
- The backend dependencies installed (`pip install -r requirements.txt` inside `Artifacts/backend`)

## Running the Backend

```bash
cd Artifacts/backend
python -m uvicorn app.main:app --reload --port 8000
```

Keep this server running while you interact with the frontend. All API calls are made against `http://localhost:8000/api/v1`.

## Serving the Frontend

Use any static file server that can serve `index.html` from this folder. To stay within the CORS origins defined in `app/core/config.py`, serve on port **5173**:

```bash
cd Artifacts/Frontend
python -m http.server 5173
```

Now open <http://localhost:5173> in your browser. The page loads `index.html`, which in turn pulls the JSX components (`projects_refactored.jsx`, `employees_refactored.jsx`, etc.) and the main `App.jsx` file.

## What You Get

- **Projects table** — Populated via `GET /api/v1/projects/`. Selecting a row drives the assignments view.
- **Employees table** — Populated via `GET /api/v1/employees/`.
- **Project staffing** — Shows assignments for the selected project via `GET /api/v1/projects/{id}`.
- **AI highlights** — Combines `GET /api/v1/reports/portfolio-dashboard` and `GET /api/v1/ai/forecast`.
- Inline loading and basic error messaging for each fetch.

## Development Notes

- Components register themselves on `window.Components` so they can be consumed by `App.jsx` without a bundler.
- Styling is handled with lightweight CSS baked into `index.html`.
- If you need to customise API hosts, update the `API_BASE` constant inside `App.jsx`.
- Because Babel transpiles in the browser, this setup is for demos/testing only. For production you should migrate to a bundler (Vite, Create React App, etc.).

## Troubleshooting

- **CORS errors** — Ensure the frontend is served from `http://localhost:5173` (or add your host to `BACKEND_CORS_ORIGINS`).
- **API failures** — Check the FastAPI console for stack traces. The UI surfaces the failing endpoint inside the error card.
- **Blank screen** — Confirm that `index.html` is being served (not downloaded) and that your browser console has no 404 errors for the JSX files.
