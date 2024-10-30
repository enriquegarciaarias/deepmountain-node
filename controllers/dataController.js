const { getDB } = require('../config/db');

// Controller function to fetch data from MongoDB
async function getDataMongo(req, res) {
  try {
    const db = getDB(); // Get the connected database
    const collection = db.collection('CorpusManager');
    const results = await collection.find().sort({ timestamp: -1 }).limit(40).toArray();
    res.json(results);  // Send the results back to the client
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
}

module.exports = { getDataMongo };
