"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProfileData {
  id: string
  username: string
  full_name: string
  bio: string
  streak_days: number
  hours_learned: number
  skills: string[]
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) setProfile(data.profile)
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-mono p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Route Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <span className="text-[11px] text-slate-500 font-bold">ROUTE VIEW</span>
          <h1 className="text-lg font-bold text-emerald-700">/profile (weproduce/profile)</h1>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="font-mono text-xs bg-white">
            &larr; Back to Swagger Docs
          </Button>
        </Link>
      </div>

      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-slate-900">
              {profile?.full_name || "Shrinivasan Thevar"}
            </CardTitle>
            <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-300 bg-emerald-50">
              {profile?.streak_days || 14} Day Streak
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500 font-mono">
            @{profile?.username || "shrinivasanthevar"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-xs">
          <p className="text-slate-700">
            {profile?.bio || "Building WeProduce — Productivity & Learning Social App."}
          </p>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-100 rounded border border-slate-200">
            <div>
              <div className="text-slate-500">Learning Hours</div>
              <div className="text-base font-bold text-slate-900">{profile?.hours_learned || 128} hrs</div>
            </div>
            <div>
              <div className="text-slate-500">Productivity Streak</div>
              <div className="text-base font-bold text-emerald-700">{profile?.streak_days || 14} days</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-slate-500">Skills Tracked:</div>
            <div className="flex flex-wrap gap-1.5">
              {(profile?.skills || ["Next.js", "TypeScript", "Supabase", "Shadcn"]).map((s) => (
                <Badge key={s} variant="secondary" className="text-xs bg-slate-200 text-slate-800 border border-slate-300">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
