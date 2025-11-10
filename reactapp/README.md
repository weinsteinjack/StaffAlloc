# Staff Allocation Frontend (`reactapp`)

This package contains the React + Vite frontend for the Staff Allocation project. The app provides project planning views, staffing assignments, and timeline visualizations while proxying API traffic to the backend service.

## Prerequisites

- Node.js 18.x or newer (LTS recommended)
- npm 9.x or newer (bundled with Node.js)
- Access to the backend API (default proxy target: `http://localhost:8000`)

> **Tip:** Run `node -v` and `npm -v` to confirm the installed versions.

## Installation

1. Open a terminal at the repository root (`220372-AG-AISOFTDEV-Team-1-AINavigators`).
2. Change into the frontend directory:
   ```bash
   cd reactapp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

The command reads `package.json` and installs all runtime and development dependencies, including React, Vite, Tailwind, testing utilities, and animation libraries.

## Key Features

- **Portfolio command center:** Rich dashboards (`/dashboard`) with utilization charts, project health metrics, and Excel export hooks.
- **Project staffing workspace:** Spreadsheet-like allocation grid, monthly overrides, and AI assistance for each project.
- **Teams & timelines:** Directory view with role filters plus `/teams/:id` timeline pages for cross-project availability.
- **AI experiences:** Conversational RAG chat (`/ai/chat`) with presets, maintenance tools, and an AI recommendations hub (`/ai/recommendations`).
- **Admin taxonomy:** Role and LCAT management workspace with create/update/delete flows backed by the `/admin` API.
- **Prototype authentication:** Managers and directors sign in to see their assigned projects while admins retain global access.

## Running the App Locally

1. Start the backend API (if applicable) so the frontend proxy can forward `/api` requests.
2. In the `reactapp` directory, run:
   ```bash
   npm run dev
   ```
3. Open the URL shown in the terminal (defaults to `http://localhost:5173`). Vite provides hot module reloading, so changes in `src/` are reflected immediately.

### Environment Variables

Vite loads variables prefixed with `VITE_`. To override the API proxy target or provide additional configuration, create a `.env` file in `reactapp`:

```bash
cp .env.example .env    # if an example file exists
```

Add entries such as:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

When `VITE_API_BASE_URL` is unset, the proxy falls back to `http://localhost:8000`.

## Other Scripts

- **Build production bundle:**
  ```bash
  npm run build
  ```
  Output goes to `dist/` and can be served by any static host.

- **Preview production build:**
  ```bash
  npm run preview
  ```
  Serves the `dist/` bundle locally at `http://localhost:4173`.

- **Run lint checks:**
  ```bash
  npm run lint
  ```
  Executes ESLint across `.ts` and `.tsx` files.

- **Execute unit tests:**
  ```bash
  npm run test
  ```
  Runs the Vitest suite (JS DOM environment) with React Testing Library and saves coverage reports under `coverage/`.

## Authentication

- Navigate to `/login`, enter a manager or director email from the Employees directory, and supply any password (password verification will be enforced when the backend auth endpoints ship).
- Project Managers automatically see only the projects where they are listed as `manager_id`; Directors and Admins see the full portfolio.
- Use the avatar menu in the main layout to sign out and clear the local session.

## Troubleshooting

- **Port already in use:** Pass `--port <number>` to `npm run dev` or terminate the conflicting process.
- **API calls fail:** Verify the backend is running, and confirm `VITE_API_BASE_URL` matches the backend URL.
- **Dependency errors:** Ensure `npm install` completes without errors, then restart the dev server.
- **Tests hang in PowerShell:** Use `cmd /c npm run test` to avoid execution policy prompts or interactive confirmations.

For additional backend setup instructions, refer to the documentation in `Artifacts/backend/`.


