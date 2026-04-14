"""
AquaYield - FastAPI Backend Server
Serves irrigation predictions via a trained RandomForestRegressor model.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os

# --- App Initialization ---
app = FastAPI(title="AquaYield API", version="1.0.0")

# Configure CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load Trained Model ---
MODEL_PATH = os.path.join(os.path.dirname(__file__), "aquayield_model.pkl")
model = joblib.load(MODEL_PATH)
print("[AquaYield API] Model loaded successfully.")


# --- Request / Response Schemas ---
class PredictionRequest(BaseModel):
    temperature: float
    humidity: float
    soil_moisture: float


class PredictionResponse(BaseModel):
    status: str
    recommended_liters: float


# --- Endpoints ---
@app.get("/")
async def root():
    return {"message": "AquaYield API is running."}


@app.post("/api/predict", response_model=PredictionResponse)
async def predict_irrigation(data: PredictionRequest):
    """Predict recommended irrigation liters per hectare."""
    features = np.array([[data.temperature, data.humidity, data.soil_moisture]])
    prediction = model.predict(features)[0]

    return PredictionResponse(
        status="success",
        recommended_liters=round(float(prediction), 2)
    )
