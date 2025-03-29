import { MongoClient } from 'mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  const url = 'mongodb+srv://mongo:mpass@cluster0.scnjt.mongodb.net/';
  const client = new MongoClient(url);
  const dbName = 'app';

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('login');

    const userData = await collection.findOne({ username });

    if (userData) {
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Find the entry for today's date
      const todayEntry = userData.scannedItems.find(entry => 
        new Date(entry.date).toISOString().split('T')[0] === currentDate
      );

      // If found, return the items array, otherwise return empty array
      const todayItems = todayEntry ? todayEntry.items : [];

      return new Response(JSON.stringify({ scannedItems: todayItems }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
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