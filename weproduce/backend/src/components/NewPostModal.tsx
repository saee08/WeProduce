"use client";

import React, { useState } from "react";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewPostModal: React.FC<NewPostModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please provide both title and content");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to create discussion post");
      }

      setTitle("");
      setContent("");
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
          <h2>New Discussion Post</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <p className="modal-sub">
          Start a thread with your cohort members to ask questions or share solutions.
        </p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Approach for Dynamic Programming optimization"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Content & Code Snippets</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share details, thoughts, or code snippets..."
              rows={6}
              className="form-input text-area"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="secondary-btn">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="primary-btn">
              {submitting ? "Posting..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
