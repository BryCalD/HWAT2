'use client';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Cookies from 'universal-cookie';
import CustomAppBar from '../components/ResponsiveAppBarCalendar';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [username, setUsername] = useState('');
  const [dailyIntake, setDailyIntake] = useState({});
  const [scannedItems, setScannedItems] = useState([]);
  const [appBarHeight, setAppBarHeight] = useState(100);
  const appBarRef = useRef(null);
  const cookies = new Cookies();

  useLayoutEffect(() => {
    if (appBarRef.current) {
      setAppBarHeight(appBarRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const fetchScannedItems = async () => {
      const username = cookies.get('username');

      if (!username) {
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

          // Process the nested structure
          const intakeData = {};
          
          scannedItems.forEach(entry => {
            const entryDate = new Date(entry.date).toISOString().split('T')[0];
            
            if (!intakeData[entryDate]) {
              intakeData[entryDate] = { 
                calories: 0, 
                protein: 0, 
                carbs: 0, 
                fats: 0, 
                sugar: 0, 
                items: [] 
              };
            }

            // Sum up all items for this date
            entry.items.forEach(item => {
              intakeData[entryDate].calories += item.calories;
              intakeData[entryDate].protein += item.protein;
              intakeData[entryDate].carbs += item.carbs;
              intakeData[entryDate].fats += item.fats;
              intakeData[entryDate].sugar += item.sugar;
              intakeData[entryDate].items.push(item);
            });
          });

          console.log('Processed daily intake:', intakeData);
          setDailyIntake(intakeData);
          setScannedItems(scannedItems);
        } else {
          console.error('Failed to fetch scanned items from the database.');
        }
      } catch (error) {
        console.error('Error fetching scanned items:', error);
      }
    };

    fetchScannedItems();
  }, [cookies.get('username')]);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getIntakeForDate = (date) => {
    const formattedDate = formatDate(date);
    return dailyIntake[formattedDate] || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      sugar: 0,
      items: [],
    };
  };

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
      <div ref={appBarRef}>
        <CustomAppBar />
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        marginTop: `${appBarHeight + 100}px`,
        padding: '20px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
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
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '300px' }}>
          {renderIntakeDetails()}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;