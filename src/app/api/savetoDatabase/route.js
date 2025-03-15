import { MongoClient } from 'mongodb';

export async function POST(request) {
  const { date, scannedItems, username } = await request.json(); // Include username in the request body

  const url = 'mongodb+srv://mongo:mpass@cluster0.scnjt.mongodb.net/';
  const client = new MongoClient(url);
  const dbName = 'app'; // database name

  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('login'); // collection name

    // Check if an entry for the user already exists
    const existingEntry = await collection.findOne({ username });

    if (existingEntry) {
      // If an entry exists, update it with the new scanned items
      const result = await collection.updateOne(
        { username }, // Filter by username
        { $push: { scannedItems: { $each: scannedItems } } // Append new items to the existing array
    });

      return new Response(
        JSON.stringify({ message: 'Scanned items updated successfully!', result }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      // If no entry exists, create a new one
      const result = await collection.insertOne({
        username, // Associate the entry with the user
        date,
        scannedItems,
      });

      return new Response(
        JSON.stringify({ message: 'Scanned items saved successfully!', result }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (error) {
    console.error('Error saving scanned items:', error);
    return new Response(
      JSON.stringify({ message: 'Error saving scanned items to the database.' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } finally {
    await client.close();
  }
}