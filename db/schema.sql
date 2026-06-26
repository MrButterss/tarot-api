-- Tarot DB schema
-- Run automatically by src/config/db.js on first connect (CREATE TABLE IF NOT EXISTS).
-- Safe to re-run manually: all statements are idempotent.

CREATE TABLE IF NOT EXISTS cards (
  id             INTEGER  PRIMARY KEY AUTOINCREMENT,
  card_name_en   TEXT     NOT NULL UNIQUE,
  card_name_th   TEXT     NOT NULL,
  arcana         TEXT     NOT NULL,
  image_url      TEXT     NOT NULL,
  upright_th     TEXT     NOT NULL,
  reversed_th    TEXT     NOT NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interpretations (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id     INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  category    TEXT    NOT NULL CHECK(category IN ('love','work','money','health','general')),
  upright_th  TEXT    NOT NULL,
  reversed_th TEXT    NOT NULL,
  UNIQUE(card_id, category)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cards_arcana       ON cards(arcana);
CREATE INDEX IF NOT EXISTS idx_interp_card_cat    ON interpretations(card_id, category);
