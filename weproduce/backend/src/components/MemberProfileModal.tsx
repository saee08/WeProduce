"use client";

import React, { useEffect, useState } from "react";
import type { ProfileDTO } from "@/types/domain";

interface MemberProfileModalProps {
  userId: string | null;
  onClose: () => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({ userId, onClose }) => {
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/profile?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfile(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Member Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {loading ? (
          <div className="loading-state">Loading profile details...</div>
        ) : profile ? (
          <div className="profile-container">
            {/* Header / Avatar */}
            <div className="profile-hero">
              <div className="avatar">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
              <h3 className="profile-name">{profile.displayName}</h3>
              <p className="profile-bio">{profile.bio || "WeProduce Cohort Member"}</p>
            </div>

            {/* Stats Row */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-val">{profile.weeklyScore}</span>
                <span className="stat-lbl">Weekly Score</span>
              </div>
              <div className="stat-card">
                <span className="stat-val orange">🔥 {profile.currentStreak}d</span>
                <span className="stat-lbl">Streak</span>
              </div>
              <div className="stat-card">
                <span className="stat-val purple">⚡ {profile.longestStreak}d</span>
                <span className="stat-lbl">Best Streak</span>
              </div>
            </div>

            {/* Linked Accounts */}
            <div className="accounts-list">
              <h4>Linked Platform Accounts</h4>
              <div className="account-row">
                <span>GitHub</span>
                <span className="acc-tag">{profile.github ? `@${profile.github}` : "Not linked"}</span>
              </div>
              <div className="account-row">
                <span>LeetCode</span>
                <span className="acc-tag">{profile.leetcode ? `@${profile.leetcode}` : "Not linked"}</span>
              </div>
              <div className="account-row">
                <span>HackerRank</span>
                <span className="acc-tag">{profile.hackerrank ? `@${profile.hackerrank}` : "Not linked"}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="loading-state">Profile unavailable</div>
        )}
      </div>
    </div>
  );
};
