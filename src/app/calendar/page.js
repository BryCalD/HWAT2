'use client';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Cookies from 'universal-cookie';
import CustomAppBar from '../components/ResponsiveAppBarCalendar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [username, setUsername] = useState('');
  const [dailyIntake, setDailyIntake] = useState({});
  const [scannedItems, setScannedItems] = useState([]);
  const [appBarHeight, setAppBarHeight] = useState(100);
  const appBarRef = useRef(null);
  const cookies = new Cookies();

  // Colors for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const MACRO_COLORS = {
    protein: '#0088FE',
    carbs: '#00C49F',
    fats: '#FFBB28',
    sugar: '#FF8042'
  };

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

            entry.items.forEach(item => {
              intakeData[entryDate].calories += Number(item.calories) || 0;
              intakeData[entryDate].protein += Number(item.protein) || 0;
              intakeData[entryDate].carbs += Number(item.carbs) || 0;
              intakeData[entryDate].fats += Number(item.fats) || 0;
              intakeData[entryDate].sugar += Number(item.sugar) || 0;
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

  // Prepare data for charts
  const prepareChartData = (intake) => {
    // Macronutrient bar chart data
    const macroData = [
      { name: 'Protein', value: intake.protein, fill: MACRO_COLORS.protein },
      { name: 'Carbs', value: intake.carbs, fill: MACRO_COLORS.carbs },
      { name: 'Fats', value: intake.fats, fill: MACRO_COLORS.fats },
      { name: 'Sugar', value: intake.sugar, fill: MACRO_COLORS.sugar },
    ];

    // Calorie breakdown pie chart data
    const calorieData = [
      { name: 'Protein', value: intake.protein * 4 }, // 4 calories per gram
      { name: 'Carbs', value: intake.carbs * 4 },     // 4 calories per gram
      { name: 'Fats', value: intake.fats * 9 },       // 9 calories per gram
    ].filter(item => item.value > 0); // Only show if there are calories

    return { macroData, calorieData };
  };

  const renderIntakeDetails = () => {
    const intake = getIntakeForDate(date);
    const { macroData, calorieData } = prepareChartData(intake);

    return (
      <div style={{ marginLeft: '20px', padding: '20px', borderLeft: '1px solid #ddd' }}>
        <h3>Intake for {date.toDateString()}</h3>
        
        {/* Nutrition Summary */}
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Total Calories:</strong> {intake.calories} kcal</p>
          <p><strong>Protein:</strong> {intake.protein} g</p>
          <p><strong>Carbs:</strong> {intake.carbs} g</p>
          <p><strong>Fats:</strong> {intake.fats} g</p>
          <p><strong>Sugar:</strong> {intake.sugar} g</p>
        </div>

        {/* Macronutrient Bar Chart */}
        <div style={{ height: '300px', marginBottom: '30px' }}>
          <h4>Macronutrients (grams)</h4>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart
              data={macroData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Grams">
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Calorie Breakdown Pie Chart */}
        <div style={{ height: '300px' }}>
          <h4>Calorie Breakdown</h4>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={calorieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {calorieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} kcal`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Food Items List */}
        <div style={{ marginTop: '30px' }}>
          <h4>Food Items Consumed:</h4>
          <ul>
            {intake.items.map((item, index) => (
              <li key={index}>
                <strong>{item.name}</strong>: {item.calories} kcal, {item.protein}g protein, {item.carbs}g carbs, {item.fats}g fats, {item.sugar}g sugar
              </li>
            ))}
          </ul>
        </div>
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