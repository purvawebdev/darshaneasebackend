from pydantic import BaseModel
from typing import Optional

class PredictionRequest(BaseModel):
    templeId: str
    date: str  # YYYY-MM-DD
    startTime: str  # HH:mm
    historical_fill_rate: float
    is_weekend: bool
    is_festival: Optional[bool] = False

class PredictionResponse(BaseModel):
    crowd_level: str  # LOW, MODERATE, HIGH, PEAK
    estimated_wait_time_mins: int
    confidence_score: float
