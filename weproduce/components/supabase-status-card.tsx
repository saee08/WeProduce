"use client"

import { useEffect, useState } from "react"
import { Database, CheckCircle2, ShieldCheck, Key, Copy, Terminal, ExternalLink, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { isSupabaseConfigured } from "@/lib/supabase/client"

export function SupabaseStatusCard() {
  const [configured, setConfigured] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  useEffect(() => {
    setConfigured(isSupabaseConfigured())
  }, [])

  const envSnippet = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`

  const handleCopy = () => {
    navigator.clipboard.writeText(envSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-border/80 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Supabase Integration Setup</CardTitle>
              <CardDescription className="text-xs">
                Backend database & Auth configuration status
              </CardDescription>
            </div>
          </div>
          {configured ? (
            <Badge className="bg-emerald-500 text-black font-semibold gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10 gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" /> Mock Fallback Active
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-xs">
        <div className="p-3 rounded-lg bg-muted/40 border border-border/60 leading-relaxed text-muted-foreground">
          {configured ? (
            <p className="text-emerald-400 font-medium">
              ✓ Supabase environment variables detected! Client & Server utilities in <code className="text-foreground bg-muted px-1.5 py-0.5 rounded font-mono">lib/supabase/</code> are fully initialized.
            </p>
          ) : (
            <p>
              Supabase SDK is installed (`@supabase/supabase-js` & `@supabase/ssr`). App currently uses high-fidelity mock fallback data until you set your project credentials in <code className="text-foreground bg-muted px-1.5 py-0.5 rounded font-mono">.env.local</code>.
            </p>
          )}
        </div>

        {/* Environment setup instructions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-emerald-400" /> Environment Variables (.env.local)
            </span>
            <Button variant="ghost" size="xs" onClick={handleCopy} className="gap-1 text-[11px] h-6">
              <Copy className="h-3 w-3" /> {copied ? "Copied!" : "Copy Template"}
            </Button>
          </div>
          <pre className="p-3 rounded-lg bg-zinc-950 text-emerald-300 font-mono text-[11px] overflow-x-auto border border-zinc-800">
            {envSnippet}
          </pre>
        </div>

        {/* Quick architecture highlights */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-lg border border-border/50 bg-card flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold text-foreground">Row Level Security</div>
              <div className="text-[10px] text-muted-foreground">Data isolated per user ID</div>
            </div>
          </div>
          <div className="p-2.5 rounded-lg border border-border/50 bg-card flex items-center gap-2">
            <Terminal className="h-4 w-4 text-teal-400 shrink-0" />
            <div>
              <div className="font-semibold text-foreground">SSR Cookie Sync</div>
              <div className="text-[10px] text-muted-foreground">App Router Server Actions ready</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
