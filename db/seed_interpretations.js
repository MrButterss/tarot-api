/**
 * Seed script: reads data/interpretations/<category>.json and upserts rows
 * into the interpretations table, resolving card_id by card_name_en.
 * Idempotent — safe to run multiple times (uses INSERT OR REPLACE).
 *
 * Usage:
 *   node db/seed_interpretations.js <category>
 *   node db/seed_interpretations.js love
 */

const path = require('path');
const db   = require('../src/config/db');

const category = process.argv[2];
const VALID_CATEGORIES = ['love', 'work', 'money', 'health', 'general'];

if (!category || !VALID_CATEGORIES.includes(category)) {
  console.error(`Usage: node db/seed_interpretations.js <category>`);
  console.error(`<category> must be one of: ${VALID_CATEGORIES.join(', ')}`);
  process.exit(1);
}

const dataPath = path.join(__dirname, `../data/interpretations/${category}.json`);
const entries  = require(dataPath);

const getCardId = db.prepare('SELECT id FROM cards WHERE card_name_en = ?');
const insert = db.prepare(`
  INSERT OR REPLACE INTO interpretations
    (card_id, category, upright_th, reversed_th)
  VALUES
    (@card_id, @category, @upright_th, @reversed_th)
`);

console.log(`Seeding ${entries.length} "${category}" interpretations...`);
db.exec('BEGIN');
for (const entry of entries) {
  const card = getCardId.get(entry.card_name_en);
  if (!card) {
    db.exec('ROLLBACK');
    console.error(`ERROR: no card found with card_name_en="${entry.card_name_en}"`);
    process.exit(1);
  }
  insert.run({
    card_id: card.id,
    category,
    upright_th: entry.upright_th,
    reversed_th: entry.reversed_th,
  });
}
db.exec('COMMIT');
console.log(`Seeded ${entries.length} "${category}" interpretations.`);

// Verify
const row = db.prepare('SELECT COUNT(*) AS count FROM interpretations WHERE category = ?').get(category);
console.log(`Verification: ${row.count} rows in interpretations table for category="${category}".`);

if (row.count !== entries.length) {
  console.error(`WARNING: expected ${entries.length} rows but found ${row.count}.`);
  process.exit(1);
}

process.exit(0);
