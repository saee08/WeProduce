"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { LogSolveModal } from "@/components/LogSolveModal";
import type { ProfileDTO, ActivityDTO } from "@/types/domain";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [activities, setActivities] = useState<ActivityDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [logSolveOpen, setLogSolveOpen] = useState(false);

  const fetchProfile = () => {
    Promise.all([
      fetch("/api/profile").then((res) => res.json()),
      fetch("/api/activities?limit=10").then((res) => res.json()),
    ])
      .then(([profData, actData]) => {
        if (profData.success) setProfile(profData.data);
        if (actData.success) setActivities(actData.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="page-wrapper">
      <Navbar onOpenLogSolve={() => setLogSolveOpen(true)} />

      <main className="container main-content">
        <div className="header-section animate-fade-in">
          <div>
            <h1 className="page-title">My Profile & Stats</h1>
            <p className="page-subtitle">Your active coding metrics, streaks, and platform accounts.</p>
          </div>
        </div>

        {loading ? (
          <div className="glass-card loading-card">
            <div className="spinner"></div>
            <p>Loading profile details...</p>
          </div>
        ) : (
          <div className="profile-grid animate-fade-in">
            {/* Main Profile Hero Card */}
            <div className="glass-card profile-main-card">
              <div className="profile-hero">
                <div className="avatar">
                  {(profile?.displayName || "M").charAt(0).toUpperCase()}
                </div>
                <h2 className="name">{profile?.displayName || "Cohort Developer"}</h2>
                <p className="bio">{profile?.bio || "WeProduce Cohort Member"}</p>
              </div>

              <div className="stats-row">
                <div className="stat-box">
                  <span className="stat-num">{profile?.weeklyScore ?? 0}</span>
                  <span className="stat-lbl">Weekly Score</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num orange">🔥 {profile?.currentStreak ?? 0}d</span>
                  <span className="stat-lbl">Current Streak</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num purple">⚡ {profile?.longestStreak ?? 0}d</span>
                  <span className="stat-lbl">Best Streak</span>
                </div>
              </div>

              <div className="linked-platforms">
                <h3>Linked Platforms</h3>
                <div className="platform-list">
                  <div className="platform-item">
                    <span>GitHub</span>
                    <span className="handle">{profile?.github ? `@${profile.github}` : "Not linked"}</span>
                  </div>
                  <div className="platform-item">
                    <span>LeetCode</span>
                    <span className="handle">{profile?.leetcode ? `@${profile.leetcode}` : "Not linked"}</span>
                  </div>
                  <div className="platform-item">
                    <span>HackerRank</span>
                    <span className="handle">{profile?.hackerrank ? `@${profile.hackerrank}` : "Not linked"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Recent Activity */}
            <div className="glass-card history-card">
              <h3>Recent Personal Activity</h3>
              {activities.length === 0 ? (
                <div className="empty-state">No recent activity history.</div>
              ) : (
                <div className="history-list">
                  {activities.map((act) => (
                    <div key={act.id} className="history-item">
                      <div className="act-info">
                        <span className="act-title">{act.title}</span>
                        <span className="act-date">
                          {act.platform.toUpperCase()} · {new Date(act.activityDate).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="act-pts">+{act.points} pts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <LogSolveModal
        isOpen={logSolveOpen}
        onClose={() => setLogSolveOpen(false)}
        onSuccess={fetchProfile}
      />
    </div>
  );
}
