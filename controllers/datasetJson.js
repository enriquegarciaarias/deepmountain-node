const fs = require('fs');
const path = require('path');

// Controller function to fetch data from a JSON file
async function getDatasetJson(req, res) {
  try {
    // Extract the 'f' query parameter
    const filePath = req.query.f;

    // Validate the 'f' parameter
    if (!filePath) {
      return res.status(400).json({ message: 'File path is required' });
    }



    // Read and parse the JSON file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    const totalRowCount = Array.isArray(jsonData) ? jsonData.length : jsonData.data?.length || 0;

    // Respond with the JSON data
    res.json({ data: jsonData, meta: { totalRowCount }  });
  } catch (error) {
    const filePath = req.query.f;
    console.error('Error reading the JSON file: ', error);
    res.status(500).json({ message: `Error reading the file ${filePath}` });
  }
}

module.exports = { getDatasetJson };
