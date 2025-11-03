#!/usr/bin/env bash
set -e
cd backend
python -m venv .venv || true
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000