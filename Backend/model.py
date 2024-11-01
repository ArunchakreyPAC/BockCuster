import numpy as np
import pandas as pd
import pickle
import os
from sklearn.preprocessing import StandardScaler


model_path = os.path.join(os.path.dirname(__file__), 'trained_model')
csv_path = os.path.join(os.path.dirname(__file__), 'merged_data.csv')

try:
    merged_data = pd.read_csv(csv_path)
except FileNotFoundError:
    raise FileNotFoundError(f"CSV file not found at {csv_path}")


class WeatherPredictionModel:
    def __init__(self, location):
        self.location = location
        self.min_temp_model = None
        self.max_temp_model = None
        self.rain_model = None
        self.scaler = None
        self.load_location_models()


    def load_location_models(self):
        # Define paths for models and scaler
        min_temp_model_file = os.path.join(model_path, f'min_temp_model_{self.location}.pkl')
        max_temp_model_file = os.path.join(model_path, f'max_temp_model_{self.location}.pkl')
        rain_model_file = os.path.join(model_path, f'rain_model_{self.location}.pkl')
        scaler_file = os.path.join(model_path, f'model_scaler_{self.location}.pkl')

        # Load models and scaler with error handling
        try:
            with open(min_temp_model_file, 'rb') as file:
                self.min_temp_model = pickle.load(file)
            with open(max_temp_model_file, 'rb') as file:
                self.max_temp_model = pickle.load(file)
            with open(rain_model_file, 'rb') as file:
                self.rain_model = pickle.load(file)
            with open(scaler_file, 'rb') as file:
                self.scaler = pickle.load(file)
            # Check scaler type
            if not isinstance(self.scaler, StandardScaler):
                raise TypeError("Loaded scaler is not a StandardScaler instance.")
        except FileNotFoundError as e:
            raise FileNotFoundError(f"Model file not found: {e.filename}")
        except Exception as e:
            raise RuntimeError(f"Error loading model: {e}")


    def prepare_data(self, future_dates):
        """Prepare features for future dates."""
        future_data = pd.DataFrame(future_dates, columns=['Date'])
        future_data['DayOfYear'] = future_data['Date'].dt.dayofyear
        future_data['DayOfWeek'] = future_data['Date'].dt.dayofweek

        # Load historical averages and print to debug
        print("Future dates DataFrame:", future_data)

        historical_averages = merged_data.groupby('DayOfYear').agg({
            'MinTemp': 'mean',
            'MaxTemp': 'mean',
            'Rainfall': 'mean',
            'WindSpeedAve': 'mean',
            'HumidityAve': 'mean',
            'PressureAve': 'mean',
            'CloudAve': 'mean',
            'Daily_Flu_Cases': 'mean'
        }).reset_index()

        print("Historical averages DataFrame:", historical_averages)

        # Merge historical averages with future dates and print for verification
        future_data = future_data.merge(historical_averages, on='DayOfYear', how='left')
        print("Merged future data with historical averages:", future_data)

        # Scale the data and print the scaled values
        X_future = future_data[['MinTemp', 'MaxTemp', 'Rainfall', 'WindSpeedAve', 'HumidityAve', 
                                'PressureAve', 'CloudAve', 'Daily_Flu_Cases', 'DayOfYear', 'DayOfWeek']].values
        X_future_scaled = self.scaler.transform(X_future)
        print("Scaled future data:", X_future_scaled)

        return future_data, X_future_scaled



    def predict(self, future_dates):
        """Predict weather features for the specified future dates."""
        future_data, X_future_scaled = self.prepare_data(future_dates)

        # Generate predictions and print results for debugging
        try:
            future_data['Predicted_ChanceOfRain'] = np.clip(self.rain_model.predict_proba(X_future_scaled)[:, 1] * 100, 0, 100)
            print("Predicted Chance of Rain:", future_data['Predicted_ChanceOfRain'])

            future_data['Predicted_Min_Temp'] = self.min_temp_model.predict(X_future_scaled)
            print("Predicted Min Temp:", future_data['Predicted_Min_Temp'])

            future_data['Predicted_Max_Temp'] = self.max_temp_model.predict(X_future_scaled)
            print("Predicted Max Temp:", future_data['Predicted_Max_Temp'])

            future_data['Predicted_Rain'] = self.rain_model.predict(X_future_scaled)
            print("Predicted Rain:", future_data['Predicted_Rain'])
        except Exception as e:
            print("Error during prediction:", e)
            raise e

        # Format the output
        predictions_output = future_data[['Date', 'Predicted_Min_Temp', 'Predicted_Max_Temp', 'Predicted_ChanceOfRain', 'Rainfall']]
        print("Predictions output:", predictions_output)
        return predictions_output


# Example usage
if __name__ == "__main__":
    location = 'Melbourne'
    model = WeatherPredictionModel(location)
    
    # Set up future dates for prediction
    future_dates = pd.date_range(start='2024-9-23', periods=7, freq='D')
    
    # Make predictions
    predictions = model.predict(future_dates)