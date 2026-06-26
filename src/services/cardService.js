const db = require('../config/db');
const flexBuilder = require('../utils/flexBuilder');

/**
 * Draws one random card from the DB and returns a complete LINE Flex Message.
 * The interpretations table is empty in Slice 2 — card.upright_th / card.reversed_th
 * are used directly. Slice 3 will replace this with a category-specific JOIN.
 *
 * @param {string} category - validated category key (love|work|money|health|general)
 * @returns {object} LINE Flex Message JSON
 */
function drawRandomCard(category) {
  const stmt = db.prepare('SELECT * FROM cards ORDER BY RANDOM() LIMIT 1');
  const card = stmt.get();

  if (!card) {
    throw new Error('No cards found in database. Run `npm run seed` first.');
  }

  const isReversed = Math.random() < 0.5;

  return flexBuilder.buildFlexMessage(card, isReversed, category);
}

module.exports = { drawRandomCard };
