import { NextResponse } from "next/server"

export async function GET() {
  const posts = [
    {
      id: "post_1",
      author: {
        name: "Elena Rostova",
        handle: "@elena_dev",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      },
      title: "Completed 4-hour Deep Work Session on Next.js Server Actions!",
      category: "Productivity",
      content: "Finished refactoring our database queries into Supabase server functions. High efficiency day!",
      likes: 24,
      comments: 6,
      timeAgo: "2h ago",
      tags: ["DeepWork", "NextJS", "Supabase"],
    },
    {
      id: "post_2",
      author: {
        name: "Marcus Vance",
        handle: "@marcus_v",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      },
      title: "Learning Streak Day 21: System Architecture Basics",
      category: "Learning",
      content: "Documented cache invalidation patterns and rate-limiting strategies in distributed systems.",
      likes: 45,
      comments: 12,
      timeAgo: "5h ago",
      tags: ["SystemDesign", "LearningStreak", "Backend"],
    },
  ]

  return NextResponse.json({
    success: true,
    count: posts.length,
    posts,
  })
}
