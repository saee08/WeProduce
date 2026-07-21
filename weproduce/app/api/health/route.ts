import { NextResponse } from "next/server"
import { isSupabaseConfigured } from "@/lib/supabase/client"

export async function GET() {
  const isConfigured = isSupabaseConfigured()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || null

  return NextResponse.json({
    status: "ok",
    app: "WeProduce API Core",
    timestamp: new Date().toISOString(),
    supabase: {
      isConfigured,
      urlConfigured: Boolean(supabaseUrl),
      targetUrl: supabaseUrl ? (supabaseUrl.includes("placeholder") ? "Placeholder setup" : "Valid URL configured") : "Missing NEXT_PUBLIC_SUPABASE_URL",
    },
    version: "1.0.0",
  })
}
