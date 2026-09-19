from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from .ai_service import ask_groq

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models
from .database import engine, get_db


models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Job Market Analytics API",
    description="Backend API for the Job Market Analytics Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["General"])
def get_api_status():
    return {
        "status": "online",
        "service": "Job Market Analytics API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "endpoints": {
            "status": "GET /",
            "list_jobs": "GET /jobs?skip=0&limit=100",
            "get_job": "GET /jobs/{job_id}",
        },
    }


@app.get("/jobs", tags=["Jobs"])
def list_jobs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    if limit < 1:
        raise HTTPException(status_code=400, detail="limit must be >= 1")
    if limit > 500:
        limit = 500
    if skip < 0:
        raise HTTPException(status_code=400, detail="skip must be >= 0")

    jobs = db.query(models.Job).offset(skip).limit(limit).all()

    result = []
    for job in jobs:
        result.append(_job_to_dict(job))

    return {
        "count": len(result),
        "skip": skip,
        "limit": limit,
        "data": result,
    }


@app.get("/jobs/{job_id}", tags=["Jobs"])
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail=f"Job id={job_id} not found")
    return _job_to_dict(job)

class AIQuery(BaseModel):
    question: str


@app.post("/ai/query", tags=["AI"])
def ai_query(
    request: AIQuery,
    db: Session = Depends(get_db),
):
    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty",
        )

    if len(question) > 1000:
        raise HTTPException(
            status_code=400,
            detail="Question is too long",
        )

    try:
        answer = ask_groq(question, db)

        return {
            "question": question,
            "answer": answer,
        }

    except Exception as exc:
        print(f"AI query error: {exc}")

        raise HTTPException(
            status_code=500,
            detail="Unable to generate an AI response",
        )
def _job_to_dict(job: models.Job) -> dict:
    created_val = job.created
    if isinstance(created_val, datetime):
        created_val = created_val.isoformat()
    elif created_val is not None:
        created_val = str(created_val)

    return {
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "average_salary": job.average_salary,
        "contract_type": job.contract_type,
        "category": job.category,
        "created": created_val,
        "description": job.description,
        "redirect_url": job.redirect_url,
        "posting_year": job.posting_year,
        "posting_month": job.posting_month,
        "posting_day": job.posting_day,
        "posting_weekday": job.posting_weekday,
        "city": job.city,
        "state": job.state,
        "skills": job.skills,
    }
