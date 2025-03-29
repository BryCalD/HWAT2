import { MongoClient } from 'mongodb';

export async function POST(request) {
  const data = await request.json();
  const { username, date, scannedItems } = data;

  const url = 'mongodb+srv://mongo:mpass@cluster0.scnjt.mongodb.net/';
  const client = new MongoClient(url);
  const dbName = 'app';

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('login');

    // Check if an entry exists for this user and date
    const existingEntry = await collection.findOne({ 
      username,
      'scannedItems.date': date
    });

    if (existingEntry) {
      // Update existing entry
      await collection.updateOne(
        { username, 'scannedItems.date': date },
        { $set: { 'scannedItems.$.items': scannedItems } }
      );
    } else {
      // Create new entry
      await collection.updateOne(
        { username },
        { $push: { 
          scannedItems: {
            date: date,
            items: scannedItems
          } 
        }},
        { upsert: true }
      );
    }

    return new Response(JSON.stringify({ message: 'Data saved successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error saving data:', error);
    return new Response(JSON.stringify({ message: 'Error saving data to database' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await client.close();
  }
}