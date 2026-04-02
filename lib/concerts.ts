export interface Concert {
  id: string
  title: string
  composer: string
  venue: string
  date: string
  time: string
  price: number
  description: string
  longDescription: string
  image: string
  category: "opera" | "ballet" | "concert"
}

export const venues = [
  "Vienna State Opera",
  "Volksoper Vienna",
  "Theater an der Wien",
  "Musikverein",
  "Konzerthaus",
] as const

export const concerts: Concert[] = [
  {
    id: "la-traviata-2026-03-15",
    title: "La Traviata",
    composer: "Giuseppe Verdi",
    venue: "Vienna State Opera",
    date: "2026-03-15",
    time: "19:30",
    price: 85,
    description:
      "Verdi's timeless tale of love and sacrifice in three unforgettable acts.",
    longDescription:
      "Experience one of the most beloved operas ever written. La Traviata tells the story of Violetta, a courtesan in Paris who falls deeply in love with Alfredo Germont. Their passionate affair is threatened by societal expectations and family honor. With breathtaking arias including 'Libiamo ne' lieti calici' and 'Sempre libera,' this production features world-class soloists and the Vienna State Opera Orchestra under the baton of Maestro Philippe Jordan.",
    image: "/images/opera-performance.jpg",
    category: "opera",
  },
  {
    id: "die-zauberflote-2026-03-18",
    title: "Die Zauberflote",
    composer: "Wolfgang Amadeus Mozart",
    venue: "Vienna State Opera",
    date: "2026-03-18",
    time: "19:00",
    price: 95,
    description:
      "Mozart's magical singspiel blending fairy tale and Masonic symbolism.",
    longDescription:
      "The Magic Flute remains one of Mozart's crowning achievements. Prince Tamino embarks on a quest to rescue Princess Pamina from the High Priest Sarastro, guided by the magical instruments bestowed upon him by the Queen of the Night. This stunning new production by the Vienna State Opera combines traditional staging with innovative visual design, featuring the legendary Queen of the Night aria and the beloved Papageno.",
    image: "/images/opera-balcony.jpg",
    category: "opera",
  },
  {
    id: "carmen-2026-03-22",
    title: "Carmen",
    composer: "Georges Bizet",
    venue: "Volksoper Vienna",
    date: "2026-03-22",
    time: "19:30",
    price: 70,
    description:
      "Bizet's fiery masterpiece of passion, jealousy, and fate in Seville.",
    longDescription:
      "Carmen is one of the most performed operas in the world, and for good reason. Set in Seville, Spain, it tells the story of the free-spirited Carmen and the soldier Don Jose, whose obsessive love leads to tragedy. From the iconic Habanera to the dramatic final scene, this Volksoper production brings the heat of Andalusia to Vienna with vibrant costumes, powerful voices, and an orchestra that captures every nuance of Bizet's brilliant score.",
    image: "/images/opera-singer.jpg",
    category: "opera",
  },
  {
    id: "tosca-2026-03-25",
    title: "Tosca",
    composer: "Giacomo Puccini",
    venue: "Theater an der Wien",
    date: "2026-03-25",
    time: "20:00",
    price: 90,
    description:
      "Puccini's thrilling drama of love, art, and political intrigue in Rome.",
    longDescription:
      "Tosca is Puccini at his most dramatic. Set against the backdrop of Napoleonic political turmoil in Rome, the opera follows the passionate singer Floria Tosca, her lover the painter Cavaradossi, and the corrupt police chief Scarpia. Featuring some of opera's most famous arias including 'Vissi d'arte' and 'E lucevan le stelle,' this production at the historic Theater an der Wien promises an evening of intense emotion and musical brilliance.",
    image: "/images/opera-performance.jpg",
    category: "opera",
  },
  {
    id: "swan-lake-2026-03-20",
    title: "Swan Lake",
    composer: "Pyotr Ilyich Tchaikovsky",
    venue: "Vienna State Opera",
    date: "2026-03-20",
    time: "19:00",
    price: 110,
    description:
      "Tchaikovsky's enchanting ballet of love, deception, and transformation.",
    longDescription:
      "The Vienna State Ballet presents Tchaikovsky's masterpiece in a grand production that has captivated audiences for over a century. Follow Prince Siegfried as he falls in love with Odette, the Swan Queen, and battles the sorcerer Rothbart's dark magic. With exquisite choreography, stunning costumes, and Tchaikovsky's immortal score performed by the Vienna State Opera Orchestra, this is ballet at its finest.",
    image: "/images/opera-balcony.jpg",
    category: "ballet",
  },
  {
    id: "beethoven-ninth-2026-03-28",
    title: "Beethoven's Ninth Symphony",
    composer: "Ludwig van Beethoven",
    venue: "Musikverein",
    date: "2026-03-28",
    time: "19:30",
    price: 120,
    description:
      "The legendary Ninth Symphony performed in the world's finest concert hall.",
    longDescription:
      "Experience Beethoven's monumental Ninth Symphony in the Golden Hall of the Musikverein, one of the world's most acoustically perfect concert halls. The Vienna Philharmonic, under the direction of a world-renowned conductor, brings this masterwork to life with four outstanding soloists and the Vienna Singverein chorus. The 'Ode to Joy' finale is a transcendent musical experience not to be missed.",
    image: "/images/hero-opera.jpg",
    category: "concert",
  },
  {
    id: "aida-2026-04-02",
    title: "Aida",
    composer: "Giuseppe Verdi",
    venue: "Vienna State Opera",
    date: "2026-04-02",
    time: "18:30",
    price: 100,
    description:
      "Verdi's grand Egyptian epic of forbidden love and duty.",
    longDescription:
      "Aida is grand opera at its most spectacular. Set in ancient Egypt, the story follows the Ethiopian princess Aida, enslaved in Egypt, torn between her love for the Egyptian general Radames and her loyalty to her father and homeland. This lavish Vienna State Opera production features elaborate sets, a full chorus, and Verdi's magnificent score including the celebrated Triumphal March. A truly epic evening at the opera.",
    image: "/images/opera-singer.jpg",
    category: "opera",
  },
  {
    id: "der-rosenkavalier-2026-04-05",
    title: "Der Rosenkavalier",
    composer: "Richard Strauss",
    venue: "Vienna State Opera",
    date: "2026-04-05",
    time: "17:00",
    price: 95,
    description:
      "Strauss's bittersweet comedy of love and time in 18th-century Vienna.",
    longDescription:
      "Der Rosenkavalier is the quintessential Viennese opera. Set in the Vienna of Maria Theresa, it tells the story of the Marschallin, who must accept the passing of time and relinquish her young lover Octavian to the beautiful Sophie. Richard Strauss's lush, waltz-infused score and Hugo von Hofmannsthal's witty libretto create an opera of unparalleled elegance and emotional depth. The famous trio in Act III is one of the most beautiful moments in all of opera.",
    image: "/images/opera-balcony.jpg",
    category: "opera",
  },
  {
    id: "don-giovanni-2026-04-10",
    title: "Don Giovanni",
    composer: "Wolfgang Amadeus Mozart",
    venue: "Theater an der Wien",
    date: "2026-04-10",
    time: "19:30",
    price: 80,
    description:
      "Mozart's dark comedy about the legendary seducer meets his fate.",
    longDescription:
      "Don Giovanni is Mozart's dramatic masterpiece, blending comedy and tragedy in the story of the notorious seducer. From the thrilling overture to the supernatural finale, this opera combines some of Mozart's finest music with a story that still resonates today. The Theater an der Wien production brings fresh insight to this timeless work with innovative staging and an outstanding international cast.",
    image: "/images/opera-performance.jpg",
    category: "opera",
  },
  {
    id: "nutcracker-2026-04-12",
    title: "The Nutcracker",
    composer: "Pyotr Ilyich Tchaikovsky",
    venue: "Volksoper Vienna",
    date: "2026-04-12",
    time: "15:00",
    price: 65,
    description:
      "Tchaikovsky's beloved holiday ballet filled with magic and wonder.",
    longDescription:
      "The Volksoper Vienna presents Tchaikovsky's beloved Nutcracker ballet in an enchanting production perfect for the whole family. Follow young Clara on her magical Christmas Eve journey through the Land of Sweets, with dancing snowflakes, the Sugar Plum Fairy, and unforgettable melodies. Tchaikovsky's glorious score is performed live by the Volksoper Orchestra.",
    image: "/images/opera-building.jpg",
    category: "ballet",
  },
]

export function getConcertById(id: string): Concert | undefined {
  return concerts.find((c) => c.id === id)
}

export function getConcertsByDate(dateStr: string): Concert[] {
  return concerts.filter((c) => c.date === dateStr)
}

export function getUpcomingConcerts(): Concert[] {
  return [...concerts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}

export function getFeaturedConcerts(): Concert[] {
  return concerts.slice(0, 4)
}
