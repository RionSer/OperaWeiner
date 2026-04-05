import { redirect } from "next/navigation"
import Link from "next/link"
import { format, parseISO, isPast } from "date-fns"
import { Ticket, Calendar, MapPin, Clock, Music } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
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

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .eq("payment_status", "completed")
    .order("concert_date", { ascending: true })

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Guest"

  const upcomingBookings = (bookings as Booking[] || []).filter(
    (b) => !isPast(parseISO(b.concert_date))
  )
  const pastBookings = (bookings as Booking[] || []).filter(
    (b) => isPast(parseISO(b.concert_date))
  )
  console.log(upcomingBookings)
  return (
    <>
      <SiteHeader />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              My Account
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Welcome back, {displayName}
            </h1>
            <p className="mt-2 text-muted-foreground">
              View and manage your opera concert tickets.
            </p>
          </div>

          {/* Upcoming Tickets */}
          <section className="mt-12">
            <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
              <Ticket className="h-5 w-5 text-accent" />
              Upcoming Concerts
            </h2>

            {upcomingBookings.length === 0 ? (
              <div className="mt-6 rounded-sm border border-dashed border-border bg-card p-12 text-center">
                <Music className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-serif text-lg font-medium text-card-foreground">
                  No upcoming concerts
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Browse our concert calendar and book your next opera experience.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/concerts">Browse Concerts</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </section>

          {/* Past Tickets */}
          {pastBookings.length > 0 && (
            <section className="mt-12">
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Past Concerts
              </h2>
              <div className="mt-6 space-y-4 opacity-75">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} isPast />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

function BookingCard({ booking, isPast = false }: { booking: Booking; isPast?: boolean }) {
  const dateObj = parseISO(booking.concert_date)

  return (
    <Link
      href={`/dashboard/ticket/${booking.booking_reference}`}
      className="block rounded-sm border border-border bg-card p-6 transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isPast ? "bg-muted" : "bg-accent/10"}`}>
              <Ticket className={`h-5 w-5 ${isPast ? "text-muted-foreground" : "text-accent"}`} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-card-foreground">
                {booking.concert_title}
              </h3>
              <p className="text-sm text-muted-foreground">{booking.concert_composer}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {booking.concert_venue}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(dateObj, "MMMM d, yyyy")}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {booking.concert_time}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${isPast ? "bg-muted text-muted-foreground" : "bg-green-100 text-green-700"}`}>
            {isPast ? "Attended" : "Confirmed"}
          </span>
          <span className="text-sm text-muted-foreground">
            {booking.tickets} {booking.tickets === 1 ? "ticket" : "tickets"}
          </span>
        </div>
      </div>
    </Link>
  )
}
