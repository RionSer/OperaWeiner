import Image from "next/image"

export function AboutSection() {
  return (
    <section className="bg-secondary">
      {/* About Section */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Since 1869
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
              A Legacy of Artistic Excellence
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Vienna has been the cultural heart of Europe for centuries. From
              Mozart and Beethoven to Strauss and Mahler, the city&apos;s opera
              houses have witnessed some of the greatest moments in musical
              history.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Today, Vienna&apos;s stages continue to host world-class
              performances that draw audiences from around the globe. Whether
              you seek the grandeur of a Verdi opera, the elegance of a
              Tchaikovsky ballet, or the sublime beauty of a symphony, Vienna
              offers an unparalleled cultural experience.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6">
              <div>
                <p className="font-serif text-3xl font-bold text-accent">
                  150+
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Years of Opera
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-accent">
                  5
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Premier Venues
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-accent">
                  300+
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Shows per Year
                </p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <Image
              src="/images/opera-building.jpg"
              alt="The Vienna State Opera building at night"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
