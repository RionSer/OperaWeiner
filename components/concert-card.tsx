import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin } from "lucide-react"
import { format, parseISO } from "date-fns"
import type { Concert } from "@/lib/concerts"

interface ConcertCardProps {
  concert: Concert
  featured?: boolean
}

export function ConcertCard({ concert, featured = false }: ConcertCardProps) {
  const dateObj = parseISO(concert.date)

  return (
    <Link
      href={`/concerts/${concert.id}`}
      className="group block overflow-hidden rounded-sm border border-border bg-card transition-all hover:shadow-lg"
    >
      <div className={`relative overflow-hidden ${featured ? "aspect-[4/3]" : "aspect-[3/2]"}`}>
        <Image
          src={concert.image}
          alt={`${concert.title} by ${concert.composer}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
        <span className="absolute top-4 left-4 rounded-sm bg-accent px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-foreground">
          {concert.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-xl font-bold text-card-foreground text-balance">
          {concert.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{concert.composer}</p>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span>{concert.venue}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-accent" />
              <span>{format(dateObj, "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0 text-accent" />
              <span>{concert.time}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-semibold text-card-foreground">
            {"From \u20AC"}{concert.price}
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-accent transition-colors group-hover:text-accent/80">
            View Details
          </span>
        </div>
      </div>
    </Link>
  )
}
