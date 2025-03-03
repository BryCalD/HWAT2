export async function GET(req, res) {
  // Make a note we are on the api. This goes to the console.
  console.log("in the register API route");

  // Get the values that were sent across to us.
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const nick = searchParams.get('nick');
  const pass = searchParams.get('pass');

  // Connect to MongoDB
  const { MongoClient } = require('mongodb');
  const url = 'mongodb+srv://mongo:mpass@cluster0.scnjt.mongodb.net/';
  const client = new MongoClient(url);
  const dbName = 'app'; // database name

  try {
    await client.connect();
    console.log('Connected successfully to server');
    
    const db = client.db(dbName);
    const collection = db.collection('login'); // collection name
    
    // Insert the new user data into the database
    await collection.insertOne({
      "username": email,
      "pass": pass,
      "nick": nick
    });

    console.log('User registered successfully');

    // Send a success response back
    return Response.json({ "data": "User registered successfully" });
  } catch (error) {
    console.error('Error registering user:', error);
    // Send an error response back
    return Response.json({ "data": "Error registering user" });
  }
}
