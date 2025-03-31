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
      // Process scanned items to ensure proper date formatting
      const processedItems = userData.scannedItems.map(entry => {
        // Convert date string to proper UTC date object
        const dateObj = new Date(entry.date);
        const utcDate = new Date(Date.UTC(
          dateObj.getUTCFullYear(),
          dateObj.getUTCMonth(),
          dateObj.getUTCDate()
        ));
        
        return {
          ...entry,
          date: utcDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
        };
      });

      return new Response(JSON.stringify({ scannedItems: processedItems }), {
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