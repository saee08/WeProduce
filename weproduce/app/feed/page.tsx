"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Post {
  id: string
  author: { name: string; handle: string }
  title: string
  category: string
  content: string
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) setPosts(data.posts)
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-mono p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <span className="text-[11px] text-slate-500 font-bold">ROUTE VIEW</span>
          <h1 className="text-lg font-bold text-emerald-700">/feed (weproduce/feed)</h1>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="font-mono text-xs bg-white">
            &larr; Docs
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs text-slate-500 uppercase tracking-wider font-bold">Community Output Feed</h2>
        {posts.map((post) => (
          <Card key={post.id} className="border-slate-200 bg-white shadow-xs">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800">
                  {post.author.name} <span className="text-slate-500 font-normal">{post.author.handle}</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300 bg-emerald-50">
                  {post.category}
                </Badge>
              </div>
              <CardTitle className="text-sm font-semibold text-slate-900 pt-1">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="py-2 text-xs text-slate-600">
              {post.content}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
