from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from model import WeatherPredictionModel
import pandas as pd


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"], # Change this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

model = WeatherPredictionModel(location="Melbourne") # make the location value dynamic


class PredictionInput(BaseModel):
    date_time: int = Field(..., gt=0, description="Date Time")


@app.post("/predict")
async def predict_temperature(input: PredictionInput):
    """
    This function handles the prediction based on input data.
    It takes the date/time and location as inputs,
    and returns the predicted price
    """
    future_dates = pd.date_range(start=input.date_time, periods=7, freq='D')
    predictions = model.predict(future_dates)
    return {"outputted prediction:", predictions}


@app.get("/")
async def root():
    return {"message": "Welcome to our weather prediction app API"}


@app.get("/predict/{date_time}")
async def predict_price(date_time: str):
    future_dates = pd.date_range(start=date_time, periods=7, freq='D')
    predictions = model.predict(future_dates)
    return {predictions}


if __name__ == "__main__":
    import uvicorn 
    uvicorn.run(app, host="0.0.0.0", port=8000)