"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Mail,
  User,
  Download,
} from "lucide-react"

export function ConfirmationDetails() {
  const searchParams = useSearchParams()

  const bookingId = searchParams.get("bookingId")
  const concert = searchParams.get("concert")
  const name = searchParams.get("name")
  const email = searchParams.get("email")
  const tickets = searchParams.get("tickets")
  const total = searchParams.get("total")
  const date = searchParams.get("date")
  const time = searchParams.get("time")
  const venue = searchParams.get("venue")
  const composer = searchParams.get("composer")

  if (!bookingId || !concert) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          No Booking Found
        </h1>
        <p className="mt-4 text-muted-foreground">
          We couldn&apos;t find a booking to display.
        </p>
        <Link
          href="/concerts"
          className="mt-8 inline-flex rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-foreground"
        >
          Browse Concerts
        </Link>
      </div>
    )
  }

  const dateObj = date ? parseISO(date) : null

  return (
    <div className="mx-auto max-w-2xl px-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle2 className="h-8 w-8 text-accent" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Booking Confirmed
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your tickets have been booked successfully.
        </p>
      </div>

      {/* Booking ID */}
      <div className="mt-10 rounded-sm border border-accent/30 bg-accent/5 p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          Booking Reference
        </p>
        <p className="mt-2 font-serif text-3xl font-bold tracking-widest text-foreground">
          {bookingId}
        </p>
      </div>

      {/* Concert Details */}
      <div className="mt-8 rounded-sm border border-border bg-card p-6">
        <h2 className="font-serif text-2xl font-bold text-card-foreground">
          {concert}
        </h2>
        {composer && (
          <p className="mt-1 text-sm text-muted-foreground">{composer}</p>
        )}

        <div className="mt-6 grid gap-4">
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 shrink-0 text-accent" />
            <span className="text-card-foreground">{venue}</span>
          </div>
          {dateObj && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 shrink-0 text-accent" />
              <span className="text-card-foreground">
                {format(dateObj, "EEEE, MMMM d, yyyy")}
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 shrink-0 text-accent" />
            <span className="text-card-foreground">{time}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Ticket className="h-4 w-4 shrink-0 text-accent" />
            <span className="text-card-foreground">
              {tickets} {Number(tickets) === 1 ? "ticket" : "tickets"}
            </span>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <div className="flex items-center justify-between">
            <span className="font-medium text-card-foreground">Total Paid</span>
            <span className="font-serif text-2xl font-bold text-card-foreground">
              {"\u20AC"}{Number(total).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="mt-6 rounded-sm border border-border bg-card p-6">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Confirmation sent to
        </h3>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 shrink-0 text-accent" />
            <span className="text-card-foreground">{name}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 shrink-0 text-accent" />
            <span className="text-card-foreground">{email}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <Download className="h-4 w-4" />
          Print Tickets
        </button>
        <Link
          href="/concerts"
          className="inline-flex rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Browse More Concerts
        </Link>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        A confirmation email has been sent to {email}. Please present your
        booking reference at the venue.
      </p>
    </div>
  )
}
