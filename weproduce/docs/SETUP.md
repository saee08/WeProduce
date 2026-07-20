# WeProduce — Setup Guide

## 1. Prerequisites
- Node.js 20+
- npm or yarn
- A Supabase project (PostgreSQL)
- A Google Cloud project with OAuth 2.0 credentials
- Expo CLI (`npm install -g expo-cli`) and the Expo Go app, or an iOS/Android simulator
- (Optional) A GitHub personal access token per member, for commit syncing

## 2. Database (Supabase)

1. Create a new Supabase project.
2. In the SQL editor, run `database/schema.sql`.
3. Copy the **pooled connection string** (Transaction mode, port 6543) for `DATABASE_URL`,
   and the **direct connection string** (port 5432) for `DIRECT_URL` — Prisma needs both
   when running on serverless (Vercel).

## 3. Google OAuth

1. In Google Cloud Console, create an OAuth 2.0 Client ID (type: Web application).
2. Add an authorized redirect URI: `https://your-app.vercel.app/api/auth/callback`
   (and `http://localhost:3000/api/auth/callback` for local dev).
3. Copy the Client ID and Client Secret into the backend `.env`.
4. Since WeProduce is scoped to exactly three developers, set `ALLOWED_EMAILS` in the
   backend environment to a comma-separated allowlist of the three Google account emails.
   Sign-in attempts from any other account are rejected with 403.

## 4. Backend setup

```bash
cd backend
cp .env.example .env   # fill in DATABASE_URL, DIRECT_URL, GOOGLE_*, JWT_SECRET, etc.
npm install
npx prisma generate
npx prisma migrate deploy   # or `npx prisma db push` if you already ran schema.sql directly
npm run dev
```
The API is now running at `http://localhost:3000/api`.

## 5. Mobile setup

```bash
cd mobile
npm install
```

Edit `app.json` → `expo.extra`:
```json
{
  "apiUrl": "http://localhost:3000/api",
  "googleClientId": "your-google-client-id.apps.googleusercontent.com"
}
```
(Use your deployed Vercel URL instead of localhost once the backend is live — on a physical
device, `localhost` won't resolve to your dev machine; use your machine's LAN IP instead.)

```bash
npm start
```
Scan the QR code with Expo Go, or press `i` / `a` to launch a simulator.

## 6. Linking each member's accounts

After first Google sign-in, each of the three members is walked through onboarding to link:
- **GitHub username** (and, separately, a personal access token stored server-side via
  `PUT /profile` is not exposed in the UI yet — see the note below)
- **LeetCode username** — must have a public LeetCode profile for the sync to work
- **HackerRank username** — see the caveat below

### GitHub token
Commit syncing calls the GitHub API on the user's behalf and needs a token with `repo`
read access (or none, for public-repo-only tracking via the public events API, which is
what `githubService.fetchRecentCommits` uses by default — no token strictly required for
public activity). If you want private-repo commits counted, generate a fine-grained PAT
per member and store it via a direct `platformAccounts` upsert (extend the profile update
endpoint to accept a `githubToken` field if you need this in production).

### HackerRank caveat
HackerRank does not provide an official public API for reading submission history. The
`hackerrank/sync` endpoint attempts an unofficial endpoint used by HackerRank's own profile
page; if it's unavailable (private profile, endpoint changed, rate-limited), the sync
returns `autoSyncAvailable: false` and no activities are recorded automatically. In that
case, log solves manually — call `hackerrankService.recordManualSolve` from a small
"Log a solve" form (not included as a full screen here, but the service function is ready
to wire up to a button in `ActivityScreen`).

## 7. Running a sync

- From the app: tap **Sync My Activity** on the Dashboard, or pull-to-refresh any screen.
- From the API: `POST /activities/sync` with a valid Bearer token.
- Automatically: once deployed to Vercel, `vercel.json` schedules `/api/cron/daily-sync`
  to run once a day (00:05 UTC) for all three members.
