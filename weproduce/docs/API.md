# WeProduce API Reference

Base URL: `https://your-app.vercel.app/api`

All authenticated endpoints require:
```
Authorization: Bearer <jwt>
```

Every response uses this envelope:
```json
{ "success": true, "data": { ... }, "meta": { ... } }
```
or on error:
```json
{ "success": false, "error": { "code": "BAD_REQUEST", "message": "..." } }
```

---

## Auth

### `GET /auth/login`
Returns the Google OAuth consent URL for the client to open.
```json
{ "success": true, "data": { "url": "https://accounts.google.com/o/oauth2/v2/auth?..." } }
```

### `POST /auth/login`
Exchanges a Google authorization `code` for a session JWT.

Request:
```json
{ "code": "4/0Adeu5B..." }
```
Response:
```json
{ "success": true, "data": { "token": "eyJhbGciOi...", "userId": "uuid", "isNewUser": true } }
```

### `GET /auth/callback`
Google's OAuth redirect target. Not called directly by the client — it forwards the `code` back to the app via the `weproduce://auth-callback` deep link.

---

## Profile

### `GET /profile`
Returns the current user's profile.
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "displayName": "Jane Doe",
    "avatarUrl": "https://...",
    "bio": null,
    "github": "janedoe",
    "leetcode": "janedoe123",
    "hackerrank": "jane_dev",
    "currentStreak": 4,
    "longestStreak": 12,
    "weeklyScore": 87,
    "onboardingComplete": true
  }
}
```

### `PUT /profile`
Partial update. All fields optional.
```json
{
  "displayName": "Jane Doe",
  "avatarUrl": "https://...",
  "bio": "Building things daily.",
  "github": "janedoe",
  "leetcode": "janedoe123",
  "hackerrank": "jane_dev"
}
```

---

## Dashboard

### `GET /dashboard`
Aggregated view for the home screen: weekly score, rank, streak, today's progress, recent activity, and a 3-entry leaderboard preview.

---

## Leaderboard

### `GET /leaderboard`
The single unified leaderboard for the current ISO week (Mon–Sun), sorted by `weeklyScore` descending.
```json
{
  "success": true,
  "data": [
    { "rank": 1, "userId": "uuid", "displayName": "Jane", "avatarUrl": "...", "weeklyScore": 87, "currentStreak": 4 }
  ],
  "meta": { "weekStart": "2026-07-13" }
}
```

---

## Activities

### `GET /activities?limit=20`
Returns recent activities for the current user, newest first.

### `POST /activities/sync`
Triggers a full sync across all linked platforms (GitHub, LeetCode, HackerRank), then recomputes the user's weekly score and everyone's leaderboard rank.
```json
{
  "success": true,
  "data": {
    "platformResults": {
      "github": { "commitsProcessed": 5, "created": 2 },
      "leetcode": { "solvesProcessed": 3, "created": 1 },
      "hackerrank": { "solvesProcessed": 0, "created": 0, "autoSyncAvailable": false }
    },
    "weeklyScore": 87
  }
}
```

---

## GitHub

### `GET /github/commits`
Returns recent commits for the current user's linked GitHub account (last 14 days).

---

## LeetCode

### `GET /leetcode/sync`
Runs a LeetCode-only sync (used for a manual "refresh this platform" action).

---

## HackerRank

### `GET /hackerrank/sync`
Runs a HackerRank-only sync. **Note:** HackerRank has no official public API; if the unofficial endpoint this relies on is unavailable, the response includes `"autoSyncAvailable": false` and no points are lost — points can be logged manually from the app instead (see `docs/SETUP.md`).

---

## Cron

### `GET /cron/daily-sync`
Internal endpoint invoked by Vercel Cron once daily. Requires `Authorization: Bearer <CRON_SECRET>`. Runs sync + streak-reset for every user.

---

## Scoring Reference

| Source                  | Points |
|--------------------------|--------|
| LeetCode — Easy           | 5      |
| LeetCode — Medium         | 10     |
| LeetCode — Hard           | 20     |
| HackerRank challenge      | 8      |
| GitHub push               | 2      |
| Daily streak bonus        | 5      |

There is only ever **one** weekly score per user — it's the sum of all the above for the current ISO week.
