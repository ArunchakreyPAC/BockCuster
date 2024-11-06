import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Paper, Button, Typography, TextField, MenuItem, FormControl,
  InputLabel, Select, CircularProgress, Card, CardContent
} from '@mui/material';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Weather() {
  const locationsList = ['Albury', 'BadgerysCreek', 'Cobar', 'CoffsHarbour', 'Moree',
       'Newcastle', 'NorahHead', 'NorfolkIsland', 'Penrith', 'Richmond',
       'Sydney', 'SydneyAirport', 'WaggaWagga', 'Williamtown',
       'Wollongong', 'Canberra', 'Tuggeranong', 'MountGinini', 'Ballarat',
       'Bendigo', 'Sale', 'MelbourneAirport', 'Melbourne', 'Mildura',
       'Nhil', 'Portland', 'Watsonia', 'Dartmoor', 'Brisbane', 'Cairns',
       'GoldCoast', 'Townsville', 'Adelaide', 'MountGambier', 'Nuriootpa',
       'Woomera', 'Albany', 'Witchcliffe', 'PearceRAAF', 'PerthAirport',
       'Perth', 'SalmonGums', 'Walpole', 'Hobart', 'Launceston',
       'AliceSprings', 'Darwin', 'Katherine', 'Uluru'];
  
  const [location, setLocation] = useState('Melbourne'); // Set default to Melbourne
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);
  const [currentDatePrediction, setCurrentDatePrediction] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Fetch weather predictions for the selected location and date
      const response = await axios.post(`http://localhost:8000/predict/`, {
        location: location,
        start_date: startDate,
        days: 7,
      });
      const predictions = response.data.predictions;

      // Set predictions to display in the chart
      setChartData({
        labels: predictions.map((pred) => pred.Date.slice(0, 10)),
        datasets: [
          {
            label: 'Min Temperature (°C)',
            data: predictions.map((pred) => pred.Predicted_Min_Temp),
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
          },
          {
            label: 'Max Temperature (°C)',
            data: predictions.map((pred) => pred.Predicted_Max_Temp),
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,

          },
          {
            label: 'Chance of Rain (%)',
            data: predictions.map((pred) => pred.Predicted_ChanceOfRain),
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false,
          },
          {
            label: 'Rainfall (mm)',
            data: predictions.map((pred) => pred.Rainfall),
            borderColor: 'rgba(153, 102, 255, 1)',
            fill: false,
          },
        ],
      });

      // Set current date prediction (displayed in the left container)
      setCurrentDatePrediction(predictions[0]);
    } catch (err) {
      setError('Error fetching predictions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    const fetchCurrentDatePrediction = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`http://localhost:8000/predict/`, {
          location: 'Melbourne',
          start_date: new Date().toISOString().split('T')[0],
          days: 1,
        });
        setCurrentDatePrediction(response.data.predictions[0]);
      } catch (err) {
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentDatePrediction();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4} justifyContent="center" sx={{mt:4}}>
        {/* Prediction Card */}
        <Grid container item xs={12} md={4} direction={{ xs: 'column', md: 'row' }}>
          <Card elevation={3} sx={{ p: 3, backgroundColor:'#202B3D', color:'white' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom align="center">
                {location}
              </Typography>
              <Typography variant="h5" gutterBottom align="center">
                Weather Prediction for {currentDatePrediction?.Date.split('T')[0] || "N/A"}
              </Typography>
              <Grid container spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ backgroundColor: '#324057', color: 'white', p: 1, textAlign: 'center' }}>
                    <Typography variant="body1"><strong>Min Temperature</strong></Typography>
                    <Typography variant="h5">{currentDatePrediction?.Predicted_Min_Temp?.toFixed(2) || "N/A"}°C</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ backgroundColor: '#324057', color: 'white', p: 1, textAlign: 'center' }}>
                    <Typography variant="body1"><strong>Max Temperature</strong></Typography>
                    <Typography variant="h5">{currentDatePrediction?.Predicted_Max_Temp?.toFixed(2) || "N/A"}°C</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ backgroundColor: '#324057', color: 'white', p: 1, textAlign: 'center' }}>
                    <Typography variant="body1"><strong>Chance of Rain</strong></Typography>
                    <Typography variant="h5">{currentDatePrediction?.Predicted_ChanceOfRain?.toFixed(2) || "N/A"}%</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ backgroundColor: '#324057', color: 'white', p: 1, textAlign: 'center' }}>
                    <Typography variant="body1"><strong>Rainfall</strong></Typography>
                    <Typography variant="h5">{currentDatePrediction?.Rainfall?.toFixed(2) || "N/A"} mm</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Predictor Form */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Weather Predictor
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Location</InputLabel>
                    <Select
                      label="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      {locationsList.map((loc) => (
                        <MenuItem key={loc} value={loc}>
                          {loc}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : 'Predict'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
          
          {chartData && (
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
              <Typography variant="h5" gutterBottom>
                Predicted Weather Data
              </Typography>
              <Line data={chartData} options={{ responsive: true }} />
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Weather;
