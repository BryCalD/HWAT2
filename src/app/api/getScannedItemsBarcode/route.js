import { MongoClient } from 'mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username'); // Get the username from query parameters

  const url = 'mongodb+srv://mongo:mpass@cluster0.scnjt.mongodb.net/';
  const client = new MongoClient(url);
  const dbName = 'app'; // database name

  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('login'); // collection name

    // Find the user's data
    const userData = await collection.findOne({ username });

    if (userData) {
      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split('T')[0];

      // Filter scanned items to include only those from the current day
      const todayItems = userData.scannedItems.filter(item => {
        const itemDate = new Date(item.date).toISOString().split('T')[0]; // Ensure the date is in the same format
        return itemDate === currentDate;
      });

      // Return the filtered scanned items
      return new Response(JSON.stringify({ scannedItems: todayItems }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      // Return an empty array if no data is found
      return new Response(JSON.stringify({ scannedItems: [] }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Error fetching scanned items:', error);
    return new Response(JSON.stringify({ message: 'Error fetching scanned items from the database.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await client.close();
  }
}