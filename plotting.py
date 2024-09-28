import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Load data
weather_data = pd.read_csv('datasets/processed_weatherAUS.csv')

# Convert Date column to datetime format
weather_data['Date'] = pd.to_datetime(weather_data['Date'])

# Filter the data to include only the years 2016 & 2017
weather_filtered_data = weather_data[(weather_data['Date'] >= '2016-05-01') & (weather_data['Date'] <= '2017-05-01')]

# Replace with the city you want to view
city = 'Melbourne'
filtered_data = weather_filtered_data[weather_filtered_data['Location'] == city]

# Check if there is data for the specified city
if filtered_data.empty:
    print(f"No data available for the city: {city}")
else:
    # plot the data (Min Temp)
    plt.figure(figsize=(20, 6))
    plt.plot(filtered_data['Date'], filtered_data['MinTemp'],color='blue', label=f'Minimum Temperature in {city}')
    plt.xlabel('Date')
    plt.ylabel('Temperature (°C)')
    plt.title(f'Min Temperature vs Date in {city}')
    plt.show()

    # plot the data (Max Temp)
    plt.figure(figsize=(20, 6))
    plt.plot(filtered_data['Date'], filtered_data['MaxTemp'],color='red', label=f'Maximum Temperature in {city}')
    plt.xlabel('Date')
    plt.ylabel('Temperature (°C)')
    plt.title(f'Max Temperature vs Date in {city}')
    plt.show()

    #plot the data (Rainfall)
    plt.figure(figsize=(20, 6))
    plt.plot(filtered_data['Date'], filtered_data['Rainfall'], color='green', label=f'Rainfall in {city}')
    plt.xlabel('Date')
    plt.ylabel('Rainfall (mm)')
    plt.title(f'Rainfall vs Date in {city}')
    plt.show()

# Load Flu data
flu_data = pd.read_csv('../datasets/people_per_date.csv')

#convert Date column to datetime format
flu_data['Week Ending (Friday)'] = pd.to_datetime(flu_data['Week Ending (Friday)'])

# Filter the data to include only the years 2016 and 2017
flu_filtered_data = flu_data[(flu_data['Week Ending (Friday)'] >= '2016-05-01') & (flu_data['Week Ending (Friday)'] <= '2017-05-01')]

#plot the data (flu)
plt.figure(figsize=(20, 6))
plt.plot(flu_filtered_data['Week Ending (Friday)'],flu_filtered_data['Number of Sick People'], color='orange', label='Flu patients')
plt.xlabel('Week Ending (Friday)')
plt.ylabel('Flu patients')
plt.title('Flu Patients vs Week Ending (Friday)')
plt.show()