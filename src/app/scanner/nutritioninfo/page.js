'use client'
import React, { useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import CustomAppBar from '../../components/ResponsiveAppBarScanner';
import { fetchFoodInfo } from '../../api/barcode/barcode'; // Import the API function

const BarcodePage = () => {
  const [data, setData] = useState('No result');
  const [foodInfo, setFoodInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleBarcodeScan = async (barcode) => {
    try {
      const product = await fetchFoodInfo(barcode);
      setFoodInfo(product); // Set the product data on successful fetch
      setError(null);       // Clear any previous errors
    } catch (err) {
      setFoodInfo(null);    // Clear food info if fetch fails
      
    }
  };

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .decodeFromVideoDevice(null, 'video', (result, err) => {
        if (result) {
          const barcode = result.getText();
          setData(barcode);
          handleBarcodeScan(barcode); // Call the handler to fetch food info
        } else if (err) {
          
        }
      })
      .catch(err => setError(err.message));

    return () => codeReader.reset();
  }, []);

  return (
    <div>
      <CustomAppBar />
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>Barcode Scanner</h1>
        <video id="video" style={{ width: '400px', height: '400px' }} />
        <p>Scanned Barcode: {data}</p>
        {foodInfo && (
          <div>
            <h2>Food Information</h2>
            <p><strong>Name:</strong> {foodInfo.product_name}</p>
            <p><strong>Brand:</strong> {foodInfo.brands}</p>
            <p><strong>Category:</strong> {foodInfo.categories}</p>

            <h3>Nutritional Facts (per 100g)</h3>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nutrient</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>Calories</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{foodInfo.nutriments['energy-kcal']} kcal</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>Protein</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{foodInfo.nutriments.proteins} g</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>Fat</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{foodInfo.nutriments.fat} g</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>Carbohydrates</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{foodInfo.nutriments.carbohydrates} g</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>Sugars</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{foodInfo.nutriments.sugars} g</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>Fiber</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{foodInfo.nutriments.fiber} g</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>Salt</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{foodInfo.nutriments.salt} g</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default BarcodePage;
