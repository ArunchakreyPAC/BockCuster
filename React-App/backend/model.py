import numpy as np
import pandas as pd
import pickle
import os
from sklearn.preprocessing import StandardScaler


model_path = os.path.join(os.path.dirname(__file__), 'trained_model')
merged_data = pd.read_csv(os.path.join(os.path.dirname(__file__), 'merged_data.csv'))
#merged_data = pd.read_csv(r"C:\Users\ashle\PycharmProjects\tensorEnv\pythonProject\innovation project\Assignment 3\BockCuster\Backend\merged_data.csv")
scaler = StandardScaler()


class WeatherPredictionModel:
    def __init__(self, location):
        self.location = location
        self.min_temp_model = None
        self.max_temp_model = None
        self.rain_model = None
        self.scaler = None
        self.load_location_models()


    # Function to load models based on location
    def load_location_models(self):
        min_temp_model_file = os.path.join(model_path, f'min_temp_model_{self.location}.pkl')
        max_temp_model_file = os.path.join(model_path, f'max_temp_model_{self.location}.pkl')
        rain_model_file = os.path.join(model_path, f'rain_model_{self.location}.pkl')
        scaler_file = os.path.join(model_path, f'model_scaler_{self.location}.pkl')

        with open(min_temp_model_file, 'rb') as file:
            min_temp_model = pickle.load(file)
            
        with open(max_temp_model_file, 'rb') as file:
            max_temp_model = pickle.load(file)
            
        with open(rain_model_file, 'rb') as file:
            rain_model = pickle.load(file)

        # Load min temp model
        try:
            with open(min_temp_model_file, 'rb') as file:
                self.min_temp_model = pickle.load(file)
        except FileNotFoundError:
            raise FileNotFoundError(f"Min temp model file {min_temp_model_file} not found.")

        # Load max temp model
        try:
            with open(max_temp_model_file, 'rb') as file:
                self.max_temp_model = pickle.load(file)
        except FileNotFoundError:
            raise FileNotFoundError(f"Max temp model file {max_temp_model_file} not found.")

        # Load rain model and check for RandomForestClassifier
        try:
            with open(rain_model_file, 'rb') as file:
                self.rain_model = pickle.load(file)
            if not hasattr(self.rain_model, "predict_proba"):
                raise TypeError("Loaded rain model is not compatible; it should support predict_proba.")
        except FileNotFoundError:
            raise FileNotFoundError(f"Rain model file {rain_model_file} not found.")
        except Exception as e:
            raise RuntimeError(f"Error loading rain model: {e}")

        # Load scaler and ensure it's a StandardScaler
        try:
            with open(scaler_file, 'rb') as file:
                self.scaler = pickle.load(file)
            if not isinstance(self.scaler, StandardScaler):
                raise TypeError("Loaded scaler is not a StandardScaler instance.")
        except FileNotFoundError:
            raise FileNotFoundError(f"Scaler file {scaler_file} not found.")
        except Exception as e:
            raise RuntimeError(f"Error loading scaler: {e}")
            

        return min_temp_model, max_temp_model, rain_model, scaler


    def prepare_data(self, future_dates):
        """Prepare features for future dates."""
        future_data = pd.DataFrame(future_dates, columns=['Date'])
        future_data['DayOfYear'] = future_data['Date'].dt.dayofyear
        future_data['DayOfWeek'] = future_data['Date'].dt.dayofweek

        # Load historical data for merging
        merged_data = pd.read_csv('BockCuster/Backend/merged_data.csv')
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

        # Merge historical averages with future dates
        future_data = future_data.merge(historical_averages, on='DayOfYear', how='left')

        # Select features and apply scaling
        X_future = future_data[['MinTemp', 'MaxTemp', 'Rainfall', 'WindSpeedAve', 'HumidityAve', 
                                'PressureAve', 'CloudAve', 'Daily_Flu_Cases', 'DayOfYear', 'DayOfWeek']].values
        X_future_scaled = self.scaler.transform(X_future)
        return future_data, X_future_scaled



    def predict(self, future_dates):
        """Predict weather features for the specified future dates."""
        future_data, X_future_scaled = self.prepare_data(future_dates)

        # Make predictions
        future_data['Predicted_ChanceOfRain'] = np.clip(self.rain_model.predict_proba(X_future_scaled)[:, 1] * 100, 0, 100)
        future_data['Predicted_Min_Temp'] = self.min_temp_model.predict(X_future_scaled)
        future_data['Predicted_Max_Temp'] = self.max_temp_model.predict(X_future_scaled)
        future_data['Predicted_Rain'] = self.rain_model.predict(X_future_scaled)

        # Display or return results
        predictions_output = future_data[['Date', 'Predicted_Min_Temp', 'Predicted_Max_Temp', 'Predicted_ChanceOfRain', 'Rainfall']]
        # print(f"\nPredictions for future dates at {self.location}:")
        # print(predictions_output)
        return predictions_output

# Example usage
if __name__ == "__main__":
    location = 'Melbourne'
    model = WeatherPredictionModel(location)
    
    # Set up future dates for prediction
    future_dates = pd.date_range(start='2024-9-23', periods=7, freq='D')
    
    # Make predictions
    predictions = model.predict(future_dates)