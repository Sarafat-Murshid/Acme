from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from fastapi.middleware.cors import CORSMiddleware
import time
from .documents import DOCUMENTS


class QueryRequest(BaseModel):
    query: str


app = FastAPI(title="Legal Assistant (Mocked)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/generate')
async def generate(payload: QueryRequest) -> Dict[str, Any]:
    q = payload.query.strip().lower()
    if not q:
        raise HTTPException(status_code=400, detail="Query required")

    time.sleep(0.8) # Simulate processing time

    matches = []
    for d in DOCUMENTS:
        text_l = d['text'].lower()
        if any(tok in text_l for tok in q.split() if len(tok) > 3):
            snippet = d['text'][:140] + ('...' if len(d['text']) > 140 else '')
            matches.append({
            'id': d['id'],
            'title': d['title'],
            'type': d['type'],
            'date': d['date'],
            'snippet': snippet,
            'excerpt': d['text']
            })


    if not matches:
        best = None
        best_score = 0
        q_tokens = [t for t in q.split() if len(t) > 3]
        for d in DOCUMENTS:
            score = sum(1 for t in q_tokens if t in d['text'].lower())
            if score > best_score:
                best = d
                best_score = score
        if best:
            matches.append({
            'id': best['id'],
            'title': best['title'],
            'type': best['type'],
            'date': best['date'],
            'snippet': best['text'][:140] + ('...' if len(best['text']) > 140 else ''),
            'excerpt': best['text']
            })

    summary = f"Found {len(matches)} matching document(s). Top result: {matches[0]['title']}." if matches else "No documents matched your query."

    return { 'summary': summary, 'matches': matches }

@app.get("/health")
async def health():
    return {"status": "ok"}
