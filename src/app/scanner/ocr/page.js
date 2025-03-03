import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import CustomAppBar from '../../components/ResponsiveAppBarScanner'; // Import the AppBar component

const HomePage = () => {
  // Style for centering the content
  const centerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', // Full height of the viewport
    textAlign: 'center', // Center text within the div
  };

  return (
    <div>
      <CustomAppBar />
      <Container style={centerStyle}>
        <Typography variant="h2" component="h1" gutterBottom>
          OCR
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          
        </Typography>
      </Container>
    </div>
  );
};

export default HomePage;
