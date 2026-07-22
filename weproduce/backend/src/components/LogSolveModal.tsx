"use client";

import React, { useState } from "react";

interface LogSolveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LogSolveModal: React.FC<LogSolveModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [platform, setPlatform] = useState<"hackerrank" | "leetcode">("hackerrank");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [problemUrl, setProblemUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter problem title");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch("/api/activities/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          title: title.trim(),
          difficulty,
          problemUrl: problemUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to log solve activity");
      }

      setTitle("");
      setProblemUrl("");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Log Solve Manually</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <p className="modal-sub">
          Record HackerRank or extra practice solves to instantly update your weekly score & streak.
        </p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Platform */}
          <div className="form-group">
            <label>Platform</label>
            <div className="button-group">
              {(["hackerrank", "leetcode"] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  className={`chip-btn ${platform === p ? "active" : ""}`}
                  onClick={() => setPlatform(p)}
                >
                  {p === "hackerrank" ? "HackerRank" : "LeetCode"}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label>Problem Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Simple Array Sum"
              className="form-input"
              required
            />
          </div>

          {/* Difficulty */}
          <div className="form-group">
            <label>Difficulty</label>
            <div className="button-group">
              {(["easy", "medium", "hard"] as const).map((d) => (
                <button
                  type="button"
                  key={d}
                  className={`chip-btn ${difficulty === d ? "active" : ""}`}
                  onClick={() => setDifficulty(d)}
                >
                  {d.toUpperCase()} ({d === "easy" ? "+10" : d === "medium" ? "+25" : "+50"} pts)
                </button>
              ))}
            </div>
          </div>

          {/* Optional URL */}
          <div className="form-group">
            <label>Problem Link (Optional)</label>
            <input
              type="url"
              value={problemUrl}
              onChange={(e) => setProblemUrl(e.target.value)}
              placeholder="https://hackerrank.com/challenges/..."
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="secondary-btn">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="primary-btn">
              {submitting ? "Submitting..." : "Submit Solve"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
