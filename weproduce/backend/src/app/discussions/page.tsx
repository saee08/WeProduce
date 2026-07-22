"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { LogSolveModal } from "@/components/LogSolveModal";
import { NewPostModal } from "@/components/NewPostModal";
import type { DiscussionPostDTO } from "@/types/domain";

export default function DiscussionsPage() {
  const [posts, setPosts] = useState<DiscussionPostDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [logSolveOpen, setLogSolveOpen] = useState(false);
  const [newPostOpen, setNewPostOpen] = useState(false);

  const fetchPosts = () => {
    fetch("/api/discussions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <Navbar onOpenLogSolve={() => setLogSolveOpen(true)} />

      <main className="container main-content">
        <div className="header-section animate-fade-in">
          <div>
            <h1 className="page-title">Cohort Discussions</h1>
            <p className="page-subtitle">
              Ask questions, discuss algorithm strategies, and share practice insights.
            </p>
          </div>

          <button onClick={() => setNewPostOpen(true)} className="primary-btn">
            + New Post
          </button>
        </div>

        {/* Filter Bar */}
        <div className="search-bar-row animate-fade-in">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search topics, content, or author..."
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="glass-card loading-card">
            <div className="spinner"></div>
            <p>Loading discussions...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="glass-card empty-card animate-fade-in">
            <span className="empty-icon">💬</span>
            <h3>No discussions found</h3>
            <p>Be the first to start a discussion thread with your cohort!</p>
            <button onClick={() => setNewPostOpen(true)} className="primary-btn" style={{ marginTop: 12 }}>
              Start Discussion
            </button>
          </div>
        ) : (
          <div className="posts-grid animate-fade-in">
            {filteredPosts.map((post) => (
              <Link href={`/discussions/${post.id}`} key={post.id} className="glass-card post-card">
                <div className="author-row">
                  <div className="author-avatar">
                    {post.author.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="author-info">
                    <span className="author-name">{post.author.displayName}</span>
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">{post.content}</p>

                <div className="post-footer">
                  <span className="comment-badge">
                    💬 {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}
                  </span>
                  <span className="read-more">View Thread →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <LogSolveModal
        isOpen={logSolveOpen}
        onClose={() => setLogSolveOpen(false)}
        onSuccess={() => {}}
      />

      <NewPostModal
        isOpen={newPostOpen}
        onClose={() => setNewPostOpen(false)}
        onSuccess={fetchPosts}
      />
    </div>
  );
}
