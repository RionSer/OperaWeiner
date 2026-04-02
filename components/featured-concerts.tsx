import { getFeaturedConcerts } from "@/lib/concerts"
import { ConcertCard } from "@/components/concert-card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function FeaturedConcerts() {
  const featured = getFeaturedConcerts()

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
            Upcoming
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Featured Performances
          </h2>
        </div>
        <Link
          href="/concerts"
          className="hidden items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80 sm:flex"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((concert) => (
          <ConcertCard key={concert.id} concert={concert} featured />
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/concerts"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent"
        >
          View All Concerts
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
