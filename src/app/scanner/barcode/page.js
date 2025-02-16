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
  const [totalProtein, setTotalProtein] = useState(0); // Total protein
  const [totalCarbs, setTotalCarbs] = useState(0); // Total carbs
  const [totalFats, setTotalFats] = useState(0); // Total fats
  const [totalSugar, setTotalSugar] = useState(0); // Total sugar
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [popupMessage, setPopupMessage] = useState(''); // Popup message content
  const [showManualInput, setShowManualInput] = useState(false); // State to toggle manual input form
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
  const dailyProteinRecommendation = 50; // Recommended protein intake in grams
  const dailyCarbsRecommendation = 300; // Recommended carbs intake in grams
  const dailyFatsRecommendation = 70; // Recommended fats intake in grams
  const dailySugarRecommendation = 25; // Recommended sugar intake in grams (WHO guideline)

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
      setTotalSugar((prevTotal) => prevTotal + currentItem.sugar); // Update total sugar
      setCurrentItem(null); // Clear the current item after adding

      // Check if any limit is exceeded
      checkDailyLimits();
    }
  };

  // Function to check if daily limits are exceeded
  const checkDailyLimits = () => {
    const messages = [];

    if (totalCalories > dailyCalorieLimit) {
      messages.push('calories');
    }
    if (totalProtein > dailyProteinRecommendation) {
      messages.push('protein');
    }
    if (totalCarbs > dailyCarbsRecommendation) {
      messages.push('carbs');
    }
    if (totalFats > dailyFatsRecommendation) {
      messages.push('fats');
    }
    if (totalSugar > dailySugarRecommendation) {
      messages.push('sugar');
    }

    if (messages.length > 0) {
      setPopupMessage(`You've exceeded your daily intake limit for: ${messages.join(', ')}.`);
      setShowPopup(true);
    }
  };

  // Function to handle manual input form submission
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

    // Check if any limit is exceeded
    checkDailyLimits();
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

      {/* Popup Modal */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
          }}>
            <h3>Daily Intake Limit Exceeded</h3>
            <p>{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
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
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodePage;