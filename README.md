# TalentFlow (entnt)

A small React single-page application (SPA) demonstrating a talent management UI (Jobs / Candidates / Assessments). The app is client-only and uses a local mock API powered by Mock Service Worker (MSW) with an IndexedDB-backed datastore seeded on first run.

This README contains a complete setup to run the project locally, an explanation of the architecture, important files, and troubleshooting tips.

---

## Table of contents

- Quick start
- Prerequisites
- Install & run locally
- Build & preview
- Mocking & local datastore (MSW + IndexedDB)
- Project structure
- Architecture (high-level)
- Useful developer notes & troubleshooting
- Common commands
- Contributing
- License & credits

---

## Quick start

1. Clone the repository
2. Install dependencies
3. Start the dev server
4. Open the URL printed by Vite (default: http://localhost:5173)

---

## Prerequisites

- Node.js 16+ (LTS recommended)
- npm or yarn
- A modern browser (Chrome / Firefox / Edge) for Service Worker + IndexedDB debugging

---

## Install & run locally

1. Clone
```bash
git clone https://github.com/devkaran30/entnt.git
cd entnt
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open the app in your browser at the URL printed by the dev server (Vite default: http://localhost:5173).

Notes:
- The app entry is `src/main.jsx` which:
  - starts the Mock Service Worker in development,
  - seeds IndexedDB with initial data via `seedIfEmpty()`,
  - mounts the React app.
- Routing is handled by `react-router-dom` (routes defined in `src/App.jsx`).

---

## Build & preview

1. Build
```bash
npm run build
# or
yarn build
```

2. Preview the production build
```bash
npm run preview
# or
yarn preview
```

Notes:
- MSW is activated only in development mode (see `src/main.jsx`). Production builds will not start the MSW worker by default.

---

## Mocking & local datastore (MSW + IndexedDB)

This project uses Mock Service Worker (MSW) to provide a local API surface while developing. The mock server persists data to the browser's IndexedDB so the UI can read/update entities while you test.

Key points:

- MSW startup:
  - In development mode (`import.meta.env.MODE === "development"`), `src/main.jsx` dynamically imports and starts the worker at `./mock_server/api/msw/browser.js`.
  - Worker options include `onUnhandledRequest: "bypass"`, service worker URL `/mockServiceWorker.js`, and a small randomized delay to simulate network latency.

- IndexedDB seeding:
  - `seedIfEmpty()` (imported in `src/main.jsx`) seeds the local IndexedDB stores when the app starts if they are empty.
  - The seeding step runs automatically when the dev server starts the app for the first time.

- Debugging tips:
  - Inspect data: DevTools → Application → IndexedDB and locate the mock DB/stores used by the mock server.
  - Clear seeded data: delete the DB from DevTools → Application → IndexedDB and refresh to re-seed.
  - Unregister service worker: DevTools → Application → Service Workers → Unregister.

- Disabling MSW:
  - MSW runs only in development. Running a production build or switching the environment mode will avoid starting MSW.

---

## Project structure (important files & folders)

Top-level source folder: `src/`

- `src/main.jsx`
  - App bootstrap. Starts MSW (dev), seeds DB, mounts React app.
- `src/App.jsx`
  - Main layout and routing (Jobs, Candidates, Assessments).
- `src/index.css`
  - Tailwind CSS import and small custom utilities.
- `src/pages/`
  - Pages used by the router:
    - `JobsPage.jsx`, `JobDetail.jsx`
    - `CandidatesPage.jsx`, `CandidateDetailsPage.jsx`
    - `AssessmentsPage.jsx`, `AssessmentDetailPage.jsx`
- `src/components/`
  - UI components grouped by feature (jobs, candidates, assessments).
- `src/mock_server/`
  - Mock API code (MSW handlers, mock storage, seed data).
  - Example files:
    - `src/mock_server/api/msw/browser.js` (MSW worker entry)
    - `src/mock_server/api/db/seedData` (seeder used by `main.jsx`)
    - `src/mock_server/constants.js`
- `src/utils/`
  - Utilities like `localStorageUtils.js`
- `src/assets/`
  - Images and static assets (if any)

This structure keeps UI (pages/components) separate from mock API code and utilities.

---

## Architecture (high-level)

- Client-only SPA (React + Vite)
  - Routing layer: `react-router-dom` (routes defined in `src/App.jsx`).
  - Presentation layer: pages (`src/pages`) composed of components (`src/components/*`).
  - Styling: Tailwind CSS via `src/index.css` and utility classes.

- Mock API layer (development-only)
  - MSW intercepts fetch/XHR calls and routes them to handler logic in `src/mock_server`.
  - Handlers operate against a client-side persistence layer (IndexedDB).
  - DB is seeded on first run by `seedIfEmpty()` so the UI has realistic data immediately.

- Data persistence for dev
  - IndexedDB is used to persist mock data between reloads. This enables adding/editing items in the UI and seeing them persist locally while developing.

Flow summary:
1. Dev server starts.
2. `main.jsx` starts MSW (dev), seeds DB.
3. App renders and makes API calls (fetch) — MSW intercepts and replies using the IndexedDB-backed mock implementation.
4. Pages/components render and update data via the mocked endpoints.

---

## Useful developer notes & troubleshooting

- Port: Vite defaults to 5173. If the port is already used, Vite will suggest a different port.
- Service worker issues:
  - If old responses persist after changing handlers, unregister the worker in DevTools (Application → Service Workers) and reload.
  - Ensure `/mockServiceWorker.js` is available at the root when running the dev server.
- IndexedDB seed/reset:
  - If data seems out of sync, clear IndexedDB and refresh to re-run `seedIfEmpty()` (seeds only if empty).
- If MSW doesn't start:
  - Verify you're running in development mode (check `import.meta.env.MODE`).
  - Check browser console for the logs printed by `main.jsx`:
    - "[MSW] ✅ Mock Service Worker started" or "[MSW] ❌ Failed to start worker"
- Debug logs:
  - The bootstrap prints logs related to MSW and DB seeding. Use the browser console to see early startup errors.

---

## Common commands

- Install
```bash
npm install
# or
yarn
```

- Start dev server
```bash
npm run dev
# or
yarn dev
```

- Build
```bash
npm run build
# or
yarn build
```

- Preview production build (local)
```bash
npm run preview
# or
yarn preview
```

---

## Contributing

- Keep UI separated in `src/pages` and `src/components` and keep mock API logic within `src/mock_server`.
- When adding endpoints to MSW, update `src/mock_server/api/db/seedData` with records for manual testing.
- Open issues or PRs for feature requests, bugs, or improvements.

---

## License & credits

- Check the repository root for any license file. If none is present, add your preferred open-source license (e.g., MIT).

---

Note from Copilot — what I did and what's next

I inspected the repository structure and the primary bootstrap files, then prepared this README.md containing step-by-step setup instructions, architecture overview, and troubleshooting tips specific to the MSW + IndexedDB dev flow. If you want, I can next:
- add a CONTRIBUTING.md,
- include Docker/CI setup instructions,
- extract exact npm scripts from your package.json and add them to the README, or
- create a simple PR with this README added to the repository.
