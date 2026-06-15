# Deploy Guide — Tarot API

This guide walks you through deploying the Tarot API to **Vercel** (free) so you get a
public URL like `https://your-project.vercel.app/api/tarot?category=love` that the
LINE OA bot (via Make.com) can call.

No prior GitHub or Vercel account needed — we'll create both from scratch.

---

## What you're deploying

```
tarot-api/
├── api/tarot.js     <- the serverless function (the actual API)
├── data/cards.json  <- 78 tarot cards (Thai meanings)
├── package.json
└── vercel.json
```

Once deployed, hitting:
```
https://your-project.vercel.app/api/tarot?category=love
```
returns a LINE Flex Message JSON for a random card (love/work/money/health/general).

---

## Step 1 — Create a GitHub account

1. Go to **https://github.com/signup**
2. Sign up with your email, set a username and password
3. Verify your email (check inbox for the confirmation link)

---

## Step 2 — Create a new repository

1. Once logged in, click the **+** icon (top right) → **New repository**
2. Repository name: `tarot-api` (or any name you like)
3. Set it to **Public** or **Private** — both work fine with Vercel's free plan
4. **Do NOT** check "Add a README" — leave it empty
5. Click **Create repository**
6. Keep this page open — GitHub will show you a URL like:
   `https://github.com/your-username/tarot-api.git`

---

## Step 3 — Push this folder to GitHub

Open a terminal (PowerShell) and navigate into the `tarot-api` folder:

```powershell
cd "d:\dev webapp\LineOA RxSU38\tarot-api"
```

Then run these commands one by one:

```powershell
git init
git add .
git commit -m "Initial commit - Tarot API"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/tarot-api.git
git push -u origin main
```

> Replace `YOUR-USERNAME` with your actual GitHub username.
> If `git` is not installed, download it from **https://git-scm.com/download/win**
> and restart your terminal after installing.

When you run `git push`, a browser window may open asking you to log in to
GitHub and authorize — sign in and approve.

After this, refresh your GitHub repo page — you should see all the files
(`api/`, `data/`, `package.json`, `vercel.json`).

---

## Step 4 — Create a Vercel account

1. Go to **https://vercel.com/signup**
2. Choose **Continue with GitHub** — this links Vercel to your GitHub account
   directly (recommended, makes deployment automatic)
3. Authorize Vercel to access your GitHub account when prompted

---

## Step 5 — Import and deploy the project

1. On the Vercel dashboard, click **Add New...** → **Project**
2. Find your `tarot-api` repository in the list and click **Import**
3. Vercel will auto-detect the settings — you don't need to change anything:
   - Framework Preset: **Other**
   - Root Directory: `.` (leave as default)
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
4. Click **Deploy**
5. Wait ~30-60 seconds. When done, you'll see "Congratulations!" with a
   screenshot of your project and a URL like:
   ```
   https://tarot-api-xxxx.vercel.app
   ```

---

## Step 6 — Test the API

Open your browser and go to:

```
https://tarot-api-xxxx.vercel.app/api/tarot?category=love
```

(replace `tarot-api-xxxx.vercel.app` with your actual Vercel URL)

You should see a big JSON response starting with:
```json
{
  "type": "flex",
  "altText": "💕 ไพ่ทาโรต์: ...",
  "contents": { ... }
}
```

Try the other categories too:
- `?category=work`
- `?category=money`
- `?category=health`
- `?category=general`

Refresh a few times — you should get a different random card each time.

---

## Step 7 — Preview the Flex Message visually (optional)

1. Copy the full JSON response from Step 6
2. Go to **https://developers.line.biz/flex-simulator/**
3. Paste the JSON in and click "Apply" — you'll see how it looks as a LINE message

---

## Step 8 — Connect to the LINE OA via Make.com

In your Make.com scenario:

1. Add an **HTTP > Make a request** module
2. URL: `https://tarot-api-xxxx.vercel.app/api/tarot?category=general`
   (you can map `category` dynamically based on what the user typed)
3. Method: `GET`
4. Parse response: **Yes**
5. Use the parsed JSON body directly as the `messages[0]` payload in the
   LINE **Reply Message** / **Push Message** HTTP call
   (the JSON returned is already a valid LINE Flex Message object)

⚠️ Per project rules — **don't touch the active "LINE reply message" scenario
without confirming with Kattiya first.** Test this in a separate/duplicate
scenario before wiring it into production.

---

## Updating the deployed API later

Any time you edit files in `tarot-api/` and want to redeploy:

```powershell
cd "d:\dev webapp\LineOA RxSU38\tarot-api"
git add .
git commit -m "Update tarot data/logic"
git push
```

Vercel automatically redeploys within ~30 seconds of every push to `main`.
No need to repeat the import step.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `git: command not found` | Install Git: https://git-scm.com/download/win, restart terminal |
| Push asks for login repeatedly | Use GitHub Desktop (https://desktop.github.com/) as an alternative to command-line git |
| Vercel deploy fails | Check the build log on Vercel — usually a typo in `vercel.json` or `package.json` |
| API returns 500 error | Check Vercel dashboard → your project → **Logs** for the error message |
| Images don't load in LINE | Make sure the image URL in the response starts with `https://images.weserv.nl/...` — LINE requires HTTPS images |
