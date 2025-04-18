'use client'
import React, { useState } from 'react';
import { Box, Container, Typography, Button, useTheme, Stack, Modal, IconButton } from '@mui/material';
import CustomAppBar from '../components/ResponsiveAppBarHome';
import Link from 'next/link';

const HomePage = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fafafa'
    }}>
      <CustomAppBar />
      
      <Container maxWidth="md" sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        py: 8,
        px: { xs: 2, sm: 4 }
      }}>
        <Stack spacing={3} alignItems="center" sx={{ width: '100%', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{
              fontWeight: 400,
              color: theme.palette.text.primary,
              letterSpacing: '0.5px',
              '& span': {
                fontWeight: 600,
                color: theme.palette.primary.main
              }
            }}
          >
            <span>NutriLens</span>: Nutrition Simplified
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            component="p" 
            sx={{
              maxWidth: '600px',
              color: theme.palette.text.secondary,
              lineHeight: 1.7
            }}
          >
            Track your meals, understand your nutrients, and achieve your health goals.
          </Typography>
          
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Link href="/scanner/barcode">
            <Button 
              variant="contained" 
              size="large"
              sx={{
                px: 4,
                borderRadius: '24px',
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none'
              }}
            >
              Start Tracking
            </Button>
          </Link>

            <Button 
              variant="text" 
              size="large"
              onClick={handleOpen}
              sx={{
                px: 4,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              How it works →
            </Button>
          </Stack>
        </Stack>
        
        {/* How It Works Modal */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="how-it-works-modal"
          aria-describedby="how-it-works-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '80%', md: '600px' },
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
            outline: 'none'
          }}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            }}
          >
            <Typography variant="body1">X</Typography>
          </IconButton>
            
            <Typography id="how-it-works-modal" variant="h5" component="h2" sx={{ mb: 2 }}>
              How NutriLens Works
            </Typography>
            
            <Box id="how-it-works-description" sx={{ mt: 2 }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    1. Go to Intake Calculator
                  </Typography>
                  <Typography variant="body1">
                    Click intake calculator, then click Barcode.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    2. Log Your Meals
                  </Typography>
                  <Typography variant="body1">
                    Simply take a photo of your meal or manually enter what you ate. 
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    3. Save!
                  </Typography>
                  <Typography variant="body1">
                  Don&apos;t forget to click save after you&apos;ve completed logging your meals!
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    4. Track Nutrients
                  </Typography>
                  <Typography variant="body1">
                  View detailed breakdowns of macronutrients in your personal calendar.
                  </Typography>
                </Box>
              </Stack>
              
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: '24px',
                  textTransform: 'none',
                  fontWeight: 500
                }}
                onClick={handleClose}
              >
                Got it, let&apos;s get started!
              </Button>
            </Box>
          </Box>
        </Modal>
        
        <Box sx={{ 
          mt: 8,
          width: '100%',
          maxWidth: '800px',
          height: { xs: '300px', md: '400px' },
          borderRadius: '12px',
          background: `
            url('https://media.self.com/photos/5b4e1ae3009e7d51568b82f2/4:3/w_1920,c_limit/plentiful-dinner-table.jpg') center/cover
          `,
          backgroundBlendMode: 'overlay',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: theme.palette.primary.main
          }
        }}>
          <Box sx={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            p: 3,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
              Meal and Nutrition tracking is important!
            </Typography>
          </Box>
        </Box>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ mt: 8, mb: 4 }}>
          {['Nutrition', 'Progress', 'Goals'].map((item) => (
            <Box key={item} sx={{ 
              px: 3,
              py: 2,
              borderBottom: `3px solid ${theme.palette.primary.light}`,
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.2s ease'
              }
            }}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>{item}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item === 'Nutrition' ? 'Detailed nutrient breakdown' : 
                 item === 'Progress' ? 'Visualize your improvements' : 'Set and achieve targets'}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
      
      <Box sx={{ 
        py: 3,
        textAlign: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} NutriLens. Empowering healthier choices.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;