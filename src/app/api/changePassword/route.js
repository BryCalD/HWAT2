export async function GET(req, res) {
    // Make a note we are on
    // the api. This goes to the console.
    console.log("in the api page");
    
    // Get the values that were sent across to us.
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const newPassword = searchParams.get('newPassword'); // Retrieve newPassword from the query parameters
  
    console.log(email);
    console.log(newPassword); // Log newPassword to see if it's retrieved correctly
  
    // =================================================
    const { MongoClient } = require('mongodb');
  
    const url = 'mongodb+srv://mongo:mpass@cluster0.scnjt.mongodb.net/';
    const client = new MongoClient(url);
    const dbName = 'app'; // database name
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('login'); // collection name
    const findResult = await collection.find({"username": email}).toArray();
    console.log('Found documents =>', findResult);
    let valid = false;
  
    // If user exists, update the password
    if (findResult) {
      valid = true;
        await collection.updateOne(
            { "username": email },
            { $set: { "pass": newPassword } }
        );
        console.log("Password updated successfully");
    } else {
      valid = false;
      console.log("Password updated unsuccessfully");
    }
    return Response.json({ "data": valid });
  }
  