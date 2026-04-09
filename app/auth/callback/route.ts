import { type EmailOtpType } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const token_hash = requestUrl.searchParams.get("token_hash")
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null
  const next = requestUrl.searchParams.get("next") || "/dashboard"

  const supabase = await createClient()

  // PKCE flow
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Magic link flow using token hash
  if (token_hash && type) {
    await supabase.auth.verifyOtp({ type, token_hash })
  }

  const redirectUrl = new URL(next, requestUrl.origin)
  return NextResponse.redirect(redirectUrl)
}
