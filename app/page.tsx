import { HeroSection } from "@/components/hero-section"
import { FeaturedConcerts } from "@/components/featured-concerts"
import { AboutSection } from "@/components/about-section"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturedConcerts />
        <AboutSection />
      </main>
      <SiteFooter />
    </>
  )
}
