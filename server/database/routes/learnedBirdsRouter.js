// Import the necessary dependencies
const express = require('express');
const { LearnedBirds } = require('../models/learnedBirds');

// Create router
const learnedBirdsRouter = express.Router();


// GET route to fetch learned birds for a user
learnedBirdsRouter.get('/', (req, res) => {
  const { userId } = req.query; // Assuming the userId is passed as a query parameter

  // Find all learnedBirds for the given userId
  LearnedBirds.findAll({ where: { userId } })
    .then((learnedBirds) => {
      res.status(200).json(learnedBirds); // Return the learnedBirds as the response
    })
    .catch((error) => {
      console.error('Error fetching learnedBirds:', error);
      res.status(500).json({ error: 'Failed to fetch learnedBirds' });
    });
});

// POST route to add a learnedBird
learnedBirdsRouter.post('/', (req, res) => {
  const { birdId, userId, guessedAt } = req.body; 

  // Create a new learnedBird entry in the database
  LearnedBirds.create({ birdId, userId, guessedAt})
    .then((learnedBird) => {
      res.status(201).json(learnedBird); // Return the created learnedBird as the response
    })
    .catch((error) => {
      console.error('Error adding learnedBird:', error);
      res.status(500).json({ error: 'Failed to add learnedBird' });
    });
});

// DELETE route to clear personal progress
learnedBirdsRouter.delete('/', (req, res) => {
  const { userId } = req.query; 

  // Delete all learnedBirds for the given userId
  LearnedBirds.destroy({ where: { userId } })
    .then(() => {
      res.status(200).json({ message: 'Learned birds cleared successfully' });
    })
    .catch((error) => {
      console.error('Error clearing learnedBirds:', error);
      res.status(500).json({ error: 'Failed to clear learnedBirds' });
    });
});




// Export the router
module.exports = {
  learnedBirdsRouter,
};
