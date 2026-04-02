"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { concerts } from "@/lib/concerts"
import { ConcertCard } from "@/components/concert-card"
import { CalendarDays } from "lucide-react"

export function CalendarBrowser() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const concertDates = new Set(concerts.map((c) => c.date))

  const selectedDateStr = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null

  const filteredConcerts = selectedDateStr
    ? concerts.filter((c) => c.date === selectedDateStr)
    : []

  return (
    <div className="grid gap-10 lg:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-start">
        <div className="rounded-sm border border-border bg-card p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              hasConcert: (date) =>
                concertDates.has(format(date, "yyyy-MM-dd")),
            }}
            modifiersClassNames={{
              hasConcert: "!bg-accent/20 !text-accent font-bold",
            }}
            className="font-sans"
          />
        </div>
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block h-3 w-3 rounded-full bg-accent/20 border border-accent/40" />
          Dates with scheduled performances
        </p>
      </div>

      <div>
        {!selectedDate && (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border bg-card px-8 py-24 text-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
              Select a Date
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Choose a date from the calendar to see performances scheduled for
              that day. Highlighted dates have events.
            </p>
          </div>
        )}

        {selectedDate && filteredConcerts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border bg-card px-8 py-24 text-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
              No Performances
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              There are no performances scheduled for{" "}
              {format(selectedDate, "MMMM d, yyyy")}. Try another date.
            </p>
          </div>
        )}

        {selectedDate && filteredConcerts.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredConcerts.length}{" "}
              {filteredConcerts.length === 1
                ? "performance"
                : "performances"}{" "}
              scheduled
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {filteredConcerts.map((concert) => (
                <ConcertCard key={concert.id} concert={concert} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
