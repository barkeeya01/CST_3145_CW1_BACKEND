const express = require('express');
const path = require('path');
const fs = require('fs');

const staticFilesRouter = express.Router();

// Serve lesson images
staticFilesRouter.use('/lesson-images', express.static(path.join(__dirname, '../public/images')));

// Middleware to handle missing images
staticFilesRouter.use('/lesson-images/:image', (req, res) => {
  const imagePath = path.join(__dirname, '../public/images', req.params.image);

  // Check if the file exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist: Return an error message
      return res.status(404).json({ error: `Image '${req.params.image}' not found.` });
    }

    // File exists but was not served: Fallback
    res.sendFile(imagePath);
  });
});

module.exports = staticFilesRouter;
