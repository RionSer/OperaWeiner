"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus, Loader2, AlertCircle } from "lucide-react"
import type { Concert } from "@/lib/concerts"

interface BookingFormProps {
  concert: Concert
}

export function BookingForm({ concert }: BookingFormProps) {
  const [tickets, setTickets] = useState(1)
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      setIsChecking(false)
    }
    checkAuth()
  }, [])

  const handleProceed = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/concerts/${concert.id}/book`)
      return
    }
    router.push(`/checkout/${concert.id}?tickets=${tickets}`)
  }

  const total = concert.price * tickets

  if (isChecking) {
    return (
      <div className="mt-8 flex items-center justify-center rounded-sm border border-border bg-card p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mt-8 rounded-sm border border-border bg-card p-6">
      {!isAuthenticated && (
        <div className="mb-6 flex items-start gap-3 rounded-md bg-accent/10 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-medium text-foreground">Sign in required</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You&apos;ll need to sign in or create an account to complete your booking.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
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
          {isAuthenticated ? "Proceed to Payment" : "Sign In to Continue"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          You will be redirected to our secure payment provider
        </p>
      </div>
    </div>
  )
}
