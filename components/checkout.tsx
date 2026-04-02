"use client"

import { useEffect, useState } from "react"
import { createCheckoutSession } from "@/app/actions/stripe"
import { Spinner } from "@/components/ui/spinner"

interface CheckoutProps {
  concertId: string
  tickets: number
}

export function Checkout({ concertId, tickets }: CheckoutProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initiateCheckout = async () => {
      try {
        const result = await createCheckoutSession({ concertId, tickets })

        if (!result.checkoutUrl) {
          throw new Error("Failed to create checkout URL")
        }

        window.location.href = result.checkoutUrl
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    initiateCheckout()
  }, [concertId, tickets])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return null
}
