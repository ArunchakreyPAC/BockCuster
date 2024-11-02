import React, { useState } from 'react';
import {
  Container, Grid, Paper, Button, Typography, TextField, MenuItem, FormControl,
  InputLabel, Select, CircularProgress
} from '@mui/material';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


// register Chart.js components (THIS IS NECESSARYY)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function Weather() {
  const locationsList = ['Adelaide', 'Albany', 'Albury', 'AliceSprings', 'BadgerysCreek', 'Ballarat', 
    'Bendigo', 'Brisbane', 'Cairns', 'Canberra', 'Cobar', 'CoffsHarbour', 'Dartmoor', 'Darwin', 'GoldCoast', 
    'Hobart', 'Katherine', 'Launceston', 'Melbourne', 'MelbourneAirport', 'Mildura', 'Moree', 'MountGambier', 
    'MountGinini', 'Newcastle', 'Nhil', 'NorahHead', 'NorfolkIsland', 'Nuriootpa', 'PearceRAAF', 'Penrith', 
    'Perth', 'PerthAirport', 'Portland', 'Richmond', 'Sale', 'SalmonGums', 'Sydney', 'SydneyAirport', 'Townsville',
    'Tuggeranong', 'Uluru', 'WaggaWagga', 'Walpole', 'Watsonia', 'Williamtown', 'Witchcliffe', 'Wollongong', 'Woomera'];
  
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);

  const [predictions, setPredictions] = useState(null); // storing raw API response

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:8000/predict/${location}/${startDate}`);
      const predictions = response.data.predictions;

      setPredictions(predictions); // store detched data for JSON display


      // Format data for the chart
      const labels = predictions.map((pred) => pred.Date.slice(0, 10));  // Extract just the date part
      const minTemps = predictions.map((pred) => pred.Predicted_Min_Temp);
      const maxTemps = predictions.map((pred) => pred.Predicted_Max_Temp);
      const rainChances = predictions.map((pred) => pred.Predicted_ChanceOfRain);
      const rainfalls = predictions.map((pred) => pred.Rainfall);


      // setup chart date structure
      setChartData({
        labels,
        datasets: [
          {
            label: 'Min Temperature (°C)',
            data: minTemps,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
          },
          {
            label: 'Max Temperature (°C)',
            data: maxTemps,
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
          },
          {
            label: 'Chance of Rain (%)',
            data: rainChances,
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false,
          },
          {
            label: 'Rainfall (mm)',
            data: rainfalls,
            borderColor: 'rgba(153, 102, 255, 1)',
            fill: false,
          },
        ],
      });


    } catch (err) {
      setError('Error fetching predictions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" sx={{ mt: 10, mb: 5, flex: 1 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Typography variant="h4" component="h1" sx={{ fontWeight: "200" }}>
                Weather Predictor
              </Typography>
            </Grid>
            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
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
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {chartData && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Predicted Weather Data
          </Typography>
          <Line data={chartData} options={{ responsive: true }} />
        </Paper>
      )}
    </Container>
  );
}

export default Weather;
