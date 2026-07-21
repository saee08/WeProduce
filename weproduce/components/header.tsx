"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export function Header() {
  const pathname = usePathname()
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false)

  useEffect(() => {
    setSupabaseConnected(isSupabaseConfigured())
  }, [])

  const navItems = [
    { name: "Swagger Docs", href: "/" },
    { name: "/profile", href: "/profile" },
    { name: "/login", href: "/login" },
    { name: "/feed", href: "/feed" },
    { name: "/explore", href: "/explore" },
  ]

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-3 text-slate-800 font-mono text-xs shadow-xs">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-slate-900 hover:text-emerald-600 transition-colors flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
              v1.0.0
            </span>
            WeProduce
          </Link>
          <span className="text-slate-400 text-[11px] hidden md:inline">
            (Productivity & Learning Social App)
          </span>
        </div>

        {/* Navbar Dock Links */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1 rounded transition-colors text-xs ${
                  isActive
                    ? "bg-white text-emerald-700 font-bold border border-slate-300 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Supabase connection indicator */}
        <div className="text-[11px] flex items-center gap-1.5">
          <span className="text-slate-500">Supabase:</span>
          {supabaseConnected ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Connected
            </span>
          ) : (
            <span className="text-amber-700 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Mock Mode
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
