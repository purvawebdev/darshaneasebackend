from fastapi import FastAPI
from pydantic import BaseModel
import sys

app = FastAPI(
    title="DarshanEase AI Prediction Service",
    description="ML Microservice for Crowd Prediction",
    version="1.0.0"
)

class CheckHealthResponse(BaseModel):
    status: str
    python_version: str

@app.get("/health", response_model=CheckHealthResponse)
def health_check():
    return {
        "status": "healthy",
        "python_version": sys.version
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to DarshanEase AI Service"}

from models.prediction_schemas import PredictionRequest, PredictionResponse
from services.ml_engine import predictor

@app.post("/predict", response_model=PredictionResponse)
def predict_crowd(req: PredictionRequest):
    # Parse hour from startTime (HH:mm)
    try:
        hour = int(req.startTime.split(":")[0])
    except Exception:
        hour = 12
        
    crowd_level, wait_time, confidence = predictor.predict(
        historical_fill_rate=req.historical_fill_rate,
        is_weekend=req.is_weekend,
        is_festival=req.is_festival or False,
        hour_of_day=hour
    )
    
    return PredictionResponse(
        crowd_level=crowd_level,
        estimated_wait_time_mins=wait_time,
        confidence_score=confidence
    )
