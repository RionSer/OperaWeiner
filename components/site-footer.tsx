import Link from "next/link"
import { Music } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Music className="h-6 w-6 text-accent" />
              <span className="font-serif text-xl font-bold tracking-tight">
                Wiener Oper
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
              Your gateway to the finest opera, ballet, and classical music
              performances in Vienna.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-widest">
              Quick Links
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  href="/concerts"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  All Concerts
                </Link>
              </li>
              <li>
                <Link
                  href="/calendar"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  Calendar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-widest">
              Contact
            </h3>
            <address className="mt-4 flex flex-col gap-2 text-sm not-italic leading-relaxed text-primary-foreground/70">
              <span>Opernring 2, 1010 Wien</span>
              <span>Austria</span>
              <a
                href="mailto:info@wieneroper.at"
                className="transition-colors hover:text-accent"
              >
                info@wieneroper.at
              </a>
              <a
                href="tel:+4315141400"
                className="transition-colors hover:text-accent"
              >
                +43 1 514 14 00
              </a>
            </address>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-8 text-center text-xs text-primary-foreground/50">
          <p>
            {"2026 Wiener Oper. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
