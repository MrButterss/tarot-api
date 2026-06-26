# Tarot API

Express API for the LINE OA RxSU38 tarot feature. Returns a random LINE Flex Message tarot reading for a given life-topic category.

## Prerequisites

- Node.js 22+ (built-in `node:sqlite` requires Node 22.5+)
- npm

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env
# Edit .env if your DB lives somewhere other than ./db/tarot.db

# 3. Seed the database (Slice 1 — required before starting)
npm run seed

# 4. Start the server
npm start
# Output: Tarot API running on port 3001
```

## Test Locally

```bash
curl "http://localhost:3001/api/tarot?category=love"
```

Valid categories: `love`, `work`, `money`, `health`, `general`  
Omitting `?category` or passing an invalid value defaults to `general`.

## VPS Deployment (PM2)

Run these commands on your Hostatom VPS after cloning/copying the project:

```bash
# Install dependencies
npm install

# Copy and configure .env
cp .env.example .env
# Set DB_PATH to an absolute path, e.g.:
# DB_PATH=/home/user/tarot-api/db/tarot.db

# Seed the database
npm run seed

# Install PM2 globally (once per server)
npm install -g pm2

# Start the API under PM2
pm2 start src/index.js --name tarot-api

# Persist across reboots
pm2 save
pm2 startup
# Follow the command that pm2 startup prints — it usually looks like:
# sudo env PATH=... pm2 startup systemd -u <user> --hp /home/<user>
```

## Verify on VPS

```bash
# From the VPS itself:
curl "http://localhost:3001/api/tarot?category=love"

# From the internet (replace with your server's IP or domain):
curl "http://your-server-ip:3001/api/tarot?category=love"
```

## PM2 Cheat Sheet

```bash
pm2 list                    # see all running processes
pm2 logs tarot-api          # tail the logs
pm2 restart tarot-api       # restart after a code change
pm2 stop tarot-api          # stop without removing
pm2 delete tarot-api        # stop and remove from PM2 list
```

## Project Structure

```
tarot-api/
├── api/tarot.js            # Original Vercel function (keep as fallback)
├── src/
│   ├── index.js            # Express entry point
│   ├── config/db.js        # SQLite connection (node:sqlite)
│   ├── routes/tarot.js     # GET /api/tarot
│   ├── services/cardService.js  # Random card draw logic
│   └── utils/flexBuilder.js     # LINE Flex Message builder
├── db/
│   ├── schema.sql          # Table definitions
│   ├── seed_cards.js       # Seed script (reads data/cards.json)
│   └── tarot.db            # SQLite database (gitignored)
└── data/cards.json         # Source of truth for card data
```

## Slices

| Slice | Status | What |
|-------|--------|------|
| 1 | Done | Migrate cards.json → SQLite DB |
| 2 | Done | Express API replacing Vercel serverless |
| 3 | Planned | Category-personalized fortune text |
