'use client';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Cookies from 'universal-cookie'; // Import universal-cookie
import CustomAppBar from '../components/ResponsiveAppBarCalendar'; // Import the AppBar component

const CalendarPage = () => {
  const [date, setDate] = useState(new Date()); // Selected date
  const [username, setUsername] = useState(''); // Track username as state
  const [dailyIntake, setDailyIntake] = useState({}); // Store daily intake data
  const [scannedItems, setScannedItems] = useState([]); // Store all scanned items
  const [appBarHeight, setAppBarHeight] = useState(100); // Default height to avoid layout shift
  const appBarRef = useRef(null); // Ref to measure AppBar height
  const cookies = new Cookies(); // Initialize the cookies object

  // Measure the height of the AppBar after it renders
  useLayoutEffect(() => {
    if (appBarRef.current) {
      setAppBarHeight(appBarRef.current.offsetHeight);
    }
  }, []);

  // Fetch scanned items when username changes
  useEffect(() => {
    const fetchScannedItems = async () => {
      const username = cookies.get('username'); // Get the username from cookies

      if (!username) {
        // If no username is found, reset the state
        setDailyIntake({});
        setScannedItems([]);
        return;
      }

      try {
        const response = await fetch(`/api/getScannedItemsCalendar?username=${username}`);
        if (response.ok) {
          const data = await response.json();
          const { scannedItems } = data;

          console.log('Fetched scanned items:', scannedItems);

          // Group items by date and calculate daily intake
          const intakeData = scannedItems.reduce((acc, item) => {
            const itemDate = new Date(item.date).toISOString().split('T')[0]; // Ensure consistent date format
            if (!acc[itemDate]) {
              acc[itemDate] = { calories: 0, protein: 0, carbs: 0, fats: 0, sugar: 0, items: [] };
            }
            acc[itemDate].calories += item.calories;
            acc[itemDate].protein += item.protein;
            acc[itemDate].carbs += item.carbs;
            acc[itemDate].fats += item.fats;
            acc[itemDate].sugar += item.sugar;
            acc[itemDate].items.push(item); // Store the individual food item
            return acc;
          }, {});

          console.log('Processed daily intake:', intakeData);
          setDailyIntake(intakeData);
          setScannedItems(scannedItems); // Store all scanned items
        } else {
          console.error('Failed to fetch scanned items from the database.');
        }
      } catch (error) {
        console.error('Error fetching scanned items:', error);
      }
    };

    fetchScannedItems();
  }, [cookies.get('username')]); // Fetch data only when username changes

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Get intake data for the selected date
  const getIntakeForDate = (date) => {
    const formattedDate = formatDate(date);
    return dailyIntake[formattedDate] || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      sugar: 0,
      items: [], // Include an empty array for items
    };
  };

  // Render intake details for the selected date
  const renderIntakeDetails = () => {
    const intake = getIntakeForDate(date);
    return (
      <div style={{ marginLeft: '20px', padding: '20px', borderLeft: '1px solid #ddd' }}>
        <h3>Intake for {date.toDateString()}</h3>
        <p><strong>Calories:</strong> {intake.calories} kcal</p>
        <p><strong>Protein:</strong> {intake.protein} g</p>
        <p><strong>Carbs:</strong> {intake.carbs} g</p>
        <p><strong>Fats:</strong> {intake.fats} g</p>
        <p><strong>Sugar:</strong> {intake.sugar} g</p>

        {/* Display the list of food items */}
        <h4>Food Items Consumed:</h4>
        <ul>
          {intake.items.map((item, index) => (
            <li key={index}>
              <strong>{item.name}</strong>: {item.calories} kcal, {item.protein}g protein, {item.carbs}g carbs, {item.fats}g fats, {item.sugar}g sugar
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      {/* Add the CustomAppBar at the top */}
      <div ref={appBarRef}>
        <CustomAppBar />
      </div>

      {/* Main content */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        marginTop: `${appBarHeight + 100}px`, // Use dynamic marginTop based on AppBar height
        padding: '20px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {/* Calendar */}
        <div style={{ flex: 2, maxWidth: '800px' }}>
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={({ date, view }) => {
              if (view === 'month') {
                const intake = getIntakeForDate(date);
                return (
                  <div style={{ fontSize: '12px', textAlign: 'center' }}>
                    <p>{intake.calories} kcal</p>
                    <p>{intake.protein} g</p>
                    <p>{intake.carbs} g</p>
                    <p>{intake.fats} g</p>
                    <p>{intake.sugar} g</p>
                  </div>
                );
              }
            }}
            style={{ 
              width: '100%', 
              height: 'auto', 
              fontSize: '16px' // Increase font size for better readability
            }}
          />
        </div>

        {/* Intake details for the selected date */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          {renderIntakeDetails()}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;