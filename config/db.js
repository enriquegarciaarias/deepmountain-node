require('dotenv').config();
const { MongoClient } = require('mongodb');

const mongoURL = process.env.MONGO_URL;

let db;

async function connectToDB() {
  try {
    const client = await MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db('CorpusData');
    console.log('Successfully connected to the database CorpusData');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDB first.');
  }
  return db;
}

module.exports = { connectToDB, getDB };
