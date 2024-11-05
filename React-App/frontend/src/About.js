import React from 'react';
import {
  Box, Container, Grid, Paper, Typography, Avatar, Divider,
} from '@mui/material';
import mem1 from './mem1.jpg';
import mem2 from './mem2.jpg';
import mem3 from './mem3.jpg';

function About() {
  return (
    <Container component="main"maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Team and Project Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              About Our Project
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              Our team is working on a comprehensive weather and influenza prediction app that uses historical data and advanced machine learning models to provide forecasts for different locations. The goal of our project is to provide easy-to-understand, accurate predictions that users can use to make informed decisions about their health and activities.
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Our Team
            </Typography>
            <Typography variant="body1">
              We are a small team of dedicated software engineers and data scientists passionate about making information accessible to everyone. Our mission is to use technology to simplify complex data and help people make informed decisions.
            </Typography>
          </Paper>
        </Grid>

        {/* Team Members Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Meet Our Team
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              {/* Placeholder for Team Member 1 */}
              <Grid item xs={12} sm={4}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar
                    alt="Member 1"
                    src={mem1}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                  <Typography variant="h6">Yilong Ma</Typography>
                  <Typography variant="body2">Role: Founder of Tesala</Typography>
                </Box>
              </Grid>

              {/* Placeholder for Team Member 2 */}
              <Grid item xs={12} sm={4}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar
                    alt="Member 2"
                    src={mem2}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                  <Typography variant="h6">Xong Xina</Typography>
                  <Typography variant="body2">Role: Data Scientist</Typography>
                </Box>
              </Grid>

              {/* Placeholder for Team Member 3 */}
              <Grid item xs={12} sm={4}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar
                    alt="Member 3"
                    src={mem3}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                  <Typography variant="h6">Dogpool</Typography>
                  <Typography variant="body2">Role: Project Manager</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default About;
