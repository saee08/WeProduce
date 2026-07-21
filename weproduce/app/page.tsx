"use client"

import { useState } from "react"
import Link from "next/link"
import { isSupabaseConfigured } from "@/lib/supabase/client"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"all" | "pages" | "api">("all")
  const [apiOutputs, setApiOutputs] = useState<Record<string, { loading: boolean; status?: number; data?: unknown }>>({})
  const isConfigured = isSupabaseConfigured()

  const executeApiCall = async (path: string, method: string = "GET", body?: object) => {
    setApiOutputs((prev) => ({ ...prev, [path]: { loading: true } }))
    try {
      const res = await fetch(path, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })
      const data = await res.json()
      setApiOutputs((prev) => ({
        ...prev,
        [path]: { loading: false, status: res.status, data },
      }))
    } catch (err: unknown) {
      setApiOutputs((prev) => ({
        ...prev,
        [path]: { loading: false, status: 500, data: { error: err instanceof Error ? err.message : "Failed" } },
      }))
    }
  }

  const pageRoutes = [
    {
      path: "/profile",
      method: "GET",
      title: "User Profile Page",
      description: "User dashboard displaying learning streaks, deep work logs, and user stats.",
    },
    {
      path: "/login",
      method: "GET",
      title: "Authentication Page",
      description: "Sign-in and sign-up interface integrated with Supabase Auth.",
    },
    {
      path: "/feed",
      method: "GET",
      title: "Productivity & Learning Feed",
      description: "Community feed where creators post progress updates and learning milestones.",
    },
    {
      path: "/explore",
      method: "GET",
      title: "Explore Learning Tracks",
      description: "Structured habit tracks and skill learning modules.",
    },
  ]

  const apiRoutes = [
    {
      path: "/api/profile",
      method: "GET",
      title: "Get User Profile",
      description: "Returns profile information, streak count, and skills list.",
    },
    {
      path: "/api/profile",
      method: "POST",
      title: "Update User Profile",
      description: "Updates profile records in Supabase profiles table.",
      sampleBody: { full_name: "Shrinivasan", bio: "Building WeProduce" },
    },
    {
      path: "/api/auth",
      method: "GET",
      title: "Check Auth Session",
      description: "Validates current Supabase authentication cookie/session state.",
    },
    {
      path: "/api/posts",
      method: "GET",
      title: "Fetch Feed Posts",
      description: "Returns recent productivity posts and community updates.",
    },
    {
      path: "/api/health",
      method: "GET",
      title: "System & Supabase Health Check",
      description: "Returns API server health status and Supabase configuration status.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-mono p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Swagger Spec Header Box */}
      <div className="border border-slate-200 bg-white rounded-lg p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">WeProduce API Spec</h1>
              <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-300 px-1.5 py-0.5 rounded font-bold">
                OAS 3.0
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              A productivity & learning social media app connected to Supabase.
            </p>
          </div>
          <div className="text-right text-xs space-y-1">
            <div className="text-slate-600">
              Supabase Status:{" "}
              {isConfigured ? (
                <span className="text-emerald-700 font-bold">CONNECTED</span>
              ) : (
                <span className="text-amber-700 font-bold">MOCK MODE (.env.example)</span>
              )}
            </div>
            <div className="text-slate-400">Base URL: http://localhost:3000</div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Filter routes:</span>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-2.5 py-1 rounded border text-xs ${
              activeTab === "all"
                ? "bg-slate-900 border-slate-900 text-white font-bold"
                : "bg-white border-slate-300 text-slate-600 hover:bg-slate-100"
            }`}
          >
            All ({pageRoutes.length + apiRoutes.length})
          </button>
          <button
            onClick={() => setActiveTab("pages")}
            className={`px-2.5 py-1 rounded border text-xs ${
              activeTab === "pages"
                ? "bg-slate-900 border-slate-900 text-white font-bold"
                : "bg-white border-slate-300 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Pages ({pageRoutes.length})
          </button>
          <button
            onClick={() => setActiveTab("api")}
            className={`px-2.5 py-1 rounded border text-xs ${
              activeTab === "api"
                ? "bg-slate-900 border-slate-900 text-white font-bold"
                : "bg-white border-slate-300 text-slate-600 hover:bg-slate-100"
            }`}
          >
            API Endpoints ({apiRoutes.length})
          </button>
        </div>
      </div>

      {/* Page Routes Section */}
      {(activeTab === "all" || activeTab === "pages") && (
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            Frontend Page Routes
          </div>

          <div className="space-y-2.5">
            {pageRoutes.map((route) => (
              <div
                key={route.path}
                className="border border-emerald-200 bg-emerald-50/30 rounded-lg overflow-hidden text-xs shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2 bg-emerald-100/50 border-b border-emerald-200">
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                      GET
                    </span>
                    <span className="font-bold text-slate-900">{route.path}</span>
                    <span className="text-slate-600 hidden sm:inline">— {route.title}</span>
                  </div>
                  <Link href={route.path}>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded transition-colors text-xs">
                      Open Page &rarr;
                    </button>
                  </Link>
                </div>
                <div className="p-3 text-slate-600 text-xs">
                  {route.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Endpoints Section */}
      {(activeTab === "all" || activeTab === "api") && (
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            Backend API Routes
          </div>

          <div className="space-y-2.5">
            {apiRoutes.map((route, i) => {
              const key = `${route.method}-${route.path}-${i}`
              const output = apiOutputs[key]
              const isPost = route.method === "POST"

              return (
                <div
                  key={key}
                  className={`border rounded-lg overflow-hidden text-xs shadow-xs ${
                    isPost ? "border-blue-200 bg-blue-50/30" : "border-emerald-200 bg-emerald-50/30"
                  }`}
                >
                  <div
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2 border-b ${
                      isPost ? "bg-blue-100/50 border-blue-200" : "bg-emerald-100/50 border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] text-white ${
                          isPost ? "bg-blue-600" : "bg-emerald-600"
                        }`}
                      >
                        {route.method}
                      </span>
                      <span className="font-bold text-slate-900">{route.path}</span>
                      <span className="text-slate-600 hidden sm:inline">— {route.title}</span>
                    </div>

                    <button
                      onClick={() => executeApiCall(route.path, route.method, route.sampleBody)}
                      className={`font-bold px-3 py-1 rounded transition-colors text-xs text-white ${
                        isPost ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {output?.loading ? "Executing..." : "Try it out"}
                    </button>
                  </div>

                  <div className="p-3 space-y-2 text-slate-600 text-xs">
                    <div>{route.description}</div>

                    {/* Interactive Output Payload Box */}
                    {output && (
                      <div className="mt-2 border border-slate-800 bg-slate-950 text-slate-100 rounded p-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 border-b border-slate-800 pb-1">
                          <span>HTTP Status: {output.status}</span>
                          <span>Response: application/json</span>
                        </div>
                        {output.loading ? (
                          <div className="text-slate-400">Loading endpoint payload...</div>
                        ) : (
                          <pre className="text-emerald-400 text-[11px] overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(output.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Schemas Section */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Data Schemas (Models)
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="border border-slate-200 bg-white p-3 rounded space-y-1 shadow-xs">
            <div className="font-bold text-slate-900">Profile Schema</div>
            <pre className="text-[11px] text-slate-600 font-mono">
{`{
  id: string (UUID),
  username: string,
  full_name: string,
  streak_days: number,
  hours_learned: number,
  skills: string[]
}`}
            </pre>
          </div>
          <div className="border border-slate-200 bg-white p-3 rounded space-y-1 shadow-xs">
            <div className="font-bold text-slate-900">Post Schema</div>
            <pre className="text-[11px] text-slate-600 font-mono">
{`{
  id: string,
  author: { name: string, handle: string },
  title: string,
  category: "Productivity" | "Learning",
  likes: number
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
