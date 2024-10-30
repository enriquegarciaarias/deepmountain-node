require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDB } = require('./config/db');
const dataRoutes = require('./routes/dataRoutes'); // Data routes
const fileRoutes = require('./routes/fileRoutes'); // File routes

const app = express();
app.use(cors());
app.use(express.json());  // Parse JSON bodies

const PORT = process.env.PORT || 5000;

// Use the data and file routes
app.use('/api', dataRoutes);  // Routes for data
app.use('/api', fileRoutes);  // Routes for file handling

// Start the server after database connection
connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start the server:', error);
});


