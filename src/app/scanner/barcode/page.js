'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import CustomAppBar from '../../components/ResponsiveAppBarScanner'; // Import the CustomAppBar component

// Dynamically import the scanner to work well with Next.js (no SSR)
const BarcodeScannerComponent = dynamic(() => import('react-qr-barcode-scanner'), { ssr: false });

const BarcodePage = () => {
  const [data, setData] = useState('No result');

  return (
    <div>
      {/* Add the custom AppBar at the top */}
      <CustomAppBar />

      <div style={{ textAlign: 'center', marginTop: '100px' }}> {/* Adjust margin to accommodate AppBar height */}
        <h1>Barcode Scanner</h1>
        <div style={{ display: 'inline-block' }}>
          <BarcodeScannerComponent
            onUpdate={(err, result) => {
              if (result) setData(result.text);
              else setData('No result');
            }}
            style={{ width: '300px', height: '300px' }}  // Set the size to be smaller
          />
        </div>
        <p>{data}</p>
      </div>
    </div>
  );
};

export default BarcodePage;
