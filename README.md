# **Weather and Flu Outbreak Prediction Using Machine Learning**

## Project Overview

This project aims to predict **weather patterns** and **flu outbreaks** using machine learning techniques. The main object is to:

- Predict future weather conditions such as **temperature, rainfall**, and **humidity**. 
- Use these predicted weather conditions to predict the probability of a flu outbreak based on historical flu data.

The project uses **regression and classification models** for weather and flu outbreak prediction. The trained models are evaluated on historical weater and flu data.


## How To Run

1. pip install -r requirements.txt
2. Run on jupyter notebook (.ipynb) file.

## Results

- The **weather prediction models** were evaluated using Mean Squared Error (MSE) and showed reasonable accuracy in predicting temperature, rainfall, and humidity
- The **flu outbreak prediction model** achieved an accuracy of around 80% in predicting outbreaks, based on predicted weather conditions.

## Future Work

- Though our goal was to predict the “chance of catching the flu”, we came up short due to the lack of time. This implementation involves getting the predicted weather data output then put those through a “flu_calculator”, which should be fine tuned to be accurate based on researches. The final output should be the likelihood of getting the flu on that specific day.  
- Improve the accuracy of weather models by incorporating more advanced models such as Neural Networks
- Add more features, such as **pressure, wind direction,** and **population density**, to improve the flu outbreak prediction model.
- 

