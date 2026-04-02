import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CalendarBrowser } from "@/components/calendar-browser"

export default function CalendarPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="py-12">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Schedule
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
              Concert Calendar
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Select a date to see which performances are scheduled. Plan your
              perfect evening at the opera.
            </p>
          </div>

          <CalendarBrowser />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
