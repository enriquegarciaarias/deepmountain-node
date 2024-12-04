const express = require('express');
const router = express.Router();
const { getDataCorpus } = require('../controllers/corpusManager');
const { getDataDeep } = require('../controllers/deepMountain');
const { getCorpusView } = require('../controllers/corpusView');
const { getDatasetJson } = require('../controllers/datasetJson');

// Route to fetch data
router.get('/data', getDataCorpus);
router.get('/dataDeep', getDataDeep);
router.get('/corpusView', getCorpusView);
router.get('/datasetJson', getDatasetJson);

module.exports = router;
