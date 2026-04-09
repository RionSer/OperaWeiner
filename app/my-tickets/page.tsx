"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { format, isPast, parseISO } from "date-fns"
import { Calendar, Clock, MapPin, Music, Ticket } from "lucide-react"
import { useRouter } from "next/navigation"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

interface Booking {
  id: string
  concert_id: string
  concert_title: string
  concert_composer: string
  concert_venue: string
  concert_date: string
  concert_time: string
  tickets: number
  total_amount: number
  payment_status: string
  booking_reference: string
  created_at: string
}

export default function MyTicketsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    const loadTickets = async () => {
      const supabase = createClient()

      // Handle callback parameters from magic-link auth before session check.
      const url = new URL(window.location.href)
      const code = url.searchParams.get("code")
      const tokenHash = url.searchParams.get("token_hash")
      const type = url.searchParams.get("type") as EmailOtpType | null

      if (code) {
        await supabase.auth.exchangeCodeForSession(code)
      } else if (tokenHash && type) {
        await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user?.email) {
        router.replace("/find-tickets")
        return
      }

      const sessionEmail = session.user.email.toLowerCase()
      setEmail(sessionEmail)

      const { data, error: queryError } = await supabase
        .from("bookings")
        .select("*")
        .eq("email", sessionEmail)
        .eq("payment_status", "completed")
        .order("concert_date", { ascending: true })

      if (queryError) {
        setError("We could not load your tickets right now. Please try again.")
      } else {
        setBookings((data || []) as Booking[])
      }

      // Clean callback params from URL after successful session load.
      if (code || tokenHash) {
        router.replace("/my-tickets")
      }

      setIsLoading(false)
    }

    loadTickets()
  }, [router])

  const upcomingBookings = useMemo(
    () => bookings.filter((b) => !isPast(parseISO(b.concert_date))),
    [bookings]
  )
  const pastBookings = useMemo(
    () => bookings.filter((b) => isPast(parseISO(b.concert_date))),
    [bookings]
  )

  return (
    <>
      <SiteHeader />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">My Tickets</p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Your confirmed bookings
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Signed in as {email || "your email"}.
          </p>

          {isLoading ? (
            <div className="mt-8 rounded-sm border border-border bg-card p-8 text-center text-muted-foreground">
              Loading your tickets...
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="mt-8 rounded-sm border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          {!isLoading && !error ? (
            <>
              <section className="mt-10">
                <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
                  <Ticket className="h-5 w-5 text-accent" />
                  Upcoming Concerts
                </h2>
                {upcomingBookings.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="mt-6 space-y-4">
                    {upcomingBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </section>

              {pastBookings.length > 0 ? (
                <section className="mt-10">
                  <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    Past Concerts
                  </h2>
                  <div className="mt-6 space-y-4 opacity-75">
                    {pastBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

function EmptyState() {
  return (
    <div className="mt-6 rounded-sm border border-dashed border-border bg-card p-10 text-center">
      <Music className="mx-auto h-10 w-10 text-muted-foreground/50" />
      <h3 className="mt-4 font-serif text-lg font-medium text-card-foreground">No tickets yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Once payment is complete, your tickets will appear here.
      </p>
      <Button asChild className="mt-6">
        <Link href="/concerts">Browse Concerts</Link>
      </Button>
    </div>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="rounded-sm border border-border bg-card p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h3 className="font-serif text-lg font-bold text-card-foreground">{booking.concert_title}</h3>
          <p className="text-sm text-muted-foreground">{booking.concert_composer}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {booking.concert_venue}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(parseISO(booking.concert_date), "MMMM d, yyyy")}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {booking.concert_time}
            </div>
          </div>
        </div>

        <div className="text-sm sm:text-right">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Booking reference</p>
          <p className="mt-1 font-mono font-bold text-accent">{booking.booking_reference}</p>
          <p className="mt-2 text-muted-foreground">
            {booking.tickets} {booking.tickets === 1 ? "ticket" : "tickets"}
          </p>
        </div>
      </div>
    </div>
  )
}
