import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button, Box,
  Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, TextField,
  Switch, Snackbar, Alert, Fab, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, CircularProgress, LinearProgress, Chip, Avatar, Divider, Paper, MenuItem, FormControl,
  InputLabel, Select
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { useCallback } from 'react';

function Weather(){
//Error Handling
const locationsList = [ 'Adelaide', 'Albany', 'Albury', 'AliceSprings', 'BadgerysCreek',  'Ballarat', 
    'Bendigo', 'Brisbane', 'Cairns', 'Canberra', 'Cobar',  'CoffsHarbour', 'Dartmoor', 'Darwin', 'GoldCoast', 
    'Hobart',  'Katherine', 'Launceston', 'Melbourne', 'MelbourneAirport',  'Mildura', 'Moree', 'MountGambier', 
    'MountGinini', 'Newcastle',  'Nhil', 'NorahHead', 'NorfolkIsland', 'Nuriootpa', 'PearceRAAF',  'Penrith', 
    'Perth', 'PerthAirport', 'Portland', 'Richmond',  'Sale', 'SalmonGums', 'Sydney', 'SydneyAirport', 'Townsville',
      'Tuggeranong', 'Uluru', 'WaggaWagga', 'Walpole', 'Watsonia',  'Williamtown', 'Witchcliffe', 'Wollongong', 'Woomera']
  ;
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState('');
  const [locations, setLocations] = useState('');
  const [predictedMaxTemperature, setPredictedMaxTemperature] = useState(null);
  const [predictedMinTemperature, setPredictedMinTemperature] = useState(null);
  const [predictedChanceofRain, setPredictedChanceofRain] = useState(null);
  const [predictedRain, setPredictedRain] = useState(null)
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);

  const handleSubmitTemperature = async (e) => {
    e.preventDefault();
    setError('');
    setPredictedMaxTemperature(null);
    setPredictedMinTemperature(null);
    setPredictedChanceofRain(null);
    setPredictedRain(null);
    setLoading(null);
    setLoading(true);

    try{
      //Try getting values
      const response = await axios.get(``)
      setPredictedMaxTemperature(response.data.predicted_temperature)

      //Preparing the data for the chart
    } catch(err){
      setError('Error Predicting. Please Try again')
    }
    finally{
      setLoading(false);
    }
  }

  return(
    <Container component="main" sx={{ mt:10, mb:5, flex:1}}>
    <Paper elevation={2} sx={{p:3, mb:3}}>
      <form onSubmit={handleSubmitTemperature}>
        <Grid container spacing={2} direction="column">
          <Grid item xs={12} sm={6}>
            <Typography fullWidth varaint="h4" component="h1" sx={{ pb:3, fontWeight:"200"}}>
              Temperature Predictor
            </Typography>
          </Grid>
          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} >
              <TextField
                fullWidth
                type = "date"
                variant = "outlined"
                value = {days}
                onChange = {(e) => setDays(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>
                  Location
                </InputLabel>
                <Select
                  label="Locations"
                  value={locations}
                  onChange={(e) => setLocations(e.target.value)}
                >
                  {locationsList.map((locations) => (
                    <MenuItem key={locations} value={locations}>
                      {locations}
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
            {predictedMaxTemperature && (
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Predicted Price: ${predictedMaxTemperature.toLocaleString()}
                </Typography>
                {chartData && (
                  <Box sx={{ mt: 3 }}>
                    <Line 
                      data={chartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Price Predictions by Square Footage'
                          }
                        },
                        scales: {
                          x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                              display: true,
                              text: 'Square Footage'
                            }
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Predicted Price ($)'
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                )}
              </Paper>
            )}
        </Container>
  );
}
export default Weather;