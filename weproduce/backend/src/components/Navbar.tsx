"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

interface NavbarProps {
  onOpenLogSolve?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogSolve }) => {
  const pathname = usePathname();
  const { mode, toggleTheme } = useTheme();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    try {
      setSyncing(true);
      await fetch("/api/activities/sync", { method: "POST" });
      window.location.reload();
    } catch (err) {
      console.error("Sync failed", err);
    } finally {
      setSyncing(false);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/", icon: "🏠" },
    { label: "Leaderboard", href: "/leaderboard", icon: "🏆" },
    { label: "Discussions", href: "/discussions", icon: "💬" },
    { label: "Activity", href: "/activity", icon: "📈" },
    { label: "Profile", href: "/profile", icon: "👤" },
    { label: "Settings", href: "/settings", icon: "⚙️" },
  ];

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand */}
        <Link href="/" className="brand-logo">
          <span className="brand-icon">🚀</span>
          <span className="brand-name">WeProduce</span>
        </Link>

        {/* Nav Links */}
        <nav className="nav-links">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {onOpenLogSolve && (
            <button onClick={onOpenLogSolve} className="primary-btn">
              <span>+ Log Solve</span>
            </button>
          )}

          <button onClick={handleSync} disabled={syncing} className="secondary-btn">
            <span>{syncing ? "Syncing..." : "🔄 Sync"}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          >
            <span>{mode === "dark" ? "🌙" : "☀️"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
