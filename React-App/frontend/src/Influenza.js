import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button, Box,
  Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, TextField,
  Switch, Snackbar, Alert, Fab, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, CircularProgress, LinearProgress, Chip, Avatar, Divider, Paper, MenuItem, FormControl,
  InputLabel
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Mail as MailIcon,
  Add as AddIcon,
  WidthFull,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { useCallback } from 'react';

function Influenza(){
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
    const [predictedInfluenza, setPredictedInfluenza] = useState(null);
    const [error, setError] = useState('');
    const [chartData, setChartData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPredictedInfluenza(null);
        setLoading(null);
        setLoading(true);

        try{
        //Try getting values
        const response = await axios.get(``)
        setPredictedInfluenza(response.data.predicted_temperature)

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
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} direction="row">
              <Grid item xs={12} sm={6}>
                <Typography fullWidth varaint="h4" component="h1" sx={{ pt:2, fontWeight:"200"}}>
                  Influenza Predictor
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type = "date"
                  variant = "outlined"
                  value = {setDays}
                  onChange = {(e) => setPredictedInfluenza(e.target.value)}
                />
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    );
}
export default Influenza;