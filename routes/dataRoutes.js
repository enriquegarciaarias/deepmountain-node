const express = require('express');
const router = express.Router();
const { getDataMongo } = require('../controllers/dataController');

// Route to fetch data
router.get('/data', getDataMongo);

module.exports = router;
