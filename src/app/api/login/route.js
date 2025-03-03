import { cookies } from 'next/headers'

export async function GET(req, res) {
    // Make a note we are on
    // the api. This goes to the console.
    console.log("in the api page");
    // get the values
    // that were sent across to us.
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const pass = searchParams.get('pass');
    console.log(email);
    console.log(pass);
  
    // =================================================
    const { MongoClient } = require('mongodb');

    const url = 'mongodb+srv://mongo:mpass@cluster0.scnjt.mongodb.net/';
    const client = new MongoClient(url);
    const dbName = 'app'; // database name
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('login'); // collection name
    const findResult = await collection.find({"username": email, "pass": pass}).toArray();
    console.log('Found documents =>', findResult);
    let valid = false;
    let nick = '';

    if (findResult.length > 0) {
        valid = true;
        nick = findResult[0].nick; // Assuming nick is stored in the database
        console.log("login valid");
        // save a little cookie to say we are authenticated
        console.log("Saving username and auth status");
        cookies().set('auth', true);
        cookies().set('username', email);
        cookies().set('nick', nick);
    } else {
        valid = false;
        console.log("login invalid");
    }
    return Response.json({ "data": valid });
}
