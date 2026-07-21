"use client"

import { Folder, FileCode, Layers } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SubItem {
  name: string
  type: string
  tag?: string
  path?: string
}

interface Item {
  name: string
  type: string
  tag?: string
  path?: string
  children?: SubItem[]
}

interface Group {
  name: string
  type: string
  description: string
  children: Item[]
}

export function FolderStructureView() {
  const structure: Group[] = [
    {
      name: "app/",
      type: "folder",
      description: "Next.js App Router Structure",
      children: [
        { name: "layout.tsx", type: "file", tag: "Root Layout + Header", path: "app/layout.tsx" },
        { name: "page.tsx", type: "file", tag: "Main Demo Overview", path: "app/page.tsx" },
        {
          name: "login/",
          type: "folder",
          children: [{ name: "page.tsx", type: "file", tag: "weproduce/login", path: "app/login/page.tsx" }],
        },
        {
          name: "profile/",
          type: "folder",
          children: [{ name: "page.tsx", type: "file", tag: "weproduce/profile", path: "app/profile/page.tsx" }],
        },
        {
          name: "feed/",
          type: "folder",
          children: [{ name: "page.tsx", type: "file", tag: "weproduce/feed", path: "app/feed/page.tsx" }],
        },
        {
          name: "explore/",
          type: "folder",
          children: [{ name: "page.tsx", type: "file", tag: "weproduce/explore", path: "app/explore/page.tsx" }],
        },
        {
          name: "api/",
          type: "folder",
          tag: "Backend API Handlers",
          children: [
            { name: "profile/route.ts", type: "file", tag: "GET/POST /api/profile", path: "app/api/profile/route.ts" },
            { name: "auth/route.ts", type: "file", tag: "GET /api/auth", path: "app/api/auth/route.ts" },
            { name: "posts/route.ts", type: "file", tag: "GET /api/posts", path: "app/api/posts/route.ts" },
            { name: "health/route.ts", type: "file", tag: "GET /api/health", path: "app/api/health/route.ts" },
          ],
        },
      ],
    },
    {
      name: "components/",
      type: "folder",
      description: "UI Components & Custom Blocks",
      children: [
        { name: "header.tsx", type: "file", tag: "Navbar Branding", path: "components/header.tsx" },
        { name: "api-tester.tsx", type: "file", tag: "Live API Playground", path: "components/api-tester.tsx" },
        { name: "supabase-status-card.tsx", type: "file", tag: "Database Status", path: "components/supabase-status-card.tsx" },
        {
          name: "ui/",
          type: "folder",
          tag: "Shadcn Components",
          children: [
            { name: "button.tsx", type: "file" },
            { name: "card.tsx", type: "file" },
            { name: "badge.tsx", type: "file" },
            { name: "input.tsx", type: "file" },
            { name: "avatar.tsx", type: "file" },
          ],
        },
      ],
    },
    {
      name: "lib/",
      type: "folder",
      description: "Utilities & Supabase SDK Integrations",
      children: [
        { name: "utils.ts", type: "file", tag: "cn Tailwind merge" },
        {
          name: "supabase/",
          type: "folder",
          tag: "Supabase Setup",
          children: [
            { name: "client.ts", type: "file", tag: "Browser Client" },
            { name: "server.ts", type: "file", tag: "App Router Server Client" },
          ],
        },
      ],
    },
  ]

  return (
    <Card className="border-border/80 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" /> Project Folder Architecture
          </CardTitle>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
            Shadcn + App Router
          </Badge>
        </div>
        <CardDescription className="text-sm">
          Complete codebase structure built for WeProduce (Productivity & Learning Social App).
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 font-mono text-xs">
        <div className="rounded-xl border border-border/80 bg-zinc-950 p-4 space-y-3 text-zinc-300">
          {structure.map((group) => (
            <div key={group.name} className="space-y-1">
              <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-zinc-800 pb-1">
                <span className="flex items-center gap-1.5">
                  <Folder className="h-4 w-4 fill-emerald-400/20 text-emerald-400" /> {group.name}
                </span>
                <span className="text-[10px] text-zinc-500 font-sans font-normal">{group.description}</span>
              </div>

              <div className="pl-4 space-y-1.5 pt-1">
                {group.children.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-zinc-200">
                      <span className="flex items-center gap-1.5">
                        {item.type === "folder" ? (
                          <Folder className="h-3.5 w-3.5 text-teal-400 fill-teal-400/20" />
                        ) : (
                          <FileCode className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                        <span className={item.type === "folder" ? "text-teal-300 font-semibold" : ""}>
                          {item.name}
                        </span>
                      </span>
                      {item.tag && (
                        <Badge
                          variant="secondary"
                          className="text-[9px] py-0 h-4 bg-zinc-900 border-zinc-800 text-emerald-400 font-mono"
                        >
                          {item.tag}
                        </Badge>
                      )}
                    </div>

                    {item.children && (
                      <div className="pl-5 border-l border-zinc-800 space-y-1 py-1">
                        {item.children.map((sub) => (
                          <div key={sub.name} className="flex items-center justify-between text-zinc-400 hover:text-zinc-200">
                            <span className="flex items-center gap-1.5">
                              <FileCode className="h-3 w-3 text-zinc-500" /> {sub.name}
                            </span>
                            {sub.tag && (
                              <span className="text-[10px] text-emerald-500 font-mono">{sub.tag}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
