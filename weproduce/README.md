# WeProduce

**Code Every Day. Compete Every Week.**

A coding-accountability platform for exactly three developers. Solves on LeetCode and
HackerRank plus GitHub commits are tracked automatically and rolled into **one** unified
weekly score on **one** leaderboard.

## Structure

```
weproduce/
├── backend/          Next.js (App Router) REST API, TypeScript, Prisma
│   ├── prisma/schema.prisma
│   └── src/
│       ├── app/api/          route handlers (thin HTTP layer)
│       ├── controllers/      request validation
│       ├── services/         business logic (scoring, streaks, platform syncs)
│       ├── repositories/     database access (Prisma)
│       ├── middleware/       auth
│       ├── config/           scoring rules
│       ├── types/            shared DTOs
│       └── utils/            logger, JWT, API response envelope, date helpers
├── mobile/           Expo (React Native) app, TypeScript, NativeWind
│   └── src/
│       ├── screens/          Splash, Login, Onboarding, Dashboard, Leaderboard,
│       │                     Activity, Profile, Settings
│       ├── components/       ScoreCard, LeaderboardCard, ActivityCard, StreakCard, etc.
│       ├── navigation/        stack + bottom tabs
│       ├── context/           auth state
│       ├── hooks/              React Query data hooks
│       └── services/           API client, secure token storage
├── database/
│   └── schema.sql     raw SQL schema (run this in Supabase)
└── docs/
    ├── API.md         full endpoint reference
    ├── SETUP.md        local dev setup, Google OAuth, platform linking
    └── DEPLOYMENT.md    Vercel + EAS deployment steps
```

## Quick start

See [`docs/SETUP.md`](docs/SETUP.md) for the full walkthrough. In short:

```bash
# 1. Database
# Run database/schema.sql in your Supabase SQL editor

# 2. Backend
cd backend && cp .env.example .env   # fill in real values
npm install && npx prisma generate && npm run dev

# 3. Mobile
cd ../mobile && npm install && npm start
```

## Scoring

| Source                | Points |
|------------------------|--------|
| LeetCode — Easy         | 5      |
| LeetCode — Medium       | 10     |
| LeetCode — Hard         | 20     |
| HackerRank challenge    | 8      |
| GitHub push             | 2      |
| Daily streak bonus      | 5      |

One score. One leaderboard. Reset every Monday (ISO week).

## Known integration constraints

- **LeetCode** has no official public API — syncing uses LeetCode's unauthenticated
  GraphQL endpoint (`recentAcSubmissionList`), which is undocumented and could change.
- **HackerRank** has no public API for reading submission history at all. Auto-sync
  attempts an unofficial endpoint and gracefully degrades to manual logging if it fails
  (see `docs/SETUP.md`).
- **GitHub** uses the official REST API via Octokit and is the most reliable of the three.

Full details in [`docs/API.md`](docs/API.md) and [`docs/SETUP.md`](docs/SETUP.md).
