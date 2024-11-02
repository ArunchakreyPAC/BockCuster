import numpy as np
import pandas as pd
import pickle
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
merged_data = pd.read_csv('BockCuster/Backend/merged_data.csv')

# Function to load models based on location
def load_location_models(location):
    min_temp_model_file = f'BockCuster/Backend/trained_model/min_temp_model_{location}.pkl'
    max_temp_model_file = f'BockCuster/Backend/trained_model/max_temp_model_{location}.pkl'
    rain_model_file = f'BockCuster/Backend/trained_model/rain_model_{location}.pkl'

    with open(min_temp_model_file, 'rb') as file:
        min_temp_model = pickle.load(file)
        
    with open(max_temp_model_file, 'rb') as file:
        max_temp_model = pickle.load(file)
        
    with open(rain_model_file, 'rb') as file:
        rain_model = pickle.load(file)

    
    return min_temp_model, max_temp_model, rain_model

# Example location for prediction
location = 'Melbourne'  # Replace with desired location

# Load models for the specified location
min_temp_model, max_temp_model, rain_model = load_location_models(location)


# Prepare future date features
future_dates = pd.date_range(start='2024-9-23', periods=7, freq='D')
future_data = pd.DataFrame(future_dates, columns=['Date'])
future_data['DayOfYear'] = future_data['Date'].dt.dayofyear
future_data['DayOfWeek'] = future_data['Date'].dt.dayofweek

# Get historical averages for relevant features
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

# Merge the historical averages with the future date features
future_data = future_data.merge(historical_averages, on='DayOfYear', how='left')

# Scale the features for future dates (convert to NumPy array to avoid feature names warning)
X_future = future_data[['MinTemp', 'MaxTemp', 'Rainfall', 'WindSpeedAve', 'HumidityAve', 'PressureAve', 'CloudAve', 'Daily_Flu_Cases', 'DayOfYear', 'DayOfWeek']].values  # Convert to NumPy array

# Apply the scaling (use the location-specific scaler from training)
X_future_scaled = scaler.transform(X_future)

# Predict ChanceOfRain using the trained Random Forest model
y_future_rain_prob = rain_model.predict_proba(X_future_scaled)[:, 1]  # Probability of rain (class 1)

# Convert probabilities to percentages and clip values to a valid range
future_data['Predicted_ChanceOfRain'] = np.clip(y_future_rain_prob * 100, 0, 100)  # Convert to percentage

# Predict MinTemp and MaxTemp using the trained Linear Regression models
future_data['Predicted_Min_Temp'] = min_temp_model.predict(X_future_scaled)
future_data['Predicted_Max_Temp'] = max_temp_model.predict(X_future_scaled)
future_data['Predicted_Rain'] = rain_model.predict(X_future_scaled)

# Display the predictions in the desired format
predictions_output = future_data[['Date', 'Predicted_Min_Temp', 'Predicted_Max_Temp', 'Predicted_ChanceOfRain', 'Rainfall']]
print(f"\nPredictions for future dates at {location}:")
print(predictions_output)
