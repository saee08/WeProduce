"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { LogSolveModal } from "@/components/LogSolveModal";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const { mode, setMode } = useTheme();

  const [github, setGithub] = useState("");
  const [githubPat, setGithubPat] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [hackerrank, setHackerrank] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [logSolveOpen, setLogSolveOpen] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setGithub(data.data.github || "");
          setLeetcode(data.data.leetcode || "");
          setHackerrank(data.data.hackerrank || "");
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          github: github.trim() || undefined,
          leetcode: leetcode.trim() || undefined,
          hackerrank: hackerrank.trim() || undefined,
          githubPat: githubPat.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to update profile settings");
      }

      setGithubPat("");
      setMessage({ type: "success", text: "Settings and platform links saved successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar onOpenLogSolve={() => setLogSolveOpen(true)} />

      <main className="container main-content">
        <div className="header-section animate-fade-in">
          <div>
            <h1 className="page-title">Settings & Preferences</h1>
            <p className="page-subtitle">Configure theme appearance and platform integrations.</p>
          </div>
        </div>

        <div className="settings-grid animate-fade-in">
          {/* Appearance Card */}
          <div className="glass-card settings-card">
            <h2>🎨 Appearance & Theme</h2>
            <p className="card-desc">Choose between dark mode, light mode, or system default.</p>

            <div className="theme-options">
              <button
                type="button"
                className={`theme-chip ${mode === "dark" ? "active" : ""}`}
                onClick={() => setMode("dark")}
              >
                <span>🌙 Dark Mode</span>
              </button>
              <button
                type="button"
                className={`theme-chip ${mode === "light" ? "active" : ""}`}
                onClick={() => setMode("light")}
              >
                <span>☀️ Light Mode</span>
              </button>
            </div>
          </div>

          {/* Platform Handles Card */}
          <div className="glass-card settings-card">
            <h2>🔗 Platform Accounts & Tokens</h2>
            <p className="card-desc">Connect your coding platform usernames for automated syncs.</p>

            {message && (
              <div className={`alert-box ${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="settings-form">
              <div className="form-group">
                <label>GitHub Username</label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="e.g. octocat"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>GitHub PAT (Personal Access Token)</label>
                <input
                  type="password"
                  value={githubPat}
                  onChange={(e) => setGithubPat(e.target.value)}
                  placeholder="ghp_... (Optional, for private commit sync)"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>LeetCode Username</label>
                <input
                  type="text"
                  value={leetcode}
                  onChange={(e) => setLeetcode(e.target.value)}
                  placeholder="e.g. tourist"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>HackerRank Username</label>
                <input
                  type="text"
                  value={hackerrank}
                  onChange={(e) => setHackerrank(e.target.value)}
                  placeholder="e.g. dev_pro"
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={saving} className="primary-btn">
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <LogSolveModal
        isOpen={logSolveOpen}
        onClose={() => setLogSolveOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}
