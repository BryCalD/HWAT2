import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import Link from 'next/link';

const CustomAppBar = () => {
  return (
    <div>
      <AppBar sx={{ backgroundColor: '#66b823' }}> 
        <Toolbar>
          <Link href="/homepage" passHref>
          <Button color="primary" style={{ color: '#fff' }}>
            Home
          </Button>
          </Link>
          <Link href="/calendar">
              <Button color="warning" style={{ color: '#fff' }}>
                Calendar
              </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default CustomAppBar;
