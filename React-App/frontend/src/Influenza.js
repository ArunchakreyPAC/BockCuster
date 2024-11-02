import React, { useState } from 'react';
import {
  Container, Grid, Paper, Button, Typography, TextField, CircularProgress
} from '@mui/material';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Influenza() {
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState('');
  const [predictedInfluenza, setPredictedInfluenza] = useState(null);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPredictedInfluenza(null);
    setLoading(true);

    try {
      // Make API request
      const response = await axios.get(`http://localhost:8000/predict/${days}`);
      console.log("API Response:", response.data);

      const predictions = response.data.predictions; // Define `predictions` here
      if (!Array.isArray(predictions)) {
        throw new Error("Invalid data format from API");
      }

      setPredictedInfluenza(predictions);

      // Prepare data for chart
      const labels = predictions.map((pred) => pred.Date.slice(0, 10)); // Extracting date
      const fluPred = predictions.map((pred) => pred.Predicted_Flu_Cases);

      // Set up chart data structure
      setChartData({
        labels,
        datasets: [
          {
            label: 'Flu Cases',
            data: fluPred,
            borderColor: 'rgba(255, 99, 132, 1)', // Corrected property name
            fill: false,
          },
        ],
      });
    } catch (err) {
      setError('Error Predicting. Please Try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" sx={{ mt: 10, mb: 5, flex: 1 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} direction="row">
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" component="h1" sx={{ pt: 2, fontWeight: "200" }}>
                Influenza Predictor
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                variant="outlined"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
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
            Predicted Flu Cases
          </Typography>
          <Line data={chartData} options={{ responsive: true }} />
        </Paper>
      )}
    </Container>
  );
}

export default Influenza;
