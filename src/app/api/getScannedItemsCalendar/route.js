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

    // Find the user's scanned items
    const userData = await collection.findOne({ username });

    if (userData) {
      // Return the scanned items if found
      return new Response(JSON.stringify({ scannedItems: userData.scannedItems }), {
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