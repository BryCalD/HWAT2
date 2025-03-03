'use client';
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import Cookies from 'universal-cookie';

const CustomAppBar = () => {
  const [nickname, setNickname] = useState('');
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [scannerMenuAnchor, setScannerMenuAnchor] = useState(null);

  useEffect(() => {
    const cookies = new Cookies();
    const savedNick = cookies.get('nick'); // Get "nick" cookie
    if (savedNick) {
      setNickname(savedNick);
    }
  }, []);

  // Open the user dropdown menu
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  // Close the user dropdown menu
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  // Logout function
  const handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove('nick'); // Remove "nick" cookie
    setNickname(''); // Reset state
    handleUserMenuClose();
  };

  // Open the scanner dropdown menu
  const handleScannerMenuOpen = (event) => {
    setScannerMenuAnchor(event.currentTarget);
  };

  // Close the scanner dropdown menu
  const handleScannerMenuClose = () => {
    setScannerMenuAnchor(null);
  };

  return (
    <div>
      <AppBar sx={{ backgroundColor: '#66b823' }}>
        <Toolbar>
          {nickname ? (
            <>
              {/* User Dropdown */}
              <Button
                color="inherit"
                style={{ color: '#fff' }}
                aria-controls="user-menu"
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
              >
                {nickname}
              </Button>
              <Menu
                id="user-menu"
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
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
            </>
          )}
          <Link href="/scanner/nutritioninfo">
            <Button color="warning" style={{ color: '#fff' }}>
              Info Scanner
            </Button>
          </Link>
          {/* Scanner Dropdown */}
          <Button
            color="warning"
            style={{ color: '#fff' }}
            aria-controls="scanner-menu"
            aria-haspopup="true"
            onClick={handleScannerMenuOpen}
          >
            Intake Calculator
          </Button>
          <Menu
            id="scanner-menu"
            anchorEl={scannerMenuAnchor}
            open={Boolean(scannerMenuAnchor)}
            onClose={handleScannerMenuClose}
          >
            <MenuItem onClick={handleScannerMenuClose}>
              <Link href="/scanner/barcode">Barcode</Link>
            </MenuItem>
            <MenuItem onClick={handleScannerMenuClose}>
              <Link href="/scanner/ocr">OCR</Link>
            </MenuItem>
          </Menu>
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
