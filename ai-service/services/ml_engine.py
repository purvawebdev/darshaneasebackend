import os
import joblib
import pandas as pd
from typing import Tuple

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "model.pkl")

class CrowdPredictor:
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
            print("Loaded trained Crowd Prediction model.")
        else:
            print("Warning: No trained model found at model.pkl. Predictions will fallback to heuristics.")

    def predict(self, historical_fill_rate: float, is_weekend: bool, is_festival: bool, hour_of_day: int) -> Tuple[str, int, float]:
        """
        Returns (crowd_level, wait_time_mins, confidence)
        """
        # Feature preparation matching the training data
        features = pd.DataFrame([{
            "historical_fill_rate": historical_fill_rate,
            "is_weekend": int(is_weekend),
            "is_festival": int(is_festival),
            "hour_of_day": hour_of_day
        }])

        if self.model:
            predicted_wait = self.model.predict(features)[0]
            confidence = 0.85 # Mock confidence score based on R2
        else:
            # Fallback heuristic if no model is trained yet
            base_wait = historical_fill_rate * 60
            predicted_wait = base_wait * (1.5 if is_weekend else 1.0) * (2.0 if is_festival else 1.0)
            confidence = 0.50

        # Discretize crowd level
        if predicted_wait > 90:
            crowd_level = "PEAK"
        elif predicted_wait > 45:
            crowd_level = "HIGH"
        elif predicted_wait > 20:
            crowd_level = "MODERATE"
        else:
            crowd_level = "LOW"

        return crowd_level, int(max(0, predicted_wait)), confidence

predictor = CrowdPredictor()
