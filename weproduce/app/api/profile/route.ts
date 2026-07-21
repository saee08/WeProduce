import { NextResponse } from "next/server"
import { createClientServer } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClientServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // Mock data for demo boilerplate
      return NextResponse.json({
        success: true,
        isMockData: true,
        profile: {
          id: "usr_demo_101",
          username: "shrinivasanthevar",
          full_name: "Shrinivasan Thevar",
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          bio: "Building WeProduce 🚀 | Fullstack Engineer & Productivity Enthusiast",
          streak_days: 14,
          hours_learned: 128,
          posts_count: 32,
          skills: ["Next.js", "TypeScript", "Supabase", "Shadcn UI", "System Design"],
          created_at: new Date().toISOString(),
        },
      })
    }

    // Attempt to query Supabase profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (error) {
      return NextResponse.json({
        success: true,
        isMockData: true,
        user: user.email,
        profile: {
          id: user.id,
          username: user.email?.split("@")[0] || "producer",
          full_name: user.user_metadata?.full_name || "WeProduce Member",
          streak_days: 5,
          hours_learned: 42,
          skills: ["Learning", "Coding"],
        },
      })
    }

    return NextResponse.json({
      success: true,
      isMockData: false,
      profile,
    })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error"
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully (Demo API)",
      updatedFields: body,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request payload" }, { status: 400 })
  }
}
