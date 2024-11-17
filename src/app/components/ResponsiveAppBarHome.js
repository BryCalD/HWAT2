'use client'
import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';

const CustomAppBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  // Function to open the dropdown
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to close the dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <AppBar sx={{ backgroundColor: '#66b823' }}>
        <Toolbar>
          <Link href="/login">
            <Button color="warning" style={{ color: '#fff' }}>
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button color="warning" style={{ color: '#fff' }}>
              Register
            </Button>
          </Link>
          <Link href="/scanner/nutritioninfo">
            <Button color="warning" style={{ color: '#fff' }}>
              Info Scanner
            </Button>
          </Link>
          {/* Scanner dropdown */}
          <Button
            color="warning"
            style={{ color: '#fff' }}
            aria-controls="scanner-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            Intake Calculator
          </Button>
          <Menu
            id="scanner-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link href="/scanner/barcode">
                Barcode
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/scanner/ocr">
                OCR
              </Link>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default CustomAppBar;
