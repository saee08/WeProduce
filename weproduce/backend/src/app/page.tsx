"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { LogSolveModal } from "@/components/LogSolveModal";
import { MemberProfileModal } from "@/components/MemberProfileModal";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logSolveOpen, setLogSolveOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const fetchDashboard = () => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDashboard(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="page-wrapper">
      <Navbar onOpenLogSolve={() => setLogSolveOpen(true)} />

      <main className="container main-content">
        {/* Welcome Hero */}
        <section className="hero-section animate-fade-in">
          <div>
            <span className="welcome-tag">Cohort Dashboard</span>
            <h1 className="hero-title">Code Every Day. Compete Every Week. 👋</h1>
            <p className="hero-subtitle">
              Solves on LeetCode & HackerRank plus GitHub commits automatically rolled into one unified score.
            </p>
          </div>

          <div className="hero-actions">
            <button onClick={() => setLogSolveOpen(true)} className="primary-btn">
              ⚡ Log Solve Manually
            </button>
          </div>
        </section>

        {loading ? (
          <div className="glass-card loading-card animate-fade-in">
            <div className="spinner"></div>
            <p>Loading cohort metrics...</p>
          </div>
        ) : (
          <>
            {/* Top Grid: Unified Score & Streak Cards */}
            <div className="metrics-grid">
              {/* Unified Score Card */}
              <div className="glass-card metric-card score-card animate-fade-in">
                <div className="card-header">
                  <span>UNIFIED WEEKLY SCORE</span>
                  <span className="badge badge-purple">
                    Rank #{dashboard?.currentRank ?? 1}
                  </span>
                </div>
                <div className="score-display">
                  <span className="score-val">{dashboard?.weeklyScore ?? 0}</span>
                  <span className="score-unit">PTS</span>
                </div>
                <p className="score-sub">Resets every Monday (ISO week)</p>
              </div>

              {/* Streak Card */}
              <div className="glass-card metric-card streak-card animate-fade-in">
                <div className="card-header">
                  <span>ACTIVE STREAK</span>
                  <span className="badge badge-orange">🔥 Daily</span>
                </div>
                <div className="score-display">
                  <span className="score-val orange-text">
                    {dashboard?.currentStreak ?? 0}
                  </span>
                  <span className="score-unit">DAYS</span>
                </div>
                <p className="score-sub">
                  Best Streak: <strong>{dashboard?.longestStreak ?? 0} days</strong>
                </p>
              </div>
            </div>

            {/* Today's Breakdown Section */}
            <section className="section-block animate-fade-in">
              <h2 className="section-title">Today's Performance</h2>
              <div className="today-grid">
                <div className="glass-card today-card">
                  <span className="today-icon">🧩</span>
                  <div className="today-info">
                    <span className="today-val">{dashboard?.today?.leetcodeSolved ?? 0}</span>
                    <span className="today-lbl">LeetCode Solves</span>
                  </div>
                </div>

                <div className="glass-card today-card">
                  <span className="today-icon">🎯</span>
                  <div className="today-info">
                    <span className="today-val">{dashboard?.today?.hackerrankSolved ?? 0}</span>
                    <span className="today-lbl">HackerRank Solves</span>
                  </div>
                </div>

                <div className="glass-card today-card">
                  <span className="today-icon">🐙</span>
                  <div className="today-info">
                    <span className="today-val">{dashboard?.today?.githubCommits ?? 0}</span>
                    <span className="today-lbl">GitHub Commits</span>
                  </div>
                </div>

                <div className="glass-card today-card highlight-card">
                  <span className="today-icon">⚡</span>
                  <div className="today-info">
                    <span className="today-val">{dashboard?.today?.pointsEarnedToday ?? 0}</span>
                    <span className="today-lbl">Points Earned Today</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Leaderboard Preview & Recent Activity */}
            <div className="two-column-layout">
              {/* Leaderboard Preview */}
              <div className="glass-card col-card animate-fade-in">
                <div className="col-header">
                  <h3>🏆 Leaderboard Preview</h3>
                  <a href="/leaderboard" className="view-all-link">View Full Board →</a>
                </div>

                {dashboard?.leaderboardPreview?.length === 0 ? (
                  <div className="empty-state">No scores logged yet this week.</div>
                ) : (
                  <div className="leaderboard-list">
                    {dashboard?.leaderboardPreview?.map((entry: any) => (
                      <div
                        key={entry.userId}
                        className="leaderboard-row clickable"
                        onClick={() => setSelectedMemberId(entry.userId)}
                      >
                        <div className="rank-badge">#{entry.rank}</div>
                        <div className="user-avatar">
                          {entry.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                          <span className="user-name">{entry.displayName}</span>
                          <span className="user-streak">🔥 {entry.currentStreak}d streak</span>
                        </div>
                        <div className="user-score">{entry.weeklyScore} pts</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="glass-card col-card animate-fade-in">
                <div className="col-header">
                  <h3>📈 Recent Activity</h3>
                  <a href="/activity" className="view-all-link">Timeline →</a>
                </div>

                {dashboard?.recentActivity?.length === 0 ? (
                  <div className="empty-state">No recent activities logged yet.</div>
                ) : (
                  <div className="activity-list">
                    {dashboard?.recentActivity?.map((act: any) => (
                      <div key={act.id} className="activity-item">
                        <div className="act-icon">
                          {act.platform === "leetcode"
                            ? "🧩"
                            : act.platform === "hackerrank"
                            ? "🎯"
                            : "🐙"}
                        </div>
                        <div className="act-details">
                          <span className="act-title">{act.title}</span>
                          <span className="act-meta">
                            {act.platform.toUpperCase()} · {act.difficulty.toUpperCase()} ·{" "}
                            {new Date(act.activityDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="act-points">+{act.points} pts</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <LogSolveModal
        isOpen={logSolveOpen}
        onClose={() => setLogSolveOpen(false)}
        onSuccess={fetchDashboard}
      />

      <MemberProfileModal
        userId={selectedMemberId}
        onClose={() => setSelectedMemberId(null)}
      />
    </div>
  );
}
