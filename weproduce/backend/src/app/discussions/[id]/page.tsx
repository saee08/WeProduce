"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { LogSolveModal } from "@/components/LogSolveModal";
import type { DiscussionCommentDTO } from "@/types/domain";

export default function DiscussionDetailPage() {
  const params = useParams();
  const postId = params.id as string;

  const [comments, setComments] = useState<DiscussionCommentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [logSolveOpen, setLogSolveOpen] = useState(false);

  const fetchComments = () => {
    fetch(`/api/discussions/${postId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setComments(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/discussions/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error?.message || "Failed to post comment");

      setCommentText("");
      fetchComments();
    } catch (err: any) {
      alert(err.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar onOpenLogSolve={() => setLogSolveOpen(true)} />

      <main className="container main-content">
        <Link href="/discussions" className="back-link">
          ← Back to Discussions
        </Link>

        {loading ? (
          <div className="glass-card loading-card">
            <div className="spinner"></div>
            <p>Loading thread discussion...</p>
          </div>
        ) : (
          <div className="thread-container">
            {/* Comments List */}
            <div className="comments-section">
              <h2 className="section-title">
                💬 Conversation ({comments.length})
              </h2>

              {comments.length === 0 ? (
                <div className="glass-card empty-card">
                  No replies on this post yet. Start the conversation below!
                </div>
              ) : (
                <div className="comments-list">
                  {comments.map((comment) => (
                    <div key={comment.id} className="glass-card comment-card">
                      <div className="author-row">
                        <div className="author-avatar">
                          {comment.author.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="author-info">
                          <span className="author-name">{comment.author.displayName}</span>
                          <span className="post-date">
                            {new Date(comment.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      <p className="comment-content">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reply Form Footer */}
            <div className="glass-card reply-card">
              <h3>Join the discussion</h3>
              <form onSubmit={handleSendComment} className="reply-form">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment or code snippet..."
                  rows={4}
                  className="reply-input"
                  required
                />
                <div className="reply-actions">
                  <button type="submit" disabled={submitting || !commentText.trim()} className="primary-btn">
                    {submitting ? "Sending..." : "Post Comment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <LogSolveModal
        isOpen={logSolveOpen}
        onClose={() => setLogSolveOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}
