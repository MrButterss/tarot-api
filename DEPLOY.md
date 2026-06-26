# Deploy to VPS

This guide deploys the Express tarot API to the VPS at `147.50.228.39`, kept alive with PM2.

---

## One-time setup

```bash
# 1. SSH into VPS
ssh user@147.50.228.39

# 2. Check Node.js is installed (needs v22+ for node:sqlite)
node -v
# If missing, install via nvm:
#   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
#   source ~/.bashrc
#   nvm install 22 && nvm use 22

# 3. Install PM2 globally
npm install -g pm2

# 4. Clone the repo (or copy the tarot-api folder to the VPS)
git clone https://github.com/MrButterss/lineoa-rxsu38.git ~/lineoa-rxsu38
cd ~/lineoa-rxsu38/tarot-api

# 5. Install dependencies
npm install

# 6. Set up environment file
cp .env.example .env
nano .env
# Set: PORT=3001
# Set: DB_PATH=./db/tarot.db  (default is fine, no change needed)

# 7. Seed the database
npm run seed
```

---

## Start the API

```bash
cd ~/lineoa-rxsu38/tarot-api

pm2 start src/index.js --name tarot-api
pm2 save          # persist the process list across reboots
pm2 startup       # generate and run the startup hook command it prints
```

---

## Verify

```bash
curl http://localhost:3001/api/tarot?category=love
# Should return LINE Flex JSON starting with: {"type":"flex","altText":"💕 ..."}

curl http://localhost:3001/api/tarot?category=work
curl http://localhost:3001/api/tarot?category=general
```

---

## Update n8n

In the n8n workflow, find the HTTP Request node that calls the tarot API and change the URL from:
```
https://project-qnhm7.vercel.app/api/tarot?category={{...}}
```
To:
```
http://147.50.228.39:3001/api/tarot?category={{...}}
```

Test the n8n workflow manually before retiring the Vercel deployment.

---

## Useful PM2 commands

```bash
pm2 status              # see if tarot-api is running
pm2 logs tarot-api      # view live logs
pm2 restart tarot-api   # restart after a code update
pm2 stop tarot-api      # stop the process
pm2 delete tarot-api    # remove from PM2 process list
```

---

## Updating the API after a code change

```bash
cd ~/lineoa-rxsu38/tarot-api
git pull
npm install   # only needed if package.json changed
pm2 restart tarot-api
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `node:sqlite` not found | Ensure Node.js v22+. Run `node -v` and upgrade if needed. |
| `No cards found in database` | Run `npm run seed` from the `tarot-api` directory. |
| Port 3001 already in use | Run `pm2 status` — another pm2 process may be holding the port. |
| curl returns `Connection refused` | Run `pm2 status` — tarot-api may have crashed. Check `pm2 logs tarot-api`. |
| Images not loading in LINE | Confirm `image_url` in the DB starts with `https://`. The weserv proxy requires a valid upstream URL. |
