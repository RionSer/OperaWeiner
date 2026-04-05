import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { CheckCircle, Ticket, Calendar, MapPin, Clock, Download } from "lucide-react"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { getConcertById } from "@/lib/concerts"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; booking_ref?: string }>
}) {
  const { session_id, booking_ref } = await searchParams

  if (!session_id || !booking_ref) {
    redirect("/")
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Verify the Stripe session
  let session
  try {
    session = await stripe.checkout.sessions.retrieve(session_id)
  } catch {
    notFound()
  }

  if (session.payment_status !== "paid") {
    redirect("/")
  }

  const piId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent &&
          typeof session.payment_intent === "object" &&
          "id" in session.payment_intent
        ? (session.payment_intent as { id: string }).id
        : null

  // Update booking status
  const { data: booking, error } = await supabase
    .from("bookings")
    .update({
      payment_status: "completed",
      ...(piId ? { stripe_payment_intent_id: piId } : {}),
    })
    .eq("booking_reference", booking_ref)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error || !booking) {
    notFound()
  }

  const concert = getConcertById(booking.concert_id)
  const dateObj = parseISO(booking.concert_date)

  return (
    <>
      <SiteHeader />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Booking Confirmed!
          </h1>
          <p className="mt-3 text-muted-foreground">
            Thank you for your purchase. Your tickets have been reserved.
          </p>

          {/* Booking Details Card */}
          <div className="mt-8 rounded-sm border border-border bg-card p-6 text-left">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Booking Reference
                </p>
                <p className="mt-1 font-mono text-lg font-bold text-accent">
                  {booking.booking_reference}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Ticket className="h-6 w-6 text-accent" />
              </div>
            </div>

            <div className="mt-4">
              <h2 className="font-serif text-xl font-bold text-card-foreground">
                {booking.concert_title}
              </h2>
              <p className="text-sm text-muted-foreground">{booking.concert_composer}</p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="text-card-foreground">{booking.concert_venue}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-accent" />
                <span className="text-card-foreground">{format(dateObj, "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-card-foreground">{booking.concert_time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Ticket className="h-4 w-4 text-accent" />
                <span className="text-card-foreground">
                  {booking.tickets} {booking.tickets === 1 ? "ticket" : "tickets"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-medium text-card-foreground">Total Paid</span>
              <span className="font-serif text-xl font-bold text-accent">
                {new Intl.NumberFormat("de-AT", {
                  style: "currency",
                  currency: "EUR",
                }).format(Number(booking.total_amount))}
              </span>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            A confirmation email has been sent to your email address with your ticket details.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/dashboard">
                <Ticket className="mr-2 h-4 w-4" />
                View My Tickets
              </Link>
            </Button>
            {concert && (
              <Button asChild variant="outline">
                <Link href={`/concerts/${concert.id}`}>
                  <Download className="mr-2 h-4 w-4" />
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
