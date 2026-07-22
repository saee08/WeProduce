"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { LogSolveModal } from "@/components/LogSolveModal";
import type { ActivityDTO } from "@/types/domain";

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityDTO[]>([]);
  const [commits, setCommits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [activeTab, setActiveTab] = useState<"timeline" | "commits">("timeline");
  const [logSolveOpen, setLogSolveOpen] = useState(false);

  const fetchActivities = () => {
    fetch("/api/activities?limit=50")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setActivities(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (activeTab === "commits" && commits.length === 0) {
      setLoadingCommits(true);
      fetch("/api/github/commits")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) setCommits(data.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingCommits(false));
    }
  }, [activeTab, commits.length]);

  return (
    <div className="page-wrapper">
      <Navbar onOpenLogSolve={() => setLogSolveOpen(true)} />

      <main className="container main-content">
        <div className="header-section animate-fade-in">
          <div>
            <h1 className="page-title">Activity Timeline</h1>
            <p className="page-subtitle">Tracked LeetCode, HackerRank solves, and GitHub pushes.</p>
          </div>

          <button onClick={() => setLogSolveOpen(true)} className="primary-btn">
            + Log Solve Manually
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="tab-container animate-fade-in">
          <button
            className={`tab-btn ${activeTab === "timeline" ? "active" : ""}`}
            onClick={() => setActiveTab("timeline")}
          >
            📈 All Activities Timeline
          </button>
          <button
            className={`tab-btn ${activeTab === "commits" ? "active" : ""}`}
            onClick={() => setActiveTab("commits")}
          >
            🐙 Detailed Commit History
          </button>
        </div>

        {activeTab === "timeline" ? (
          loading ? (
            <div className="glass-card loading-card">
              <div className="spinner"></div>
              <p>Loading activity stream...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="glass-card empty-card">
              🌱 No activities logged yet. Sync platforms or submit a manual solve!
            </div>
          ) : (
            <div className="timeline-grid animate-fade-in">
              {activities.map((act) => (
                <div key={act.id} className="glass-card timeline-item">
                  <div className="timeline-icon">
                    {act.platform === "leetcode"
                      ? "🧩"
                      : act.platform === "hackerrank"
                      ? "🎯"
                      : "🐙"}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title-row">
                      <h3 className="act-title">{act.title}</h3>
                      <span className="act-points">+{act.points} PTS</span>
                    </div>
                    <div className="act-meta">
                      <span className="platform-tag">{act.platform.toUpperCase()}</span>
                      <span className="diff-tag">{act.difficulty.toUpperCase()}</span>
                      <span>· {new Date(act.activityDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : loadingCommits ? (
          <div className="glass-card loading-card">
            <div className="spinner"></div>
            <p>Loading Git commit history...</p>
          </div>
        ) : commits.length === 0 ? (
          <div className="glass-card empty-card">
            🐙 No detailed commits cached yet. GitHub sync will populate your commit history automatically.
          </div>
        ) : (
          <div className="commits-grid animate-fade-in">
            {commits.map((commit, i) => (
              <div key={commit.sha || i} className="glass-card commit-card">
                <div className="commit-header">
                  <span className="repo-name">📦 {commit.repository || commit.repo || "Repository"}</span>
                  <span className="commit-sha">{commit.sha ? commit.sha.substring(0, 7) : "commit"}</span>
                </div>
                <p className="commit-msg">{commit.message || "Git commit push"}</p>
                <span className="commit-date">
                  {commit.date ? new Date(commit.date).toLocaleString() : "Recent"}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      <LogSolveModal
        isOpen={logSolveOpen}
        onClose={() => setLogSolveOpen(false)}
        onSuccess={fetchActivities}
      />
    </div>
  );
}
