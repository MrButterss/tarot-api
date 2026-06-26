const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs   = require('fs');

const dbPath     = process.env.DB_PATH || path.join(__dirname, '../../db/tarot.db');
const schemaPath = path.join(__dirname, '../../db/schema.sql');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);

// node:sqlite uses exec() for PRAGMAs instead of .pragma()
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

module.exports = db;
