"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ExplorePage() {
  const tracks = [
    { title: "Next.js 16 & Supabase Masterclass", level: "Intermediate", learners: 1420 },
    { title: "Deep Work & Daily Output System", level: "All Levels", learners: 2890 },
    { title: "System Design for High Scale Apps", level: "Advanced", learners: 950 },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-mono p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <span className="text-[11px] text-slate-500 font-bold">ROUTE VIEW</span>
          <h1 className="text-lg font-bold text-emerald-700">/explore (weproduce/explore)</h1>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="font-mono text-xs bg-white">
            &larr; Docs
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs text-slate-500 uppercase tracking-wider font-bold">Learning Tracks</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {tracks.map((t, i) => (
            <Card key={i} className="border-slate-200 bg-white shadow-xs">
              <CardHeader className="py-3">
                <Badge variant="outline" className="w-fit text-[10px] text-emerald-700 border-emerald-300 bg-emerald-50 mb-1">
                  {t.level}
                </Badge>
                <CardTitle className="text-xs font-bold text-slate-900">{t.title}</CardTitle>
                <CardDescription className="text-[11px] text-slate-500 font-mono">
                  {t.learners} producers active
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
