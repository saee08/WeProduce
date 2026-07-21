"use client"

import { useState } from "react"
import { Play, CheckCircle2, AlertCircle, RefreshCw, Terminal, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ApiTester() {
  const [selectedRoute, setSelectedRoute] = useState<string>("/api/profile")
  const [response, setResponse] = useState<unknown>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<number | null>(null)

  const routes = [
    { path: "/api/profile", method: "GET", description: "Fetch logged-in user profile & productivity stats" },
    { path: "/api/auth", method: "GET", description: "Verify active Supabase auth session status" },
    { path: "/api/posts", method: "GET", description: "Fetch community productivity & learning feed" },
    { path: "/api/health", method: "GET", description: "System health check & Supabase connection state" },
  ]

  const testApi = async (path: string) => {
    setSelectedRoute(path)
    setLoading(true)
    setResponse(null)
    setStatus(null)

    try {
      const res = await fetch(path)
      setStatus(res.status)
      const data = await res.json()
      setResponse(data)
    } catch (err: unknown) {
      setStatus(500)
      setResponse({ error: err instanceof Error ? err.message : "API Call failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/80 bg-gradient-to-b from-card to-muted/20 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Terminal className="h-5 w-5 text-emerald-400" /> Live API Endpoint Playground
            </CardTitle>
            <CardDescription className="text-sm">
              Click any API route to execute a real live fetch request and inspect JSON payload responses.
            </CardDescription>
          </div>
          <Badge variant="outline" className="w-fit font-mono text-emerald-400 border-emerald-500/30">
            Next.js Route Handlers
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Route selector grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {routes.map((route) => (
            <button
              key={route.path}
              onClick={() => testApi(route.path)}
              className={`p-3 rounded-lg border text-left transition-all flex items-start justify-between gap-2 ${
                selectedRoute === route.path
                  ? "border-emerald-500 bg-emerald-500/10 shadow-xs"
                  : "border-border/60 hover:border-border bg-card/50"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono">
                    {route.method}
                  </Badge>
                  <span className="font-mono text-xs font-semibold text-foreground">{route.path}</span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1">{route.description}</p>
              </div>
              <Play className={`h-4 w-4 shrink-0 mt-1 ${selectedRoute === route.path ? "text-emerald-400 fill-emerald-400" : "text-muted-foreground"}`} />
            </button>
          ))}
        </div>

        {/* Live response window */}
        <div className="rounded-xl border border-border/80 bg-zinc-950 p-4 font-mono text-xs overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-zinc-400">Endpoint Response:</span>
              <span className="text-emerald-400 font-bold">{selectedRoute}</span>
            </div>
            {status !== null && (
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  status === 200 ? "border-emerald-500/50 text-emerald-400" : "border-destructive text-destructive"
                }`}
              >
                HTTP {status}
              </Badge>
            )}
          </div>

          <div className="min-h-[160px] max-h-[260px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-zinc-500 gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" /> Fetching live endpoint...
              </div>
            ) : response ? (
              <pre className="text-emerald-300 leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(response, null, 2)}
              </pre>
            ) : (
              <div className="text-zinc-600 py-12 text-center">
                Select an API route above or click test to invoke endpoint.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
