const { getCorpus } = require('../config/db');

// Controller function to fetch data from MongoDB with optional query parameters
async function getCorpusView(req, res) {
  try {
    const db = getCorpus();
    const collection = db.collection('CorpusProc');

    // Parse query parameters with defaults
    const start = parseInt(req.query.start) || 0;
    const size = parseInt(req.query.size) || 10;
    const filters = JSON.parse(req.query.filters || '[]');
    const globalFilter = req.query.globalFilter || '';
    const sorting = JSON.parse(req.query.sorting || '[{"id": "timestamp", "desc": true}]');

    // MongoDB query setup
    let query = {};

    // Example filter handling - you may need to adjust depending on filter structure
    filters.forEach(filter => {
      query[filter.id] = filter.value;
    });

    // If there's a global filter, apply it as a text search (requires text index on collection)
    if (globalFilter) {
      query.$text = { $search: globalFilter };
    }

    // Sort options (only first sorting field is applied here)
    const sortField = sorting[0]?.id || 'timestamp';
    const sortOrder = sorting[0]?.desc ? -1 : 1;

    // Fetch data with filters, sorting, pagination
    const results = await collection
      .find(query)
      .sort({ [sortField]: sortOrder })
      .skip(start)
      .limit(size)
      .toArray();

    // For total row count, count without pagination
    const totalRowCount = await collection.countDocuments(query);

    // Respond with data and metadata
    res.json({ data: results, meta: { totalRowCount } });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
}

module.exports = { getCorpusView };
