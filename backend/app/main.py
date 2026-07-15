from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import experiment, analytics

app = FastAPI(
    title="ML Experiment Tracker API",
    description="API for managing ML experiments.",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(experiment.router)
app.include_router(analytics.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the ML Experiment Tracker API"}
