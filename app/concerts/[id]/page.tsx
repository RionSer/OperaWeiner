import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { Calendar, Clock, MapPin, ArrowLeft, Users } from "lucide-react"
import { getConcertById, concerts } from "@/lib/concerts"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export function generateStaticParams() {
  return concerts.map((concert) => ({
    id: concert.id,
  }))
}

export default async function ConcertDetailPage({
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
      <main className="pt-20">
        {/* Hero */}
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <Image
            src={concert.image}
            alt={`${concert.title} by ${concert.composer}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-primary/70" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-12">
              <Link
                href="/concerts"
                className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Concerts
              </Link>
              <span className="mt-4 inline-block rounded-sm bg-accent px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-foreground">
                {concert.category}
              </span>
              <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl text-balance">
                {concert.title}
              </h1>
              <p className="mt-2 text-lg text-primary-foreground/80">
                {concert.composer}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                About This Performance
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {concert.longDescription}
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-4 rounded-sm border border-border bg-card p-5">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Venue
                    </p>
                    <p className="mt-1 font-medium text-card-foreground">
                      {concert.venue}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-sm border border-border bg-card p-5">
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
                <div className="flex items-start gap-4 rounded-sm border border-border bg-card p-5">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Time
                    </p>
                    <p className="mt-1 font-medium text-card-foreground">
                      {concert.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-sm border border-border bg-card p-5">
                  <Users className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Category
                    </p>
                    <p className="mt-1 font-medium capitalize text-card-foreground">
                      {concert.category}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:sticky lg:top-28 h-fit">
              <div className="rounded-sm border border-border bg-card p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Tickets from
                </p>
                <p className="mt-1 font-serif text-4xl font-bold text-card-foreground">
                  {"\u20AC"}{concert.price}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">per person</p>

                <div className="mt-6 border-t border-border pt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-card-foreground">
                      {format(dateObj, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-card-foreground">
                      {concert.time}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Venue</span>
                    <span className="font-medium text-card-foreground">
                      {concert.venue}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/concerts/${concert.id}/book`}
                  className="mt-6 flex w-full items-center justify-center rounded-sm bg-accent px-6 py-3 text-sm font-medium tracking-wide text-accent-foreground transition-opacity hover:opacity-90"
                >
                  Book Tickets
                </Link>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Secure checkout. Instant confirmation via email.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
