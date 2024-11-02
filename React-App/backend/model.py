import numpy as np
import pandas as pd
import pickle
import os
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression


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



class InfluenzaPredictionModel:
    def __init__(self):
        self.flu_model = None

    
    def predict_flu(self, future_dates):

        merged_data_cleaned = merged_data.dropna()

        X_flu = merged_data_cleaned[['MinTemp', 'MaxTemp', 'Rainfall', 'WindSpeedAve', 'HumidityAve', 'PressureAve', 'CloudAve', 'DayOfYear', 'DayOfWeek']]
        y_flu = merged_data_cleaned['Daily_Flu_Cases']

        # splitting the dataset into training and testing sets
        X_train_flu, X_test_flu, y_train_flu, y_test_flu = train_test_split(X_flu, y_flu, test_size=0.2, random_state=42)

        # initialize the linear regression model
        flu_model_lr = LinearRegression()

        # train the model
        flu_model_lr.fit(X_train_flu, y_train_flu)

        # make predictions on the test set
        y_pred_flu_lr = flu_model_lr.predict(X_test_flu)

        # future dates for predictions
        # future_dates = pd.date_range(start=future_dates, periods=7, freq='D')

        # create a dataframe for future dates
        future_data = pd.DataFrame(future_dates, columns=['Date'])
        future_data['DayOfYear'] = future_data['Date'].dt.dayofyear
        future_data['DayOfWeek'] = future_data['Date'].dt.dayofweek

        # use historical averages for weather data
        historical_averages = merged_data_cleaned.groupby('DayOfYear').agg({
            'MinTemp': 'mean',
            'MaxTemp': 'mean',
            'Rainfall': 'mean',
            'WindSpeedAve': 'mean',
            'HumidityAve': 'mean',
            'PressureAve': 'mean',
            'CloudAve': 'mean'
        }).reset_index()


        # merge the historical averages with the future date features
        future_data = future_data.merge(historical_averages, on='DayOfYear', how='left')

        # select features for prediction (ensure it matches the training features)
        X_future = future_data[['MinTemp', 'MaxTemp', 'Rainfall', 'WindSpeedAve', 'HumidityAve', 'PressureAve', 'CloudAve', 'DayOfYear', 'DayOfWeek']]

        # predict flu cases using the trained model
        future_data['Predicted_Flu_Cases'] = flu_model_lr.predict(X_future)

        def classify_flu_risk(predicted_cases):
            if predicted_cases < 50:
                return "Low Risk"
            elif 50 <= predicted_cases <= 150:
                return "Moderate Risk"
            else:
                return "High Risk"

        # apply the classification to the predicted flu cases
        future_data['Flu_Risk_Category'] = future_data['Predicted_Flu_Cases'].apply(classify_flu_risk)


        return future_data[['Date', 'Predicted_Flu_Cases', 'Flu_Risk_Category']]




# Example usage
if __name__ == "__main__":
    location = 'Melbourne'
    # model = WeatherPredictionModel(location)
    model = InfluenzaPredictionModel()
    
    # Set up future dates for prediction
    future_dates = pd.date_range(start='2024-9-23', periods=7, freq='D')
    
    # Make predictions
    predictions = model.predict_flu(future_dates)
    print(predictions)