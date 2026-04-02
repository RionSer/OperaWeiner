import { notFound } from "next/navigation"
import { format, parseISO } from "date-fns"
import { ArrowLeft, MapPin, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { getConcertById, concerts } from "@/lib/concerts"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingForm } from "@/components/booking-form"

export function generateStaticParams() {
  return concerts.map((concert) => ({
    id: concert.id,
  }))
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const concert = getConcertById(id)

  if (!concert) {
    notFound()
  }

  const dateObj = parseISO(concert.date)

  return (
    <>
      <SiteHeader />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href={`/concerts/${concert.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Concert
          </Link>

          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Checkout
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
              Book Tickets
            </h1>
          </div>

          {/* Concert Summary */}
          <div className="mt-8 rounded-sm border border-border bg-card p-6">
            <h2 className="font-serif text-xl font-bold text-card-foreground">
              {concert.title}
            </h2>
            <p className="text-sm text-muted-foreground">{concert.composer}</p>

            <div className="mt-4 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                {concert.venue}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-accent" />
                {format(dateObj, "MMMM d, yyyy")}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-accent" />
                {concert.time}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <BookingForm concert={concert} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
