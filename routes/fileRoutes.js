const express = require('express');
const router = express.Router();
const { getFileContent } = require('../controllers/fileController');

// Route to fetch file content
router.get('/file', getFileContent);

module.exports = router;
