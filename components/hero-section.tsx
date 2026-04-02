import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src="/images/hero-opera.jpg"
        alt="Interior of the Vienna State Opera house"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-primary/70" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-24 pb-16 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          Vienna, Austria
        </p>

        <h1 className="mt-6 font-serif text-5xl font-bold leading-tight tracking-tight text-primary-foreground md:text-7xl lg:text-8xl text-balance">
          The Art of Opera
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80 md:text-lg">
          Discover world-class opera, ballet, and classical music at
          Vienna&apos;s most legendary stages. Book your seats for an
          unforgettable evening.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/concerts"
            className="inline-flex items-center gap-2 rounded-sm bg-accent px-8 py-3 text-sm font-medium tracking-wide text-accent-foreground transition-opacity hover:opacity-90"
          >
            Browse Concerts
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/calendar"
            className="inline-flex items-center gap-2 rounded-sm border border-primary-foreground/30 px-8 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            View Calendar
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
