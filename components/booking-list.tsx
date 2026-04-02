'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Booking {
  id: string
  concert_title: string
  concert_venue: string
  concert_date: string
  concert_time: string
  tickets: number
  total_amount: number
  payment_status: string
  booking_reference: string
}

interface BookingListProps {
  bookings: Booking[]
  isLoading: boolean
}

export function BookingList({ bookings, isLoading }: BookingListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 bg-secondary/50 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">No bookings yet</p>
        <Link href="/concerts">
          <Button variant="default">Browse Concerts</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card
          key={booking.id}
          className="p-6 hover:shadow-md transition-shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                {booking.concert_title}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {booking.concert_venue}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {booking.concert_date} at {booking.concert_time}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {booking.tickets} {booking.tickets === 1 ? 'Ticket' : 'Tickets'}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Reference</p>
                <p className="font-mono text-sm font-semibold text-foreground">
                  {booking.booking_reference}
                </p>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-accent">€{booking.total_amount.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    booking.payment_status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : booking.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {booking.payment_status.charAt(0).toUpperCase() +
                    booking.payment_status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Link href={`/dashboard/ticket/${booking.booking_reference}`}>
              <Button
                variant="outline"
                size="sm"
                className="w-full md:w-auto"
              >
                View Ticket
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  )
}
