# WeProduce — Deployment Guide

## Backend → Vercel

1. Push the `backend/` directory to a GitHub repo (or the whole monorepo, setting
   Vercel's **Root Directory** to `backend`).
2. In the Vercel dashboard, import the project.
3. Add all variables from `backend/.env.example` under **Settings → Environment Variables**
   (Production and Preview). Use the Supabase pooled URL for `DATABASE_URL`.
4. Build command: `npm run build` (runs `prisma generate && next build`).
5. Since `vercel.json` declares a cron job, Vercel will automatically register it on deploy —
   no extra configuration needed. Cron jobs require a Pro plan or above for schedules more
   frequent than once/day; the included schedule (`5 0 * * *`, once daily) works on the
   Hobby plan.
6. After the first deploy, run migrations against production:
   ```bash
   DATABASE_URL="<production-direct-url>" npx prisma migrate deploy
   ```
7. Update the Google OAuth Client's authorized redirect URI to your production URL:
   `https://<your-vercel-domain>/api/auth/callback`.

## Mobile → Expo / App Stores

### Development / internal testing
```bash
cd mobile
eas login          # if using EAS (recommended)
eas build:configure
```
For quick internal sharing without app store review, use **Expo Go** during development, or
build an internal distribution build:
```bash
eas build --profile preview --platform all
```

### Production builds
1. Set `expo.extra.apiUrl` in `app.json` to your production API URL.
2. Set `expo.extra.googleClientId` to your production Google OAuth Client ID.
3. Build:
   ```bash
   eas build --profile production --platform ios
   eas build --profile production --platform android
   ```
4. Submit:
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

Since WeProduce is built for exactly three specific developers, you likely don't need public
App Store / Play Store distribution — **TestFlight** (iOS) and an internal testing track
(Android) are usually sufficient, and both skip full store review.

## Environment checklist before going live

- [ ] `ALLOWED_EMAILS` set to the three members' Google account emails
- [ ] `JWT_SECRET` and `CRON_SECRET` are strong, unique, randomly generated values
- [ ] Supabase Row Level Security is either disabled (since all writes go through the
      backend's service-role Prisma connection) or configured to allow the backend's
      connection role
- [ ] Google OAuth redirect URI matches the deployed domain exactly
- [ ] Vercel cron job visible under **Project → Cron Jobs** after first deploy
- [ ] Mobile app's `apiUrl` points at the production backend, not localhost
