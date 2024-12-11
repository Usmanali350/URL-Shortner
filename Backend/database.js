const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017/MyDataBase'; // Ensure this matches your setup
const client = new MongoClient(uri);

let db;

const connectToDatabase = async () => {
  if (!db) {
    try {
      await client.connect();
      db = client.db(); // Use default database
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      throw err;
    }
  }
  return db;
};

module.exports = { connectToDatabase };
