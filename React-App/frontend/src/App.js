import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button, Box,
  Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, TextField,
  Switch, Snackbar, Alert, Fab, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, CircularProgress, LinearProgress, Chip, Avatar, Divider, Paper, MenuItem, FormControl,
  InputLabel, Select
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Mail as MailIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Link} from 'react-router-dom';
import Influenza from './Influenza'
import Weather from './Weather'
import './App.css';

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem button component={Link} to="/" key="Home">
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/about" key="About">
          <ListItemIcon><InfoIcon /></ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
      </List>
      <Divider/>
        <List>
          <ListItem button component={Link} to="/Weather">
            <ListItemText primary = "Weather Predictor"/>
          </ListItem>
        </List>
        <List>
          <ListItem button component={Link} to="/Influenza">
            <ListItemText primary = "Influenza Predictor"/>
          </ListItem>
        </List>
    </Box>
  );
//List of Locations
  const locationsList = [ 'Adelaide', 'Albany', 'Albury', 'AliceSprings', 'BadgerysCreek',  'Ballarat', 
    'Bendigo', 'Brisbane', 'Cairns', 'Canberra', 'Cobar',  'CoffsHarbour', 'Dartmoor', 'Darwin', 'GoldCoast', 
    'Hobart',  'Katherine', 'Launceston', 'Melbourne', 'MelbourneAirport',  'Mildura', 'Moree', 'MountGambier', 
    'MountGinini', 'Newcastle',  'Nhil', 'NorahHead', 'NorfolkIsland', 'Nuriootpa', 'PearceRAAF',  'Penrith', 
    'Perth', 'PerthAirport', 'Portland', 'Richmond',  'Sale', 'SalmonGums', 'Sydney', 'SydneyAirport', 'Townsville',
      'Tuggeranong', 'Uluru', 'WaggaWagga', 'Walpole', 'Watsonia',  'Williamtown', 'Witchcliffe', 'Wollongong', 'Woomera']
  ;
  
  const [days, setDays] = useState('');
  const [locations, setLocations] = useState('');
  const [predictedTemperature, setPredictedTemperature] = useState(null);
  const [predictedRainFall, setPredictedRainFall] = useState(null);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);

  const handleSubmitTemperature = async (e) => {
    e.preventDefault();
    setError('');
    setPredictedTemperature(null);
    setLoading(null);
    setLoading(true);

    try{
      //Try getting values
      const response = await axios.get(``)
      setPredictedTemperature(response.data.predicted_temperature)

      //Preparing the data for the chart
    } catch(err){
      setError('Error Predicting. Please Try again')
    }
    finally{
      setLoading(false);
    }
  }

  const handleSubmitRainFall = async (e) => {
    e.preventDefault();
    setError('');
    setPredictedRainFall(null);
    setLoading(null);
    setLoading(true);

    try{
      //Try getting values
      const response = await axios.get(``)
      setPredictedRainFall(response.data.predicted_temperature)

      //Preparing the data for the chart
    } catch(err){
      setError('Error Predicting. Please Try again')
    }
    finally{
      setLoading(false);
    }
  }
  
  return (
    <Box sx={{display:'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'hsl(205, 50%, 37%)'}}>
      <AppBar>
        <Toolbar sx={{'bgcolor':'white'}}>
          <IconButton edge="start" aria-label="menu" onClick={toggleDrawer(true)} sx={{'color':'black'}}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h1" sx={{ml: 4 ,color:'black' ,flexGrow : 1, fontSize: 18}}>
            Weather Prediction App
          </Typography>
          <IconButton edge="end" aria-label="home" sx={{'color':'black'}}>
            <HomeIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
      <Routes>
        <Route path="/" element={
          <Container component="main" sx={{ mt:10, mb:5, flex:1}}>
            <Paper elevation={2} sx={{p:3, mb:3}}>
              <form onSubmit={handleSubmitTemperature}>
                <Grid container spacing={2} direction="column">
                  <Grid item xs={12} sm={6}>
                    <Typography fullWidth varaint="h4" component="h1" sx={{ pb:3, fontWeight:"200"}}>
                      Temperature Predictor
                    </Typography>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type = "date"
                        variant = "outlined"
                        value = {setDays}
                        onChange = {(e) => setPredictedTemperature(e.target.value)}
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
                </Grid>
              </form>
            </Paper>
          </Container>}/>
        <Route path="/Weather" element={<Weather/>}/>
        <Route path="/Influenza" element={<Influenza/>}/>
      </Routes>
    </Box>
  );
}

export default App;
