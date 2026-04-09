import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { ArrowLeft, Ticket, Calendar, MapPin, Clock, Music, QrCode } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/admin"
import { getConcertById } from "@/lib/concerts"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { PrintButton } from "@/components/print-button"

export default async function TicketDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ ref: string }>
  searchParams: Promise<{ email?: string }>
}) {
  const { ref } = await params
  const { email: emailParam } = await searchParams
  const email = (emailParam || "").trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    redirect("/dashboard")
  }

  const supabase = createAdminClient()

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_reference", ref)
    .eq("email", email)
    .single()

  if (error || !booking) {
    notFound()
  }

  const concert = getConcertById(booking.concert_id)
  const dateObj = parseISO(booking.concert_date)
  const bookingDate = parseISO(booking.created_at)
  const bookingDateFormatted = format(bookingDate, "MMM d, yyyy")

  const fullName = "Guest"

  return (
    <>
      <SiteHeader />
      <main className="w-full min-w-0 overflow-x-hidden pt-24 pb-16">
        <div className="mx-auto w-full min-w-0 max-w-2xl px-4 sm:px-6">
          <Link
            href={`/dashboard?email=${encodeURIComponent(email)}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to My Tickets
          </Link>

          {/* Ticket Card */}
          <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card" id="printable-ticket">
            {/* Ticket Header */}
            <div className="bg-primary px-4 py-4 sm:px-6">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2 text-primary-foreground">
                  <Music className="h-5 w-5 shrink-0" />
                  <span className="truncate font-serif text-base font-bold sm:text-lg">
                    Wiener Oper
                  </span>
                </div>
                <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-primary-foreground/80">
                  E-Ticket
                </span>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="min-w-0 p-4 sm:p-6">
              <div className="text-center">
                <h1 className="break-words px-1 font-serif text-2xl font-bold text-card-foreground">
                  {booking.concert_title}
                </h1>
                <p className="mt-1 text-muted-foreground">{booking.concert_composer}</p>
                <p className="mt-3 text-sm font-medium text-muted-foreground">Purchased by {fullName}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-sm bg-secondary p-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Venue
                    </p>
                    <p className="mt-1 font-medium text-card-foreground">
                      {booking.concert_venue}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-sm bg-secondary p-4">
                  <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Date
                    </p>
                    <p className="mt-1 font-medium text-card-foreground">
                      {format(dateObj, "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-sm bg-secondary p-4">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Time
                    </p>
                    <p className="mt-1 font-medium text-card-foreground">
                      {booking.concert_time}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-sm bg-secondary p-4">
                  <Ticket className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Tickets
                    </p>
                    <p className="mt-1 font-medium text-card-foreground">
                      {booking.tickets} {booking.tickets === 1 ? "ticket" : "tickets"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dashed Separator */}
              <div className="my-6 border-t-2 border-dashed border-border" />

              {/* QR Code Placeholder & Reference */}
              <div className="flex min-w-0 flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-start">
                <div className="flex w-full min-w-0 items-center gap-4 sm:w-auto">
                  <div className="flex h-24 w-24 items-center justify-center rounded-sm border border-border bg-secondary">
                    <QrCode className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Booking Reference
                    </p>
                    <p className="mt-1 break-all font-mono text-lg font-bold text-accent sm:text-xl">
                      {booking.booking_reference}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Booked on {format(bookingDate, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Total Paid
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-card-foreground">
                    {new Intl.NumberFormat("de-AT", {
                      style: "currency",
                      currency: "EUR",
                    }).format(Number(booking.total_amount))}
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Footer */}
            <div className="border-t border-border bg-secondary px-6 py-4">
              <p className="text-center text-xs text-muted-foreground">
                Please present this ticket at the venue entrance. This ticket is non-transferable.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="no-print mt-6 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
            <div className="w-full min-w-0 sm:flex-1">
            <PrintButton
              concertTitle={booking.concert_title}
              concertComposer={booking.concert_composer}
              venue={booking.concert_venue}
              date={booking.concert_date}
              time={booking.concert_time}
              tickets={booking.tickets}
              bookingReference={booking.booking_reference}
              totalAmount={new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR" }).format(Number(booking.total_amount))}
              fullName={fullName}
              email={email}
              bookingDate={bookingDateFormatted}
            />
            </div>
            {concert && (
              <Button asChild variant="outline" className="w-full shrink-0 sm:w-auto sm:min-w-[12rem]">
                <Link href={`/concerts/${concert.id}`}>
                  View Concert Details
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
