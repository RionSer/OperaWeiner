import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ConfirmationDetails } from "@/components/confirmation-details"

export default function ConfirmationPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-24 pb-16">
        <Suspense fallback={
          <div className="mx-auto max-w-2xl px-6 py-24 text-center">
            <p className="text-muted-foreground">Loading confirmation...</p>
          </div>
        }>
          <ConfirmationDetails />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  )
}
