import { NextResponse } from "next/server"
import { createClientServer } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClientServer()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json({
        authenticated: false,
        message: "No active Supabase session found. Standard authentication endpoint operational.",
        demoMode: true,
        supportedMethods: ["email_password", "oauth_github", "oauth_google", "magic_link"],
      })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
      },
    })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Auth check failed"
    return NextResponse.json({ authenticated: false, error: errorMessage }, { status: 500 })
  }
}
