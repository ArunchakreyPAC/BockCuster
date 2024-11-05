import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Divider, Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Influenza from './Influenza';
import Weather from './Weather';
import About from './About';
import './App.css';
import myImage from './background.jpg';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        transition: 'transform 0.5s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
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
      <Divider />
      <List>
        <ListItem button component={Link} to="/Weather" key="Weather">
          <ListItemText primary="Weather Predictor" />
        </ListItem>
        <ListItem button component={Link} to="/Influenza" key="Influenza">
          <ListItemText primary="Influenza Predictor" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        height: '400px',
        backgroundImage: `url(${myImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'all 0.5s ease-in-out',
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          transition: 'background-color 0.5s ease-in-out',
          '&:hover': {
            backgroundColor: '#1976d2', // Change background color slightly on hover
          },
        }}
      >
        <Toolbar sx={{ bgcolor: 'white', transition: 'all 0.3s ease' }}>
          <IconButton
            edge="start"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ color: 'black', transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'rotate(20deg)' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h1"
            sx={{
              ml: 4,
              color: 'black',
              flexGrow: 1,
              fontSize: 18,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Weather Prediction App
          </Typography>
          <IconButton
            edge="end"
            aria-label="home"
            sx={{
              color: 'black',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'rotate(-20deg)',
              },
            }}
            component={Link}
            to="/"
          >
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>

      <Box className="main-content" sx={{ mt: 8 }}>
        <TransitionGroup>
          <CSSTransition key={location.key} classNames="fade" timeout={500}>
            <Routes location={location}>
              <Route
                path="/"
                element={
                  <div
                    className="home-container"
                    sx={{
                      transition: 'all 0.5s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.03)',
                      },
                    }}
                  >
                    <Typography
                      variant="h3"
                      className="header-text"
                      gutterBottom
                      sx={{
                        transition: 'color 0.5s ease',
                        '&:hover': {
                          color: '#004e23',
                        },
                      }}
                    >
                      Welcome to the Weather Prediction App
                    </Typography>
                    <Typography
                      variant="body1"
                      className="body-text"
                      gutterBottom
                      sx={{
                        transition: 'color 0.5s ease',
                        '&:hover': {
                          color: '#008b07',
                        },
                      }}
                    >
                      Use this app to predict weather conditions and influenza cases based on historical data.
                      Click the buttons below to get started.
                    </Typography>
                    <Button
                      variant="contained"
                      className="action-button"
                      component={Link}
                      to="/Weather"
                      sx={{
                        marginTop: 4,
                        transition: 'background-color 0.3s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#005f56',
                        },
                      }}
                    >
                      Predict Weather
                    </Button>
                    <Button
                      variant="contained"
                      className="action-button"
                      component={Link}
                      to="/Influenza"
                      sx={{
                        marginTop: 4,
                        transition: 'background-color 0.3s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#005f56',
                        },
                      }}
                    >
                      Predict Influenza
                    </Button>
                  </div>
                }
              />
              <Route path="/Weather" element={<Weather />} />
              <Route path="/Influenza" element={<Influenza />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </CSSTransition>
        </TransitionGroup>
      </Box>
    </Box>
  );
}

export default App;
