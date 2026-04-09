"use client"

import { FormEvent, useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function FindTicketsPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sentTo, setSentTo] = useState("")
  const [isSending, setIsSending] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  useEffect(() => {
    if (typeof window === "undefined") return
    const url = new URL(window.location.href)
    const prefillEmail = (url.searchParams.get("email") || "").trim().toLowerCase()
    if (prefillEmail) {
      setEmail(prefillEmail)
    }
  }, [])

  const sendMagicLink = async (targetEmail: string) => {
    const supabase = createClient()
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: targetEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/my-tickets`,
      },
    })
    return otpError
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    if (!emailRegex.test(normalizedEmail)) {
      setError("Please enter a valid email address.")
      return
    }

    setIsSending(true)
    setError("")
    const otpError = await sendMagicLink(normalizedEmail)
    setIsSending(false)

    if (otpError) {
      setError(otpError.message || "We could not send the link. Please try again.")
      return
    }

    setSentTo(normalizedEmail)
  }

  const resend = async () => {
    if (!sentTo) return
    setIsSending(true)
    setError("")
    const otpError = await sendMagicLink(sentTo)
    setIsSending(false)
    if (otpError) {
      setError(otpError.message || "We could not resend the link. Please try again.")
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-6">
          <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              My Tickets
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Enter your email to find your tickets
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              We will send a secure link to your email. No password needed.
            </p>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <label htmlFor="email" className="block text-base font-medium text-card-foreground">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError("")
                }}
                placeholder="you@example.com"
                className="h-12 text-base"
              />
              <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={isSending}>
                {isSending ? "Sending secure link..." : "Continue"}
              </Button>
            </form>

            {sentTo ? (
              <div className="mt-5 rounded-md bg-accent/10 p-4">
                <p className="text-sm font-medium text-foreground">
                  We sent you a secure link. Please check your email to view your tickets.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{sentTo}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 h-10 w-full sm:w-auto"
                  onClick={resend}
                  disabled={isSending}
                >
                  Resend link
                </Button>
              </div>
            ) : null}

            {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
