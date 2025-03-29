'use client';
import React, { useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import Cookies from 'universal-cookie'; 
import CustomAppBar from '../../components/ResponsiveAppBarScanner';
import { fetchFoodInfo } from '../../api/barcode/barcode';

const BarcodePage = () => {
  const cookies = new Cookies(); // Initialize the cookies object
  const [data, setData] = useState('No result');
  const [username, setUsername] = useState(cookies.get('username') || ''); // Track username as state
  const [currentItem, setCurrentItem] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0);
  const [totalSugar, setTotalSugar] = useState(0);
  const [error, setError] = useState(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInput, setManualInput] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    sugar: 0,
  });

  // Recommended daily intake values
  const dailyCalorieLimit = 2000;
  const dailyProteinRecommendation = 50;
  const dailyCarbsRecommendation = 300;
  const dailyFatsRecommendation = 70;
  const dailySugarRecommendation = 25;

  useEffect(() => {
    const fetchScannedItems = async () => {
      if (!username) {
        setScannedItems([]);
        setTotalCalories(0);
        setTotalProtein(0);
        setTotalCarbs(0);
        setTotalFats(0);
        setTotalSugar(0);
        return;
      }
  
      try {
        const response = await fetch(`/api/getScannedItemsBarcode?username=${username}`);
        if (response.ok) {
          const data = await response.json();
          const { scannedItems } = data;
  
          // Update the state with the scanned items
          setScannedItems(scannedItems);
  
          // Calculate totals - now working with direct items array
          const totals = scannedItems.reduce(
            (acc, item) => {
              acc.calories += Number(item.calories) || 0;
              acc.protein += Number(item.protein) || 0;
              acc.carbs += Number(item.carbs) || 0;
              acc.fats += Number(item.fats) || 0;
              acc.sugar += Number(item.sugar) || 0;
              return acc;
            },
            { calories: 0, protein: 0, carbs: 0, fats: 0, sugar: 0 }
          );
  
          setTotalCalories(totals.calories);
          setTotalProtein(totals.protein);
          setTotalCarbs(totals.carbs);
          setTotalFats(totals.fats);
          setTotalSugar(totals.sugar);
        } else {
          console.error('Failed to fetch scanned items from the database.');
        }
      } catch (error) {
        console.error('Error fetching scanned items:', error);
      }
    };
  
    fetchScannedItems();
  }, [username]); // Fetch data only when username changes

  const handleBarcodeScan = async (barcode) => {
    try {
      const product = await fetchFoodInfo(barcode);
      const calories = product.nutriments['energy-kcal'] || 0;
      const protein = product.nutriments['proteins'] || 0;
      const carbs = product.nutriments['carbohydrates'] || 0;
      const fats = product.nutriments['fat'] || 0;
      const sugar = product.nutriments['sugars'] || 0; // Fetch sugar value

      // Temporarily store the scanned item
      setCurrentItem({
        barcode,
        name: product.product_name,
        calories,
        protein,
        carbs,
        fats,
        sugar, // Add sugar to the current item
        date: new Date().toISOString().split('T')[0], // Add the current date
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
      setTotalProtein((prevTotal) => prevTotal + currentItem.protein);
      setTotalCarbs((prevTotal) => prevTotal + currentItem.carbs);
      setTotalFats((prevTotal) => prevTotal + currentItem.fats);
      setTotalSugar((prevTotal) => prevTotal + currentItem.sugar);

      // Clear the current item after adding
      setCurrentItem(null);
    }
  };

  const removeScannedItem = (index) => {
    const updatedItems = scannedItems.filter((_, i) => i !== index);
    setScannedItems(updatedItems);

    // Recalculate totals
    const totals = updatedItems.reduce(
      (acc, item) => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fats += item.fats;
        acc.sugar += item.sugar;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0, sugar: 0 }
    );

    setTotalCalories(totals.calories);
    setTotalProtein(totals.protein);
    setTotalCarbs(totals.carbs);
    setTotalFats(totals.fats);
    setTotalSugar(totals.sugar);
  };

  const handleManualInputSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      barcode: 'manual',
      name: manualInput.name,
      calories: parseFloat(manualInput.calories),
      protein: parseFloat(manualInput.protein),
      carbs: parseFloat(manualInput.carbs),
      fats: parseFloat(manualInput.fats),
      sugar: parseFloat(manualInput.sugar),
      date: new Date().toISOString().split('T')[0], // Add the current date
    };

    // Add the manually entered item to the scanned items list
    setScannedItems((prevItems) => [...prevItems, newItem]);
    setTotalCalories((prevTotal) => prevTotal + newItem.calories);
    setTotalProtein((prevTotal) => prevTotal + newItem.protein);
    setTotalCarbs((prevTotal) => prevTotal + newItem.carbs);
    setTotalFats((prevTotal) => prevTotal + newItem.fats);
    setTotalSugar((prevTotal) => prevTotal + newItem.sugar);

    // Reset the manual input form
    setManualInput({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      sugar: 0,
    });

    // Hide the manual input form
    setShowManualInput(false);
  };

  const saveToDatabase = async () => {
    const cookies = new Cookies();
    const username = cookies.get('username');
    const today = new Date().toISOString().split('T')[0];
    const dataToSave = {
      username,
      date: today,
      scannedItems: scannedItems, // This should be an array of items
    };
  
    try {
      const response = await fetch('/api/savetoDatabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });
  
      if (response.ok) {
        alert('Scanned items saved successfully!');
      } else {
        alert('Failed to save scanned items to the database.');
      }
    } catch (error) {
      console.error('Error saving scanned items:', error);
      alert('Error saving scanned items to the database.');
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
      .catch((err) => setError(err.message));

    return () => codeReader.reset();
  }, []);

  useEffect(() => {
    if (data !== 'No result') {
      handleBarcodeScan(data);
      setData('No result');
    }
  }, [data]);

  // Helper function to calculate progress percentage
  const getProgressPercentage = (total, recommendation) => {
    return Math.min((total / recommendation) * 100, 100); // Cap at 100%
  };

  // Helper function to get color based on progress
  const getProgressColor = (percentage) => {
    if (percentage <= 50) return 'green';
    if (percentage <= 75) return 'yellow';
    return 'red';
  };

  // Half-circle progress meter component
  const HalfCircleProgress = ({ percentage, color, total, recommendation }) => {
    const radius = 50;
    const circumference = Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div style={{ textAlign: 'center' }}>
        <svg width="120" height="60" viewBox="0 0 120 60" style={{ margin: '10px' }}>
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(180 60 60)" // Rotate to start from the left
          />
          {/* Percentage text */}
          <text
            x="60"
            y="50"
            textAnchor="middle"
            fill="black"
            fontSize="14"
            fontWeight="bold"
          >
            {Math.round(percentage)}%
          </text>
        </svg>
        <p>
          <strong>Total Consumed:</strong> {total} / {recommendation}
        </p>
      </div>
    );
  };

  return (
    <div>
      <CustomAppBar />
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>Barcode Scanner</h1>
        <video id="video" style={{ width: '400px', height: '400px' }} />
        <p>Scanned Barcode: {data}</p>

        {/* Manual Input Button */}
        <button
          onClick={() => setShowManualInput(!showManualInput)}
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
          {showManualInput ? 'Hide Manual Input' : 'Add Product Manually'}
        </button>

        {/* Save Button */}
        <button
          onClick={saveToDatabase}
          style={{
            marginTop: '10px',
            marginLeft: '10px',
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Save
        </button>

        {/* Manual Input Form */}
        {showManualInput && (
          <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px', maxWidth: '400px', margin: '20px auto' }}>
            <h3>Add Product Manually</h3>
            <form onSubmit={handleManualInputSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label>Name:</label>
                <input
                  type="text"
                  value={manualInput.name}
                  onChange={(e) => setManualInput({ ...manualInput, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Calories (kcal):</label>
                <input
                  type="number"
                  value={manualInput.calories}
                  onChange={(e) => setManualInput({ ...manualInput, calories: e.target.value })}
                  required
                  style={{ width: '100%', padding: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Protein (g):</label>
                <input
                  type="number"
                  value={manualInput.protein}
                  onChange={(e) => setManualInput({ ...manualInput, protein: e.target.value })}
                  required
                  style={{ width: '100%', padding: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Carbs (g):</label>
                <input
                  type="number"
                  value={manualInput.carbs}
                  onChange={(e) => setManualInput({ ...manualInput, carbs: e.target.value })}
                  required
                  style={{ width: '100%', padding: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Fats (g):</label>
                <input
                  type="number"
                  value={manualInput.fats}
                  onChange={(e) => setManualInput({ ...manualInput, fats: e.target.value })}
                  required
                  style={{ width: '100%', padding: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Sugar (g):</label>
                <input
                  type="number"
                  value={manualInput.sugar}
                  onChange={(e) => setManualInput({ ...manualInput, sugar: e.target.value })}
                  required
                  style={{ width: '100%', padding: '5px' }}
                />
              </div>
              <button
                type="submit"
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
                Add Product
              </button>
            </form>
          </div>
        )}

        {currentItem && (
          <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px' }}>
            <h3>Scanned Item</h3>
            <p><strong>Name:</strong> {currentItem.name}</p>
            <p><strong>Calories:</strong> {currentItem.calories} kcal</p>
            <p><strong>Protein:</strong> {currentItem.protein} g</p>
            <p><strong>Carbs:</strong> {currentItem.carbs} g</p>
            <p><strong>Fats:</strong> {currentItem.fats} g</p>
            <p><strong>Sugar:</strong> {currentItem.sugar} g</p>
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
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Protein (g)</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Carbs (g)</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fats (g)</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sugar (g)</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {scannedItems.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.calories} kcal</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.protein} g</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.carbs} g</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.fats} g</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.sugar} g</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button
                      onClick={() => removeScannedItem(index)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#ff4d4d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <div>
              <h3>Calories</h3>
              <HalfCircleProgress
                percentage={getProgressPercentage(totalCalories, dailyCalorieLimit)}
                color={getProgressColor(getProgressPercentage(totalCalories, dailyCalorieLimit))}
                total={totalCalories}
                recommendation={dailyCalorieLimit}
              />
            </div>
            <div>
              <h3>Protein</h3>
              <HalfCircleProgress
                percentage={getProgressPercentage(totalProtein, dailyProteinRecommendation)}
                color={getProgressColor(getProgressPercentage(totalProtein, dailyProteinRecommendation))}
                total={totalProtein}
                recommendation={dailyProteinRecommendation}
              />
            </div>
            <div>
              <h3>Carbs</h3>
              <HalfCircleProgress
                percentage={getProgressPercentage(totalCarbs, dailyCarbsRecommendation)}
                color={getProgressColor(getProgressPercentage(totalCarbs, dailyCarbsRecommendation))}
                total={totalCarbs}
                recommendation={dailyCarbsRecommendation}
              />
            </div>
            <div>
              <h3>Fats</h3>
              <HalfCircleProgress
                percentage={getProgressPercentage(totalFats, dailyFatsRecommendation)}
                color={getProgressColor(getProgressPercentage(totalFats, dailyFatsRecommendation))}
                total={totalFats}
                recommendation={dailyFatsRecommendation}
              />
            </div>
            <div>
              <h3>Sugar</h3>
              <HalfCircleProgress
                percentage={getProgressPercentage(totalSugar, dailySugarRecommendation)}
                color={getProgressColor(getProgressPercentage(totalSugar, dailySugarRecommendation))}
                total={totalSugar}
                recommendation={dailySugarRecommendation}
              />
            </div>
          </div>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default BarcodePage;