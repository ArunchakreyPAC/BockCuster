from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from pathlib import Path
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


@app.get("/predict/{location}/{start_date}")
async def get_predict(location: str, start_date: str):
    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
        future_dates = pd.date_range(start=start_date, periods=7, freq='D')
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format.")
    
    try: 
        model = WeatherPredictionModel(location)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=f"Required model file not found. {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error initializing model: {str(e)}")
    
    try: 
        predictions = model.predict(future_dates)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"error during prediciton: {str(e)}")
    
    predictions_output = predictions.to_dict(orient="records")
    return {
        "location": location,
        "start_date": start_date.strftime("%Y-%m-%d"),
        "predictions": predictions_output
    }



@app.get("/test-load-models/{location}")
async def test_load_models(location: str):
    base_path = Path(__file__).parent / 'trained_model'
    min_temp_model_file = base_path / f'min_temp_model_{location}.pkl'
    max_temp_model_file = base_path / f'max_temp_model_{location}.pkl'
    rain_model_file = base_path / f'rain_model_{location}.pkl'
    scaler_file = base_path / f'model_scaler_{location}.pkl'

    files_exist = {
        "min_temp_model_exists": min_temp_model_file.is_file(),
        "max_temp_model_exists": max_temp_model_file.is_file(),
        "rain_model_exists": rain_model_file.is_file(),
        "scaler_exists": scaler_file.is_file(),
    }

    print("Model paths and existence status:", files_exist)

    try:
        model = WeatherPredictionModel(location)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=f'file node found: {e.filename}')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"status": "Models loaded successfully", "file_status": files_exist}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)