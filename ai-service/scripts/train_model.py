import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

def generate_synthetic_data(n=2000):
    np.random.seed(42)
    historical_fill_rate = np.random.uniform(0.1, 1.0, n)
    is_weekend = np.random.binomial(1, 0.28, n)
    is_festival = np.random.binomial(1, 0.05, n)
    hour_of_day = np.random.randint(6, 22, n)
    
    # Target variable: wait time in minutes
    # Base calculation
    wait_time = historical_fill_rate * 45
    
    # Adjustments
    wait_time += is_weekend * 30
    wait_time += is_festival * 60
    
    # Peak hours (e.g. 8-10 AM, 6-8 PM)
    peak_hours_mask = ((hour_of_day >= 8) & (hour_of_day <= 10)) | ((hour_of_day >= 18) & (hour_of_day <= 20))
    wait_time += peak_hours_mask * 25
    
    # Add noise
    wait_time += np.random.normal(0, 10, n)
    wait_time = np.clip(wait_time, 0, 180) # Bound to 0-3 hours
    
    df = pd.DataFrame({
        "historical_fill_rate": historical_fill_rate,
        "is_weekend": is_weekend,
        "is_festival": is_festival,
        "hour_of_day": hour_of_day,
        "wait_time": wait_time
    })
    return df

def train():
    print("Generating synthetic crowd data...")
    df = generate_synthetic_data()
    
    X = df.drop("wait_time", axis=1)
    y = df["wait_time"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Model Evaluation - MSE: {mse:.2f}, R2 Score: {r2:.2f}")
    
    model_path = os.path.join(os.path.dirname(__file__), "..", "model.pkl")
    joblib.dump(model, model_path)
    print(f"Model saved to {os.path.abspath(model_path)}")

if __name__ == "__main__":
    train()
