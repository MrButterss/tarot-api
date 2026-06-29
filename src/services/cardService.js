const db = require('../config/db');
const flexBuilder = require('../utils/flexBuilder');

const getInterpretation = db.prepare(`
  SELECT upright_th, reversed_th
  FROM interpretations
  WHERE card_id = ? AND category = ?
`);

/**
 * Draws one random card from the DB and returns a complete LINE Flex Message.
 * Falls back to the card's own generic upright_th/reversed_th if no
 * category-specific interpretation row exists.
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

  const interpretation = getInterpretation.get(card.id, category);
  if (interpretation) {
    card.upright_th = interpretation.upright_th;
    card.reversed_th = interpretation.reversed_th;
  }

  const isReversed = Math.random() < 0.5;

  return flexBuilder.buildFlexMessage(card, isReversed, category);
}

module.exports = { drawRandomCard };
