require('dotenv').config();
const { MongoClient } = require('mongodb');

const mongoURL = process.env.MONGO_URL;

let corpusDb;
let deepDb;

async function connectToCorpus() {
  try {
    const client = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
    corpusDb = client.db('CorpusData');
    console.log('Successfully connected to the CorpusData database');
  } catch (error) {
    console.error('Failed to connect to the CorpusData database:', error);
    throw error;
  }
}

function getCorpus() {
  if (!corpusDb) {
    throw new Error('CorpusData database not initialized. Call connectToCorpus first.');
  }
  return corpusDb;
}

async function connectToDeep() {
  try {
    const client = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
    deepDb = client.db('DeepMountain');
    console.log('Successfully connected to the DeepMountain database');
  } catch (error) {
    console.error('Failed to connect to the DeepMountain database:', error);
    throw error;
  }
}

function getDeep() {
  if (!deepDb) {
    throw new Error('DeepMountain database not initialized. Call connectToDeep first.');
  }
  return deepDb;
}

module.exports = { connectToCorpus, getCorpus, connectToDeep, getDeep };

