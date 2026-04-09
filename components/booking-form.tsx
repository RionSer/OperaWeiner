"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus } from "lucide-react"
import type { Concert } from "@/lib/concerts"

interface BookingFormProps {
  concert: Concert
}

export function BookingForm({ concert }: BookingFormProps) {
  const [tickets, setTickets] = useState(1)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const router = useRouter()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleProceed = () => {
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      setEmailError("Please enter a valid email address.")
      return
    }
    setEmailError("")
    router.push(
      `/checkout/${concert.id}?tickets=${tickets}&email=${encodeURIComponent(normalizedEmail)}`
    )
  }

  const total = concert.price * tickets

  return (
    <div className="mt-8 rounded-sm border border-border bg-card p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError("")
            }}
            className="h-12 text-base"
          />
          <p className="text-xs text-muted-foreground">
            Enter your email to receive tickets and view your booking after payment.
          </p>
          {emailError ? (
            <p className="text-sm text-destructive">{emailError}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tickets">Number of Tickets</Label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setTickets(Math.max(1, tickets - 1))}
              disabled={tickets <= 1}
              aria-label="Decrease tickets"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="tickets"
              type="number"
              min={1}
              max={10}
              value={tickets}
              onChange={(e) => setTickets(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              className="w-20 text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setTickets(Math.min(10, tickets + 1))}
              disabled={tickets >= 10}
              aria-label="Increase tickets"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Maximum 10 tickets per order</p>
        </div>

        <div className="space-y-3 border-t border-border pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Ticket price ({tickets}x)
            </span>
            <span className="text-foreground">
              {new Intl.NumberFormat("de-AT", {
                style: "currency",
                currency: "EUR",
              }).format(concert.price)} each
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-foreground">Total</span>
            <span className="text-lg text-accent">
              {new Intl.NumberFormat("de-AT", {
                style: "currency",
                currency: "EUR",
              }).format(total)}
            </span>
          </div>
        </div>

        <Button onClick={handleProceed} className="w-full" size="lg">
          Proceed to Payment
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          You will be redirected to our secure payment provider
        </p>
      </div>
    </div>
  )
}
