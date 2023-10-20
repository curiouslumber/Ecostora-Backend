// Import necessary modules
const express = require('express');
const { Pool } = require('pg');
const { exec } = require('child_process');
const { MongoClient } = require('mongodb');
const admin = require('firebase-admin');
const serviceAccount = require('./ecostora-f1965-firebase-adminsdk-qei7z-e5d213eec4.json');
const command = 'docker-compose up -d';

// Run the command
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error}`);
    return;
  }

  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
  
});

// Initialize Firebase Admin  
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ecostora-f1965-default-rtdb.firebaseio.com/', // Replace with your Firebase database URL
});

// Log when Firebase is connected successfully
console.log('Connected to Firebase');


// Connect to PostgreSQL 
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'products', // Your PostgreSQL database name
  password: 'mysecretpassword',
  port: 5432,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});


// Intialize MongoDB Atlas
const mongoClient = new MongoClient('mongodb+srv://noelpinto47:zULoP3Gc47DTdJyp@cluster0.6ixkodk.mongodb.net/');
mongoClient.connect()
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));


// Initialize Express App
const app = express();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


  // Example route to handle the API request
  app.get('/get-data', async (req, res) => {
    try {
    const result = await pool.query('SELECT * FROM orders'); // Replace with your table name
    res.json(result.rows); // Send the query result as JSON
    } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' }); // Handle errors
    }
});

// Graceful shutdown on process termination
process.on('SIGINT', () => {
  mongoClient.close();
  pool.end((err) => {
    if (err) {
      console.error('Error closing the pool:', err);
    } else {
      console.log('Pool has been closed');
    }
  });
  process.exit();
});