const fs = require('fs');
const path = require('path');

// Controller to fetch the content of a file
const getFileContent = (req, res) => {
  const filePath = req.query.f;


  // Read the file and return its content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ message: 'Error reading file' });
    }

    // Send the file content as the response
    res.send(data);
  });
};

module.exports = {
  getFileContent
};
