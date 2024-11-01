from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
import pandas as pd
from model import WeatherPredictionModel

app = FastAPI()

class PredictionRequest(BaseModel):
    location: str
    start_date: str
    days: int = 7


@app.post("/predict")
async def predict_weather(request: PredictionRequest):
    # Parse dates
    try:
        start_date = datetime.strptime(request.start_date, "%Y-%m-%d")
        future_dates = pd.date_range(start=start_date, periods=request.days, freq='D')
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")


    # Initialize the model with the requested location
    model = WeatherPredictionModel(request.location)


    # Get predictions
    try:
        predictions = model.predict(future_dates)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

    # convert predictions to a dictionary format
    predictions_output = predictions.to_dict(orient="records")
    return {"location": request.location, "predictions": predictions_output}