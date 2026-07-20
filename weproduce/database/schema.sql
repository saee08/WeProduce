-- ============================================================================
-- WeProduce — PostgreSQL Schema (Supabase)
-- Coding accountability platform for exactly 3 developers, ONE leaderboard.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- ENUM TYPES
-- ----------------------------------------------------------------------------
CREATE TYPE platform_type AS ENUM ('github', 'leetcode', 'hackerrank');
CREATE TYPE activity_type AS ENUM ('leetcode_solve', 'hackerrank_solve', 'github_push', 'streak_bonus');
CREATE TYPE difficulty_type AS ENUM ('easy', 'medium', 'hard', 'none');

-- ----------------------------------------------------------------------------
-- USERS  — one row per authenticated member (Google OAuth identity)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id          TEXT NOT NULL UNIQUE,
    email              TEXT NOT NULL UNIQUE,
    email_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- PROFILES — public-facing profile data, 1:1 with users
-- ----------------------------------------------------------------------------
CREATE TABLE profiles (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    display_name       TEXT NOT NULL,
    avatar_url         TEXT,
    bio                TEXT,
    timezone           TEXT NOT NULL DEFAULT 'UTC',
    onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- PLATFORM_ACCOUNTS — linked external accounts (github / leetcode / hackerrank)
-- ----------------------------------------------------------------------------
CREATE TABLE platform_accounts (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform           platform_type NOT NULL,
    username           TEXT NOT NULL,
    access_token       TEXT,              -- only used for github (encrypted at rest)
    last_synced_at     TIMESTAMPTZ,
    sync_status        TEXT NOT NULL DEFAULT 'pending', -- pending | success | error
    sync_error         TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, platform)
);

CREATE INDEX idx_platform_accounts_user_id ON platform_accounts(user_id);
CREATE INDEX idx_platform_accounts_platform ON platform_accounts(platform);

-- ----------------------------------------------------------------------------
-- ACTIVITIES — every discrete tracked event (solve / commit / bonus)
-- ----------------------------------------------------------------------------
CREATE TABLE activities (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform           platform_type NOT NULL,
    activity_type      activity_type NOT NULL,
    title              TEXT NOT NULL,
    difficulty         difficulty_type NOT NULL DEFAULT 'none',
    points             INTEGER NOT NULL CHECK (points >= 0),
    activity_date      DATE NOT NULL,
    external_id        TEXT,              -- dedupe key (commit sha, problem slug, etc.)
    metadata           JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- prevents double-counting the same external event for the same user/platform
    UNIQUE (user_id, platform, external_id)
);

CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_activity_date ON activities(activity_date DESC);
CREATE INDEX idx_activities_user_date ON activities(user_id, activity_date DESC);
CREATE INDEX idx_activities_platform ON activities(platform);

-- ----------------------------------------------------------------------------
-- SCORES — one row per user per ISO week (materialized weekly aggregate)
-- ----------------------------------------------------------------------------
CREATE TABLE scores (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_start_date    DATE NOT NULL,     -- Monday of the ISO week
    week_end_date      DATE NOT NULL,     -- Sunday of the ISO week
    leetcode_points    INTEGER NOT NULL DEFAULT 0,
    hackerrank_points  INTEGER NOT NULL DEFAULT 0,
    github_points      INTEGER NOT NULL DEFAULT 0,
    streak_bonus_points INTEGER NOT NULL DEFAULT 0,
    total_points       INTEGER NOT NULL DEFAULT 0,
    rank               INTEGER,
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, week_start_date)
);

CREATE INDEX idx_scores_week ON scores(week_start_date DESC);
CREATE INDEX idx_scores_total_points ON scores(week_start_date, total_points DESC);

-- ----------------------------------------------------------------------------
-- STREAKS — one row per user, current/longest streak tracking
-- ----------------------------------------------------------------------------
CREATE TABLE streaks (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak     INTEGER NOT NULL DEFAULT 0,
    longest_streak     INTEGER NOT NULL DEFAULT 0,
    last_active_date   DATE,
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- updated_at trigger helper
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_platform_accounts_updated_at BEFORE UPDATE ON platform_accounts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_streaks_updated_at BEFORE UPDATE ON streaks FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- Convenience view: current single leaderboard (this week)
-- ----------------------------------------------------------------------------
CREATE VIEW current_leaderboard AS
SELECT
    s.rank,
    u.id AS user_id,
    p.display_name,
    p.avatar_url,
    s.total_points AS weekly_score,
    st.current_streak
FROM scores s
JOIN users u ON u.id = s.user_id
JOIN profiles p ON p.user_id = u.id
LEFT JOIN streaks st ON st.user_id = u.id
WHERE s.week_start_date = date_trunc('week', CURRENT_DATE)::date
ORDER BY s.total_points DESC;
