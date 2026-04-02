import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getUpcomingConcerts } from "@/lib/concerts"
import { ConcertCard } from "@/components/concert-card"

export default function ConcertsPage() {
  const concerts = getUpcomingConcerts()

  return (
    <>
      <SiteHeader />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="py-12">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Season 2026
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
              All Performances
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Browse our complete program of opera, ballet, and classical
              concerts across Vienna&apos;s finest venues.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {concerts.map((concert) => (
              <ConcertCard key={concert.id} concert={concert} />
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
