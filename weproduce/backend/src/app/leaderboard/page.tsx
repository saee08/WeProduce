"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { LogSolveModal } from "@/components/LogSolveModal";
import { MemberProfileModal } from "@/components/MemberProfileModal";
import type { LeaderboardEntryDTO } from "@/types/domain";

const PODIUM_ICONS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [logSolveOpen, setLogSolveOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const fetchLeaderboard = () => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLeaderboard(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="page-wrapper">
      <Navbar onOpenLogSolve={() => setLogSolveOpen(false)} />

      <main className="container main-content">
        <div className="header-section animate-fade-in">
          <div>
            <h1 className="page-title">Weekly Leaderboard</h1>
            <p className="page-subtitle">Unified points leaderboard · Resets every Monday</p>
          </div>
        </div>

        {loading ? (
          <div className="glass-card loading-card">
            <div className="spinner"></div>
            <p>Loading leaderboard rankings...</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {topThree.length > 0 && (
              <div className="podium-grid animate-fade-in">
                {topThree.map((entry) => (
                  <div
                    key={entry.userId}
                    className={`glass-card podium-card podium-rank-${entry.rank}`}
                    onClick={() => setSelectedMemberId(entry.userId)}
                  >
                    <span className="podium-medal">{PODIUM_ICONS[entry.rank] ?? "🏅"}</span>
                    <div className="podium-avatar">
                      {entry.displayName.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="podium-name">{entry.displayName}</h3>
                    <span className="podium-score">{entry.weeklyScore} PTS</span>
                    <span className="podium-streak">🔥 {entry.currentStreak}d streak</span>
                  </div>
                ))}
              </div>
            )}

            {/* Rankings Table */}
            <div className="glass-card table-card animate-fade-in">
              <h3>All Rankings</h3>
              <div className="table-responsive">
                <table className="rankings-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Member</th>
                      <th>Active Streak</th>
                      <th className="text-right">Weekly Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry) => (
                      <tr
                        key={entry.userId}
                        className="table-row clickable"
                        onClick={() => setSelectedMemberId(entry.userId)}
                      >
                        <td className="rank-col">
                          <span className={`rank-pill rank-${entry.rank}`}>
                            #{entry.rank}
                          </span>
                        </td>
                        <td className="member-col">
                          <div className="member-cell">
                            <div className="table-avatar">
                              {entry.displayName.charAt(0).toUpperCase()}
                            </div>
                            <span className="member-name">{entry.displayName}</span>
                          </div>
                        </td>
                        <td className="streak-col">
                          <span className="streak-badge">🔥 {entry.currentStreak} days</span>
                        </td>
                        <td className="score-col text-right">
                          <span className="score-badge">{entry.weeklyScore} PTS</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      <LogSolveModal
        isOpen={logSolveOpen}
        onClose={() => setLogSolveOpen(false)}
        onSuccess={fetchLeaderboard}
      />

      <MemberProfileModal
        userId={selectedMemberId}
        onClose={() => setSelectedMemberId(null)}
      />
    </div>
  );
}
