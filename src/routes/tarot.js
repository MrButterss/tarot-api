const express = require('express');
const router = express.Router();
const cardService = require('../services/cardService');

// Valid categories — defined here as the single source of truth for the route layer.
// cardService and flexBuilder use CATEGORIES internally; we only need the key list here
// to validate the incoming param before passing it down.
const VALID_CATEGORIES = ['love', 'work', 'money', 'health', 'general'];

// GET /api/tarot?category=love
router.get('/tarot', (req, res) => {
  const categoryParam = (req.query.category || 'general').toLowerCase();
  const category = VALID_CATEGORIES.includes(categoryParam) ? categoryParam : 'general';

  try {
    const flexMessage = cardService.drawRandomCard(category);
    res.json(flexMessage);
  } catch (err) {
    console.error('Error drawing card:', err);
    res.status(500).json({ error: 'Failed to draw a card. Please try again.' });
  }
});

module.exports = router;
