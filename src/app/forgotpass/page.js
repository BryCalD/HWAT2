'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import CustomAppBar from '../components/ResponsiveAppBarForPass'; // Import the AppBar component

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Page() {
  const theme = createTheme({
    palette: {
      secondary: {
        main: green[500],
      },
    },
  });

  const [open, setOpen] = React.useState(false);
  const [errorHolder, setErrorHolder] = React.useState("");

  const backgroundStyle = {
    backgroundImage: `url(${'/LogRegBG.png'})`,
    backgroundSize: 'cover', 
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '50px',
  };

  const whitebg = {
    backgroundImage: ``,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
  }

  const loginStyle = {
    backgroundColor: 'rgba(200, 200, 200, 0.8)',
    borderRadius: '50px', 
    paddingTop: '1em',
    paddingleft: '1em',
    paddingBottom: '4em',
    paddingRight: '1em',
    margin: '-10em',
    marginTop: '6em',
    backdropFilter: 'blur(2px)',
    border: '3px solid #1976d2',
  };

  async function runDBCallAsync(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();

      console.log("Response from server:", data);

      if (data.data == true) {
        console.log("Password updated successfully!");
        window.location = "/login"; // Redirect to login page after successful password change
      } else {
        console.log("Changing Password Not Valid");
        window.location="/forgotpass";
      }

    } catch (error) {
      console.error("Error fetching data from server:", error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const newPassword = data.get('pass');

    runDBCallAsync(`/api/changePassword?email=${email}&newPassword=${newPassword}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {errorHolder}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      <CustomAppBar />
      <div style={backgroundStyle}>
        <Container component="main" maxWidth="xs" style={{ ...whitebg, marginTop: '80px' }}>
          <CssBaseline />
          <div style={loginStyle}> {}
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar src="\..\..\titan.png"sx={{ width: 80, height: 80 }}>
          
          </Avatar>
            <Typography component="h1" variant="h5">
              Forgot Password
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="pass"
                label="New Password"
                type="password"
                id="pass"
                autoComplete="new-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Reset Password
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
}
