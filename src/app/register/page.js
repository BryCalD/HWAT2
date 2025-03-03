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
import {ThemeProvider } from '@mui/material/styles';

import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';
import CustomAppBar from '../components/ResponsiveAppBarRegister'; // Import the AppBar component

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

var validator = require("email-validator");


export default function Page() {



  /*
  This function does the actual work
  calling the fetch to get things from the database.
  */ 
  async function runDBCallAsync(url) {
    const res = await fetch(url);
    const data = await res.json();

    if (data.data === "User registered successfully") {
        console.log("User registered successfully");
        window.location = "/login";
    } else {
        console.log("Error registering user:", data.data);
        // Handle error case appropriately, such as displaying an error message to the user
    }
}



    const validateForm = (event) => {
      let errorMessage = '';
      const data = new FormData(event.currentTarget);
      // get the email
      let email = data.get('email')
      // pull in the validator
      var validator = require("email-validator");

      // Validate the nickname
      let nick = data.get('nick')
      if(nick.length ==0){
      errorMessage += ' No nickname added, ';
      }
      
      // Validate the password
      let pass = data.get('pass')
      if(pass.length ==0){
      errorMessage += ' No password added, ';
      }
      
      // run the validator
      let emailCheck = validator.validate(email);
      // print the status true or false
      console.log("email status: " +emailCheck);
      // if it is false, add to the error message.
      if(emailCheck == false){
      errorMessage += 'Incorrect email';
      }
      return errorMessage;
      }
      

  /*

  When the button is clicked, this is the event that is fired.
  The first thing we need to do is prevent the default refresh of the page.
  */
	const handleSubmit = (event) => {
		
		console.log("handling submit");
    event.preventDefault();
    // call out custom validator
    let errorMessage = validateForm(event);
    // save the mesage
    setErrorHolder(errorMessage)
    // if we have an error
    if(errorMessage.length > 0){
    setOpen(true);
    } else {
    // if we do not get an error
    const data = new FormData(event.currentTarget);
    let email = data.get('email')
    let nick = data.get('nick')
    let pass = data.get('pass')
    console.log("Sent email:" + email)
    console.log("Sent nickname:" + nick)
    console.log("Sent pass:" + pass)
    console.log("calling db");

    runDBCallAsync(`api/register/?email=${email}&nick=${nick}&pass=${pass}`)

    }; // end error if
  }//end handler




  
  const theme = createTheme({
    palette: {
     
      secondary: {
        main: green[500],
      },
    },
  });
  

// first
const [open, setOpen] = React.useState(false);
const handleClickOpen = () => {
setOpen(true);
};
const handleClose = () => {
setOpen(false);
};
// second
const [errorHolder, setErrorHolder] = React.useState(false);

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
  margin: '-4em',
  
  marginTop: '1em',
  backdropFilter: 'blur(2px)',
  border: '3px solid #1976d2',
};
  
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
        {"Error"}
        </DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
        {errorHolder}
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} autoFocus>
        Close
        </Button>
        </DialogActions>
        </Dialog>
        </React.Fragment>

      <CustomAppBar />
      <div style={backgroundStyle}> {}
    <Container component="main"  maxWidth="xs" style={{ marginTop: '80px' }}>
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
          Good choice! Register here User. <hr></hr>
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{m: 1 , ml: 3}}>
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
              id="nick"
              label="Nickname"
              name="nick"
              autoComplete="nick"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="pass"
              label="Password"
              type="password"
              id="pass"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
            Register
            </Button>




          <Grid container>
            <Grid item>
              <Link href="/login" variant="body2">
                {"Have an account? Sign In"}
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