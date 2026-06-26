/**
 * Seed script: reads data/cards.json and inserts all 78 cards into the DB.
 * Idempotent — safe to run multiple times (uses INSERT OR REPLACE).
 *
 * Usage:
 *   node db/seed_cards.js
 */

const path  = require('path');
const db    = require('../src/config/db');
const cards = require('../data/cards.json');

const insert = db.prepare(`
  INSERT OR REPLACE INTO cards
    (card_name_en, card_name_th, arcana, image_url, upright_th, reversed_th)
  VALUES
    (@card_name_en, @card_name_th, @arcana, @image_url, @upright_th, @reversed_th)
`);

// node:sqlite has no db.transaction() — use explicit BEGIN/COMMIT (~50x faster than row-by-row).
console.log(`Seeding ${cards.length} cards...`);
db.exec('BEGIN');
for (const card of cards) {
  insert.run(card);
}
db.exec('COMMIT');
console.log(`Seeded ${cards.length} cards.`);

// Verify
const row = db.prepare('SELECT COUNT(*) AS count FROM cards').get();
console.log(`Verification: ${row.count} rows in cards table.`);

if (row.count !== cards.length) {
  console.error(`WARNING: expected ${cards.length} rows but found ${row.count}.`);
  process.exit(1);
}

process.exit(0);
