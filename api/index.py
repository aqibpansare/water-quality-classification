import os
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np
import joblib

# Initialize FastAPI app
app = FastAPI(
    title="Water Quality Classification API",
    description="Inference API for real-time water potability classification using Random Forest",
    version="1.0.0"
)

# Enable CORS for frontend integration (Vercel and local development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base directories to search for model & scaler artifacts
BASE_DIR = Path(r"C:\Users\Mohammad Aqib\OneDrive\Desktop\archive")
LOCAL_DIR = Path(__file__).resolve().parent

def resolve_path(filename: str) -> Path:
    """Locate artifact either in specified Windows directory, current file's directory, or parent."""
    candidates = [
        BASE_DIR / filename,
        LOCAL_DIR / filename,
        LOCAL_DIR.parent / filename,
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    # Default to BASE_DIR if not found yet (will raise error upon load)
    return BASE_DIR / filename

MODEL_PATH = resolve_path("water_quality_model.pkl")
SCALER_PATH = resolve_path("scaler.pkl")

# Global variables for loaded model and scaler
model = None
scaler = None

def load_artifacts():
    """Load model and scaler into memory."""
    global model, scaler
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")
    if not SCALER_PATH.exists():
        raise FileNotFoundError(f"Scaler file not found at: {SCALER_PATH}")
    
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print(f"Successfully loaded model from {MODEL_PATH}")
    print(f"Successfully loaded scaler from {SCALER_PATH}")

# Attempt global load at startup
try:
    load_artifacts()
except Exception as e:
    print(f"Warning: Artifacts could not be loaded on startup: {e}")


# Input Schema matching the 9 water sensor metrics
class WaterMetricsInput(BaseModel):
    pH: float = Field(..., description="pH value of the water (typically 0-14)", alias="ph")
    Hardness: float = Field(..., description="Capacity of water to precipitate soap in mg/L", alias="hardness")
    Solids: float = Field(..., description="Total dissolved solids in ppm", alias="solids")
    Chloramines: float = Field(..., description="Amount of Chloramines in ppm", alias="chloramines")
    Sulfate: float = Field(..., description="Amount of Sulfates dissolved in mg/L", alias="sulfate")
    Conductivity: float = Field(..., description="Electrical conductivity in μS/cm", alias="conductivity")
    Organic_carbon: float = Field(..., description="Amount of organic carbon in ppm", alias="organic_carbon")
    Trihalomethanes: float = Field(..., description="Amount of Trihalomethanes in μg/L", alias="trihalomethanes")
    Turbidity: float = Field(..., description="Measure of light emitting properties in NTU", alias="turbidity")

    class Config:
        populate_by_name = True


class PredictionOutput(BaseModel):
    prediction: int = Field(..., description="0 for Unsafe, 1 for Safe")
    status: str = Field(..., description="'Safe' or 'Unsafe'")
    is_safe: bool = Field(..., description="True if safe, False if unsafe")
    probability: Optional[float] = Field(None, description="Confidence probability of the prediction")


@app.get("/")
def health_check():
    """Health check endpoint to verify backend status and model readiness."""
    is_ready = model is not None and scaler is not None
    return {
        "status": "online",
        "service": "Water Quality Classification API",
        "artifacts_loaded": is_ready,
        "model_path": str(MODEL_PATH),
        "scaler_path": str(SCALER_PATH)
    }


@app.post("/api/predict", response_model=PredictionOutput)
def predict_water_quality(payload: WaterMetricsInput):
    """
    Accepts 9 raw water quality metrics, scales them, runs model inference,
    and returns a definitive binary safety verdict (0 = Unsafe, 1 = Safe).
    """
    global model, scaler

    # Lazy reload if artifacts were placed in directory after server started
    if model is None or scaler is None:
        try:
            load_artifacts()
        except Exception as err:
            raise HTTPException(
                status_code=503,
                detail=f"Model artifacts not available on server: {str(err)}. Ensure 'water_quality_model.pkl' and 'scaler.pkl' are placed in {BASE_DIR}"
            )

    try:
        # Construct 2D numpy array strictly without pandas
        features = np.array([[
            payload.pH,
            payload.Hardness,
            payload.Solids,
            payload.Chloramines,
            payload.Sulfate,
            payload.Conductivity,
            payload.Organic_carbon,
            payload.Trihalomethanes,
            payload.Turbidity
        ]], dtype=float)

        # Scale features using pre-fitted scaler
        scaled_features = scaler.transform(features)

        # Predict binary class using pre-trained model
        pred_raw = model.predict(scaled_features)
        prediction = int(pred_raw[0])

        # Calculate prediction probability if supported
        probability = None
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(scaled_features)[0]
            probability = float(proba[prediction])

        is_safe = (prediction == 1)
        status_label = "Safe" if is_safe else "Unsafe"

        return PredictionOutput(
            prediction=prediction,
            status=status_label,
            is_safe=is_safe,
            probability=probability
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
