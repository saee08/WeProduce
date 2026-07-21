"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [statusMsg, setStatusMsg] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured()) {
      setStatusMsg("Demo Mode: Supabase credentials not set in .env yet. Mock authentication successful.")
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setStatusMsg(`Error: ${error.message}`)
    } else {
      setStatusMsg("Success: Authenticated with Supabase!")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-mono p-4 sm:p-8 max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <span className="text-[11px] text-slate-500 font-bold">ROUTE VIEW</span>
          <h1 className="text-lg font-bold text-emerald-700">/login (weproduce/login)</h1>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="font-mono text-xs bg-white">
            &larr; Docs
          </Button>
        </Link>
      </div>

      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-slate-900">Supabase Auth</CardTitle>
            <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300 bg-emerald-50">
              Auth Endpoint
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500 font-mono">
            Sign in to access productivity & learning feeds.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-xs">
          {statusMsg && (
            <div className="p-2.5 rounded bg-slate-100 border border-slate-300 text-emerald-800 text-xs">
              {statusMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-slate-600 text-[11px] block mb-1">Email</label>
              <Input
                type="email"
                placeholder="user@weproduce.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="text-slate-600 text-[11px] block mb-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-slate-300 text-xs"
              />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs">
              Authenticate via Supabase
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
