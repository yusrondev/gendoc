const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001; // You can use any port here

// Middleware for parsing JSON bodies
app.use(express.json());

// CRUD Operations on Files in the docs Directory

// Create a new file with folder support
app.post('/docs', (req, res) => {
  const { filename, content, label, position, description } = req.body;
  const filePath = path.join(__dirname, 'docs', `${filename}.md`);
  const folderPath = path.dirname(filePath);
  const categoryFilePath = path.join(folderPath, '_category_.json');

  // Create the directory if it doesn't exist
  fs.mkdir(folderPath, { recursive: true }, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating directory' });
    }

    // Write the main file
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error writing file' });
      }

      // Create _category_.json if it doesn't exist
      fs.access(categoryFilePath, fs.constants.F_OK, (err) => {
        if (err) {
          const categoryContent = {
            label: label || "Default Label",  // Default value if not provided
            position: position || 1,          // Default position
            link: {
              type: "generated-index",
              description: description || "Default description." // Default description
            }
          };

          fs.writeFile(categoryFilePath, JSON.stringify(categoryContent, null, 2), (err) => {
            if (err) {
              console.error(`Error writing _category_.json: ${err.message}`);
            }
          });
        }
      });

      res.status(201).json({ message: 'File created successfully' });
    });
  });
});

// Read a file
app.get('/docs/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'docs', `${filename}.md`);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json({ content: data });
  });
});

// Update a file
app.put('/docs/:filename', (req, res) => {
  const filename = req.params.filename;
  const { content } = req.body;
  const filePath = path.join(__dirname, 'docs', `${filename}.md`);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating file' });
    }
    res.status(200).json({ message: 'File updated successfully' });
  });
});

// Delete a file
app.delete('/docs/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'docs', `${filename}.md`);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json({ message: 'File deleted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
