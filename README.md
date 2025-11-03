# Acme — Fullstack App (Frontend + Backend)

This repository contains a small full-stack application with a Vite-powered frontend and a FastAPI backend. The frontend and backend have their own Dockerfiles and development scripts. This README explains how to install, run, and troubleshoot the project on Windows (PowerShell) and Unix-like systems.

## Table of contents

- Overview
- Prerequisites
- Project structure
- Backend — install & run
- Frontend — install & run
- Docker — build & run images
- Development notes & recommended workflow
- Troubleshooting
- Contributing
- License

## Overview

This repository is split into two main folders:

- `backend/` — Python FastAPI backend (API endpoints, document handling).
- `frontend/` — Vite + React frontend.

Use the instructions below to get the app running locally for development or inside Docker for production-like runs.

## Prerequisites

Make sure you have the following installed on your machine:

- Python 3.10+ (for the backend)
- Node.js 18+ and npm (or pnpm/yarn) (for the frontend)
- Docker (optional — for container runs)
- A POSIX shell (bash) if you plan to use the included shell scripts on Windows (or use WSL/Git Bash)

Notes for Windows PowerShell users:

- To activate virtual environments: `.\\env\\Scripts\\Activate.ps1` (PowerShell) or `.\\env\\Scripts\\activate.bat` (cmd).
- If PowerShell blocks scripts, you may need to update the execution policy (only if you understand the implications):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Project structure

Top-level layout:

- `backend/`
  - `dockerfile` — Dockerfile for backend image
  - `requirements.txt` — Python dependencies
  - `run_backend.sh` — helper script (bash)
  - `app/` — application package (FastAPI app files)
- `frontend/`
  - `dockerfile` — Dockerfile for frontend
  - `package.json` — frontend dependencies & scripts
  - `src/` — React source files

## Backend — install & run

Recommended: create an isolated Python virtual environment and install required packages.

From the repo root (PowerShell):

```powershell
cd .\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
# Start the backend (FastAPI using uvicorn)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Notes:
- If `uvicorn` is not available, it should be listed in `backend/requirements.txt`. Install it with `pip install uvicorn`.
- The `run_backend.sh` file exists for Unix-like systems; use it on macOS/Linux:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
./run_backend.sh
```

Endpoint preview: once running, the API will be available at http://localhost:8000. If FastAPI auto-generated docs are present, check http://localhost:8000/docs.

## Frontend — install & run

From the repo root (PowerShell):

```powershell
cd .\frontend
npm install
# Start the Vite dev server (default port 5173)
npm run dev
```

Common alternatives:
- If you prefer yarn:

```powershell
cd .\frontend
yarn
yarn dev
```

- For macOS/Linux (bash):

```bash
cd frontend
npm install
npm run dev
```

After starting, open the frontend at the URL printed by Vite (commonly http://localhost:5173).

## Running frontend + backend together (local development)

1. Start the backend (port 8000) as shown in the Backend section.
2. Start the frontend (port 5173) as shown in the Frontend section.

By default, if the frontend expects the API at a specific origin, verify the frontend uses the correct backend URL (e.g., `http://localhost:8000`). If necessary, update environment variables in the frontend or proxy settings in `vite.config.js`.

## Docker — build & run images

You can run the services via Docker. From the repo root:

Build backend image:

```powershell
docker build -f backend/dockerfile -t acme-backend:latest ./backend
# Run backend container
docker run --rm -p 8000:8000 acme-backend:latest
```

Build frontend image:

```powershell
docker build -f frontend/dockerfile -t acme-frontend:latest ./frontend
# Run frontend container (adjust port mapping to match Dockerfile or Vite build config)
docker run --rm -p 5173:5173 acme-frontend:latest
```

Notes:
- The provided `dockerfile`s may target production builds (for the frontend they may build static files). If the frontend Dockerfile builds a static site, you may need a static server (e.g., `serve` or `nginx`) to host the built files; check `frontend/dockerfile`.
- If you prefer Docker Compose for local orchestration, create a `docker-compose.yml` mapping frontend and backend ports and networks.

## Development notes & recommended workflow

- Work in separate terminal tabs: one for backend, one for frontend.
- Use the Python virtual environment for backend dependency isolation.
- Use `npm run build` and `npm run preview` for testing production frontend builds.
- If you add new Python packages, update `backend/requirements.txt` (e.g., `pip freeze > requirements.txt`) if appropriate.

## Troubleshooting

- Common issue: `Activate.ps1` blocked by execution policy on Windows. Use `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` if you understand the security implications.
- If ports are in use: check processes using the port and change the `--port` or stop the conflicting service.
- If CORS errors appear when frontend calls backend: ensure backend CORS middleware is configured (FastAPI `CORSMiddleware`) or use Vite proxy for development.
- If the frontend loads blank: open browser DevTools console for errors — usually missing API url, CORS, or bundling issues.

### Manual commands (if bundled shell scripts don't work)

If `./run_backend.sh` or `./run_frontend.sh` fail on your machine (common on Windows/PowerShell), use these explicit manual commands as a fallback.

Backend — manual (PowerShell)

```powershell
cd .\backend
# create and activate venv
python -m venv .venv
.\.venv\Scripts\Activate.ps1
# install dependencies
pip install --upgrade pip
pip install -r requirements.txt
# run using uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend — manual (macOS / Linux)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend — manual (PowerShell)

```powershell
cd .\frontend
npm install
# development
npm run dev

# or build a production bundle and serve the static files (requires a static server):
npm run build
# you can install `serve` globally or use any static file server
npm install -g serve
serve -s dist -l 5173
```

Frontend — manual (macOS / Linux)

```bash
cd frontend
npm install
npm run dev

# or build + serve
npm run build
npx serve -s dist -l 5173
```

Notes on manual fallbacks:
- If `uvicorn` is not installed, it can be added to the backend venv with `pip install uvicorn`.
- On Windows, if `Activate.ps1` is blocked and you can't change policy, use the batch activate script from cmd: `.\.venv\Scripts\activate.bat`.
- If the frontend `npm run dev` fails due to peer/dependency issues, try removing `node_modules` and reinstalling: `rm -r node_modules package-lock.json` (or use Explorer on Windows) then `npm install`.


## Contributing

Feel free to open issues or pull requests. Keep changes small and include tests where applicable. Add documentation updates to this README when adding new features or modifying run instructions.

## License

Specify a license for your project here (e.g., MIT). If no license file exists, add one to clarify reuse terms.

This project is licensed under the MIT License — see the `LICENSE` file in the repository root for full text.

---
