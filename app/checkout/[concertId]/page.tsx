import { redirect, notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { getConcertById } from "@/lib/concerts"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Checkout } from "@/components/checkout"

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ concertId: string }>
  searchParams: Promise<{ tickets?: string }>
}) {
  const { concertId } = await params
  const { tickets: ticketsParam } = await searchParams
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/checkout/${concertId}?tickets=${ticketsParam || 1}`)
  }

  const concert = getConcertById(concertId)
  if (!concert) {
    notFound()
  }

  const tickets = Math.min(Math.max(1, parseInt(ticketsParam || "1") || 1), 10)
  const total = concert.price * tickets
  const dateObj = parseISO(concert.date)

  return (
    <>
      <SiteHeader />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href={`/concerts/${concert.id}/book`}
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Booking
          </Link>

          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Secure Checkout
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
              Complete Your Purchase
            </h1>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-5">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-sm border border-border bg-card p-6">
                <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Order Summary
                </h2>
                
                <div className="mt-4 border-b border-border pb-4">
                  <h3 className="font-serif text-lg font-bold text-card-foreground">
                    {concert.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{concert.composer}</p>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Venue</span>
                    <span className="text-card-foreground">{concert.venue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="text-card-foreground">{format(dateObj, "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="text-card-foreground">{concert.time}</span>
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {tickets} {tickets === 1 ? "ticket" : "tickets"} x{" "}
                      {new Intl.NumberFormat("de-AT", {
                        style: "currency",
                        currency: "EUR",
                      }).format(concert.price)}
                    </span>
                    <span className="text-card-foreground">
                      {new Intl.NumberFormat("de-AT", {
                        style: "currency",
                        currency: "EUR",
                      }).format(total)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-4 flex justify-between">
                  <span className="font-medium text-card-foreground">Total</span>
                  <span className="font-serif text-xl font-bold text-accent">
                    {new Intl.NumberFormat("de-AT", {
                      style: "currency",
                      currency: "EUR",
                    }).format(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stripe Checkout */}
            <div className="lg:col-span-3">
              <Checkout concertId={concertId} tickets={tickets} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
