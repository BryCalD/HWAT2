'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { BrowserMultiFormatReader } from '@zxing/library';
import CustomAppBar from '../../components/ResponsiveAppBarScanner';

const BarcodePage = () => {
  const [data, setData] = useState('No result');
  const [error, setError] = useState(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .decodeFromVideoDevice(null, 'video', (result, err) => {
        if (result) {
          setData(result.getText());
        } else if (err) {
          
        }
      })
      .catch(err => setError(err.message));

    // Cleanup function to stop video stream when component unmounts
    return () => codeReader.reset();
  }, []);

  return (
    <div>
      <CustomAppBar />

      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>Barcode Scanner</h1>
        <video id="video" style={{ width: '400px', height: '400px' }} /> {/* Specify video ID */}
        <p>{data}</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default BarcodePage;
