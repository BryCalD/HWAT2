'use client'
import React, { useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import CustomAppBar from '../../components/ResponsiveAppBarScanner';
import { fetchFoodInfo } from '../../api/barcode/barcode';

const BarcodePage = () => {
  const [data, setData] = useState('No result');
  const [currentItem, setCurrentItem] = useState(null); // Temporarily store the scanned item
  const [scannedItems, setScannedItems] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [error, setError] = useState(null);
  const dailyCalorieLimit = 2000;

  const handleBarcodeScan = async (barcode) => {
    try {
      const product = await fetchFoodInfo(barcode);
      const calories = product.nutriments['energy-kcal'] || 0;

      // Temporarily store the scanned item
      setCurrentItem({
        barcode,
        name: product.product_name,
        calories,
      });

      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const addToScannedItems = () => {
    if (currentItem) {
      // Add the current item to the scanned items list
      setScannedItems((prevItems) => [...prevItems, currentItem]);
      setTotalCalories((prevTotal) => prevTotal + currentItem.calories);
      setCurrentItem(null); // Clear the current item after adding
    }
  };

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .decodeFromVideoDevice(null, 'video', (result, err) => {
        if (result) {
          const barcode = result.getText();
          setData(barcode);
        } else if (err) {
          //setError('Error scanning barcode');
        }
      })
      .catch(err => setError(err.message));

    return () => codeReader.reset();
  }, []);

  useEffect(() => {
    if (data !== 'No result') {
      handleBarcodeScan(data);
      setData('No result');
    }
  }, [data]);

  return (
    <div>
      <CustomAppBar />
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>Barcode Scanner</h1>
        <video id="video" style={{ width: '400px', height: '400px' }} />
        <p>Scanned Barcode: {data}</p>

        {currentItem && (
          <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px' }}>
            <h3>Scanned Item</h3>
            <p><strong>Name:</strong> {currentItem.name}</p>
            <p><strong>Calories:</strong> {currentItem.calories} kcal</p>
            <button
              onClick={addToScannedItems}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Add to List
            </button>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <h2>Scanned Items</h2>
          <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Calories</th>
              </tr>
            </thead>
            <tbody>
              {scannedItems.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.calories} kcal</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Total Calories: {totalCalories} kcal</h3>
          <h3>
            {totalCalories > dailyCalorieLimit
              ? "You've exceeded your daily calorie limit!"
              : `You have ${dailyCalorieLimit - totalCalories} kcal remaining.`}
          </h3>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default BarcodePage;
