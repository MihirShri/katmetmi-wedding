'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────────

type Diet = 'veg' | 'nonveg'
type EatFilter = 'veg' | 'nonveg'
type Tab = 'eat' | 'see' | 'know' | 'arrive'

type ArriveMode = {
  id: string
  label: string
  time: string
  mapsUrl: string
  mapsLabel: string
  icon: React.ReactNode
  paragraphs: string[]
  tip?: string
  warning?: string
}

type Restaurant = {
  name: string
  location?: string
  mapUrl: string
  description: string
  dishes: string[]
  tip?: string
  diet: Diet
  must?: boolean
}

type PlaceItem = {
  name: string
  description: string
  detail: string
  must?: boolean
}

type Speciality = {
  name: string
  description: string
}

// ── Eat data ──────────────────────────────────────────────────────────────────

const RESTAURANTS: Restaurant[] = [
  {
    name: 'Tunday Kababi',
    mapUrl: 'https://maps.app.goo.gl/s45BYyDSVQFbBRoi9',
    description:
      'Skip the famous Aminabad and Chowk branches — this one is less crowded and equally, honestly more, enjoyable. The kebabs here are the real deal.',
    dishes: ['Galawati kebab', 'Sheermal', 'Mughlai Paratha', 'Chicken masala', 'Mutton biryani'],
    tip: "Try the Galawati with both Sheermal and Mughlai Paratha. Don't choose — just order both.",
    diet: 'nonveg',
    must: true,
  },
  {
    name: 'Manish Eating Point',
    mapUrl: 'https://maps.app.goo.gl/FT4wWxfPFvoGkVyw9',
    description:
      "A no-frills spot that does two things and does them exceptionally well. Don't overthink it.",
    dishes: ['Chicken roll', 'Shawarma'],
    tip: "The chicken roll is literally all you need. Resist the urge to order anything else.",
    diet: 'nonveg',
    must: true,
  },
  {
    name: "Raheem's Kulcha-Nahari",
    location: 'Akbari Gate, Chowk',
    mapUrl: 'https://maps.app.goo.gl/fM9iDCvfqGiaEd1y9',
    description:
      "Deep in the crowded Akbari Gate and Chowk area — brace yourself for the lanes. Completely worth it. The kulcha nahari is the reason you're here and the only thing you need to think about.",
    dishes: ['Kulcha nahari', 'Kebabs'],
    tip: 'Kulcha nahari. That is the order. Everything else is optional.',
    diet: 'nonveg',
  },
  {
    name: "The Awadh's Dastarkhwan",
    mapUrl: 'https://maps.app.goo.gl/ByhxLjBAfwLXXHHG8',
    description:
      'If you want slightly better ambience without compromising on taste, this is the one. Their chicken masala with Mughlai bread is a very good afternoon.',
    dishes: ['Chicken masala', 'Mughlai Paratha'],
    diet: 'nonveg',
  },
  {
    name: 'Naushijaan',
    mapUrl: 'https://maps.app.goo.gl/wNeKUgkmLjpVyqfd8',
    description:
      'A kebab institution. Their Majlisi kebab is the star — nothing else required. Also has a Gomti Nagar branch if you prefer a nicer setting.',
    dishes: ['Majlisi kebab', 'Mughlai Paratha'],
    tip: "That's it. That's the order. Majlisi kebab + Mughlai Paratha. Done.",
    diet: 'nonveg',
  },
  {
    name: 'Sakhawat Restaurant',
    mapUrl: 'https://maps.app.goo.gl/AF9CM38AbsY147y18',
    description:
      'A reliable stop for classic Lucknowi kebabs. Go for the classics — shami, kakori, boti — paired with any Mughlai bread.',
    dishes: ['Shami kebab', 'Kakori kebab', 'Boti kebab'],
    diet: 'nonveg',
  },
  {
    name: 'Bajpayee Kachori Bhandar',
    mapUrl: 'https://maps.app.goo.gl/Po6R5pdbbnRpqvNq8',
    description: 'Serves two types of kachori. The only correct order is both.',
    dishes: ['Kachori (type 1)', 'Kachori (type 2)'],
    tip: 'Order both types. This is not optional.',
    diet: 'veg',
    must: true,
  },
  {
    name: 'Prakash Ki Mashoor Kulfi',
    location: 'Gomti Nagar',
    mapUrl: 'https://maps.app.goo.gl/1d9Vj34Ek7najpQr9',
    description:
      'The Gomti Nagar branch of the legendary Prakash Kulfi. Absolutely lives up to the hype.',
    dishes: ['Kulfi falooda'],
    tip: 'Straight to the kulfi falooda. No detours.',
    diet: 'veg',
    must: true,
  },
  {
    name: 'Mithai Vala — Chaat Stall',
    mapUrl: 'https://maps.app.goo.gl/DSvWEMVG59kEDCub7',
    description:
      "There's a chaat stall set up right in front of this sweets shop. Do not walk past it. The aloo tikki here is one of the best you'll find in Lucknow.",
    dishes: ['Aloo tikki'],
    tip: 'Ask him to make it extra crispy. Non-negotiable.',
    diet: 'veg',
  },
  {
    name: 'Kewal Tea Centre',
    mapUrl: 'https://maps.app.goo.gl/yrNAJzPeh7bjyuPi6',
    description:
      "Skip Sharma ji ki chai — overhyped. Kewal chai is the real deal. You will get addicted after the first sip.",
    dishes: ['Kewal chai', 'Bun makkhan'],
    tip: "Not having it with bun makkhan is a sin. You have been warned.",
    diet: 'veg',
  },
  {
    name: 'The Hazelnut Factory',
    mapUrl: 'https://maps.app.goo.gl/rngmg85pcyeWKNwHA',
    description:
      "The best coffee in Lucknow. This is the groom's opinion, but it's also the truth. Bakery items are lovely; the choco chip cookies are worth taking home.",
    dishes: ['Coffee', 'Choco chip cookies', 'Bakery items'],
    diet: 'veg',
  },
  {
    name: 'Durgma Restaurant',
    location: 'Hazratganj',
    mapUrl: 'https://maps.app.goo.gl/2H6tj4HZov2LuQ8f9',
    description:
      'Looking for a light, home-style veg meal? This is the answer. Simple food done very well.',
    dishes: ['Paneer gravy', 'Malai kofta', 'Dal tadka', 'Butter naan', 'Missi roti'],
    tip: "Don't miss the missi roti. Don't.",
    diet: 'veg',
  },
]

const SPECIALITIES: Speciality[] = [
  { name: 'Galawati kebab', description: 'Melt-in-mouth minced meat patty — the soul of Lucknowi kebabs.' },
  { name: 'Kakori kebab', description: 'Like Galawati but elongated, named after the town of Kakori.' },
  { name: 'Shami kebab', description: 'Firmer than Galawati, equally delicious — a different experience.' },
  { name: 'Boti kebab', description: 'Boneless mutton pieces in rich, slow-cooked gravy.' },
  { name: 'Mughlai Paratha', description: 'Layered flatbread — the default pairing for most kebabs here.' },
  { name: 'Sheermal', description: 'Sweet bread made with flour, milk, and saffron. (Food colour these days, but still.)' },
  { name: 'Rumali Roti', description: 'Thin as a handkerchief, soft as silk. Named after the word for handkerchief.' },
]

// ── See data ──────────────────────────────────────────────────────────────────

const SEE_ITEMS: PlaceItem[] = [
  {
    name: 'Bara Imambara',
    description:
      'The largest vaulted hall built without nails or beams — an 18th-century feat of engineering. The real draw is the Bhul Bhulayia: a rooftop labyrinth of 489 identical corridors where you will get turned around, backtrack, and emerge somewhere completely unexpected. That is not a warning — that is the experience. Go early, carry water, budget at least two hours.',
    detail: 'Hussainabad · Morning recommended · Budget 2 hours',
    must: true,
  },
  {
    name: 'Hazratganj',
    description:
      'The heart of Lucknow — and one of the few places in India where an old colonial promenade has aged genuinely well. Walk it slowly. Old buildings, kurta shops, chaat stalls, bookshops, and coffee cafes share the same stretch without anyone seeming to mind. The evening crowd is half the charm. Get there before dinner, wander without a plan, and let the street take you wherever it wants.',
    detail: 'Central Lucknow · Best in the evening',
    must: true,
  },
  {
    name: 'Rumi Darwaza',
    description:
      'Built in 1784, modelled on the gate of Constantinople, and still flawless. The gateway that marks the entry to old Lucknow. It will be on your camera roll before you even reach it.',
    detail: 'Old Lucknow',
  },
  {
    name: 'Gomti Riverfront',
    description:
      "A long, manicured promenade along the river — the best spot in Lucknow for a quiet evening walk. Lights reflecting on the water after sunset are genuinely lovely. A good place to slow down before heading to dinner.",
    detail: 'Gomti Nagar · Evenings recommended',
  },
  {
    name: 'Janeshwar Mishra Park',
    description:
      'One of the largest urban parks in India, and vastly underrated. A peaceful morning escape from old city chaos. The lake walk at sunrise is lovely and calm.',
    detail: 'Gomti Nagar · Morning recommended',
  },
  {
    name: 'Chikankari Shopping',
    description:
      "Lucknow's chikankari embroidery is one of India's most beautiful textile traditions — bring some home. For a curated, branded experience: Sewa Chikan is the name. For the real deal at real prices: head to Chowk, where generations of shops have been doing this longer than anyone can remember. Budget more time than you think you'll need.",
    detail: 'Sewa Chikan (branded) · Chowk (authentic & cheaper)',
  },
]

// ── Know data ─────────────────────────────────────────────────────────────────

const KNOW_ITEMS: PlaceItem[] = [
  {
    name: 'Weather in Late November',
    description:
      'Mornings are crisp — around 8 to 13°C. Afternoons are lovely: 22 to 26°C, clear skies, low humidity. Evenings cool back down to 14–16°C and can feel genuinely cold. Think light layers over your outfit, not a heavy coat. North Indian winter at its absolute best.',
    detail: 'Morning 8–13°C · Afternoon 22–26°C · Evening ~14°C',
    must: true,
  },
  {
    name: 'What to Pack',
    description:
      'A light jacket or shawl for evenings — non-negotiable. Comfortable walking shoes; old Lucknow is best explored on foot. Modest clothing if visiting religious sites. Cash for street food and autos — many old establishments do not take cards.',
    detail: 'Layers · Walking shoes · Cash · Modest clothing',
    must: true,
  },
  {
    name: 'Getting Around',
    description:
      'Rapido and Ola work reliably across the city. Autos are everywhere but always negotiate the fare before you get in — this is not optional, it is tradition. For the narrow lanes of old Lucknow, a cycle rickshaw is both practical and the correct aesthetic choice.',
    detail: 'Rapido · Ola · Auto · Cycle rickshaw in old city',
  },
  {
    name: 'Aminabad & Chowk',
    description:
      'Both are major commercial hubs of old Lucknow and absolutely worth visiting. They are also genuinely crowded — especially on weekends and evenings. Narrow lanes, honking autos, and zero personal space are features, not bugs. Weekday afternoons are kinder. Leave the large bags behind.',
    detail: 'Weekday afternoons recommended · Go light',
  },
  {
    name: 'The Lucknowi Way',
    description:
      '"Pehle aap" — after you — is not a phrase here, it is a way of life. The city moves with a certain elegance and refuses to be rushed. Embrace the tehzeeb, try the Urdu, and do not be surprised when a complete stranger helps you find your way with elaborate courtesy.',
    detail: 'Local culture',
  },
]

// ── Arrive data ───────────────────────────────────────────────────────────────

const ARRIVE_MODES: ArriveMode[] = [
  {
    id: 'air',
    label: 'By Air',
    time: '~1 hour to venue',
    mapsUrl: 'https://maps.app.goo.gl/yQp9N5cAfYSvGv8c9',
    mapsLabel: 'Directions from Airport',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M21 16v-2l-8-5V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    ),
    paragraphs: [
      "Once you land, head straight for the dedicated Ola / Uber / Rapido stand — it's clearly marked inside the terminal. Skip the autos; the auto stand is far enough to be a real drag with luggage.",
    ],
    warning:
      "You will be approached — loudly and persistently — by people offering private cabs. They will follow you, convince you, and then charge exorbitant amounts. Book on the app and only board that ride. If a driver insists on extra cash at drop-off, pay and get it refunded through the app.",
  },
  {
    id: 'train',
    label: 'By Train',
    time: '~1 hour to venue',
    mapsUrl: 'https://maps.app.goo.gl/iYHo3RRmHgm8WurbA',
    mapsLabel: 'Directions from Station',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C8 2 4 2.5 4 6v9.5C4 17.43 5.57 19 7.5 19L6 20.5V21h2l2-2h4l2 2h2v-.5L16.5 19C18.43 19 20 17.43 20 15.5V6c0-3.5-4-4-8-4zm0 2c3.51 0 5.5.58 5.93 1.5H6.07C6.5 4.58 8.49 4 12 4zM6 9V7h5v2H6zm6 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm7-8h-5V7h5v2z" />
      </svg>
    ),
    paragraphs: [
      "Lucknow has two main stations. If your train arrives at Lucknow Junction (LJN) — locally called the choti line — you're god's favourite. Step off, book Ola / Uber / Rapido, done.",
      "If your train arrives at Lucknow NR (the main line), exit the station and do the same. The app works reliably from both.",
    ],
    tip: "LJN might be the only railway station in the world where you can see a running road right at the edge of the platform. Worth a glance before you leave.",
    warning:
      "Both stations have autos and taxis trying to pull you in at inflated prices. App-based rides are faster, cheaper, and dramatically less dramatic.",
  },
  {
    id: 'road',
    label: 'By Road',
    time: 'Follow Google Maps',
    mapsUrl: 'https://maps.app.goo.gl/zQsS3BYorbJtQsCbA',
    mapsLabel: 'Navigate to Venue',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
      </svg>
    ),
    paragraphs: [
      "Google Maps will get you here. Drop in the venue name and follow.",
      "If you're driving from Delhi, the Yamuna Expressway into the Agra Expressway is one of the better highway drives in North India. Put on a good playlist.",
    ],
    tip: "Once you're inside the city, budget an extra 1 to 1.5 hours. Lucknow's inner-city traffic is real and will not be reasoned with.",
  },
]

function ArriveCard({ mode }: { mode: ArriveMode }) {
  return (
    <div className="bg-cream p-6 flex flex-col gap-4" style={{ borderLeft: '2px solid #C9956C' }}>
      {/* Icon + heading */}
      <div>
        <span className="text-terracotta mb-2 block">{mode.icon}</span>
        <h3 className="font-serif text-dark text-xl leading-tight">{mode.label}</h3>
        <p className="font-sans text-[10px] tracking-[0.22em] uppercase mt-0.5" style={{ color: 'rgba(201,149,108,0.80)' }}>
          {mode.time}
        </p>
      </div>

      {/* Paragraphs */}
      <div className="flex flex-col gap-2 flex-1">
        {mode.paragraphs.map((p, i) => (
          <p key={i} className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(26,17,8,0.58)' }}>
            {p}
          </p>
        ))}

        {mode.tip && (
          <p className="font-serif italic text-sm leading-relaxed" style={{ color: 'rgba(26,17,8,0.38)' }}>
            {mode.tip}
          </p>
        )}

        {mode.warning && (
          <div
            className="flex gap-2.5 p-3.5 mt-1"
            style={{ backgroundColor: 'rgba(201,149,108,0.10)', borderLeft: '2px solid rgba(201,149,108,0.45)' }}
          >
            <span className="font-sans text-[11px] shrink-0 mt-px" style={{ color: 'rgba(201,149,108,0.75)' }}>⚠</span>
            <p className="font-sans text-xs leading-relaxed" style={{ color: 'rgba(201,149,108,0.80)' }}>
              {mode.warning}
            </p>
          </div>
        )}
      </div>

      {/* Maps link */}
      <a
        href={mode.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 self-start px-4 py-2 font-sans text-[9px] tracking-[0.2em] uppercase border border-terracotta/50 text-terracotta hover:bg-terracotta hover:text-cream transition-colors duration-200"
      >
        <svg className="w-2.5 h-3 shrink-0" viewBox="0 0 10 14" fill="currentColor">
          <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
        {mode.mapsLabel}
      </a>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FoodDot({ diet }: { diet: Diet }) {
  const color = diet === 'veg' ? '#2E7D32' : '#B71C1C'
  return (
    <span
      className="inline-flex items-center justify-center w-4 h-4 border-2 shrink-0 mt-0.5"
      style={{ borderColor: color }}
      title={diet === 'veg' ? 'Vegetarian' : 'Non-vegetarian'}
    >
      <span className="w-2 h-2 rounded-full block" style={{ backgroundColor: color }} />
    </span>
  )
}

function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <div
      className="bg-cream p-6 flex flex-col gap-3 h-full"
      style={r.must ? { borderLeft: '2px solid #C9956C' } : undefined}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <FoodDot diet={r.diet} />
          <div className="min-w-0">
            <h3 className="font-serif text-dark text-xl leading-tight">{r.name}</h3>
            {r.location && (
              <p className="font-sans text-[10px] tracking-wider uppercase mt-0.5" style={{ color: 'rgba(26,17,8,0.4)' }}>
                {r.location}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {r.must && (
            <span className="font-sans text-[9px] tracking-widest text-terracotta uppercase hidden sm:inline">
              Must
            </span>
          )}
          <a
            href={r.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 font-sans text-[9px] tracking-[0.15em] uppercase border border-terracotta/50 text-terracotta hover:bg-terracotta hover:text-cream transition-colors duration-200"
          >
            <svg className="w-2.5 h-3 shrink-0" viewBox="0 0 10 14" fill="currentColor">
              <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
            </svg>
            Maps
          </a>
        </div>
      </div>

      {/* Description */}
      <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(26,17,8,0.58)' }}>
        {r.description}
      </p>

      {/* Dishes */}
      <div>
        <p
          className="font-sans text-[9px] tracking-[0.28em] uppercase mb-2"
          style={{ color: 'rgba(26,17,8,0.35)' }}
        >
          What to try
        </p>
        <div className="flex flex-wrap gap-1.5">
          {r.dishes.map((d) => (
            <span
              key={d}
              className="font-sans text-[10px] tracking-wide px-2.5 py-1"
              style={{
                backgroundColor: 'rgba(201,149,108,0.10)',
                color: 'rgba(201,149,108,0.85)',
                border: '1px solid rgba(201,149,108,0.20)',
              }}
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Insider tip */}
      {r.tip && (
        <p
          className="font-serif italic text-sm pt-3 mt-auto"
          style={{
            color: 'rgba(26,17,8,0.42)',
            borderTop: '1px solid rgba(26,17,8,0.07)',
          }}
        >
          {r.tip}
        </p>
      )}
    </div>
  )
}

function PlaceCard({ item }: { item: PlaceItem }) {
  return (
    <div
      className="bg-cream p-6"
      style={item.must ? { borderLeft: '2px solid #C9956C' } : undefined}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-serif text-dark text-xl">{item.name}</h3>
        {item.must && (
          <span className="font-sans text-[9px] tracking-widest text-terracotta uppercase mt-1.5 shrink-0">
            Must
          </span>
        )}
      </div>
      <p className="font-sans text-sm leading-relaxed mb-3" style={{ color: 'rgba(26,17,8,0.58)' }}>
        {item.description}
      </p>
      <p className="font-sans text-[10px] tracking-wider uppercase" style={{ color: 'rgba(201,149,108,0.65)' }}>
        {item.detail}
      </p>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function LucknowGuide() {
  const [activeTab, setActiveTab] = useState<Tab>('eat')
  const [eatFilter, setEatFilter] = useState<EatFilter>('nonveg')

  const filteredRestaurants = RESTAURANTS.filter((r) => r.diet === eatFilter)

  return (
    <section className="py-24 px-6 bg-sand">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-[11px] tracking-[0.32em] uppercase text-terracotta mb-4">
            You&rsquo;re in Lucknow Now
          </p>
          <h2 className="font-serif text-dark text-5xl md:text-6xl mb-4">
            Your Guide to the City
          </h2>
          <p className="font-sans text-sm max-w-sm mx-auto" style={{ color: 'rgba(26,17,8,0.52)' }}>
            Because we would feel terrible if you came all this way and missed the galouti kebabs.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center border-b mb-10" style={{ borderColor: 'rgba(201,149,108,0.20)' }}>
          {(
            [
              { key: 'eat' as Tab, label: 'Eat' },
              { key: 'see' as Tab, label: 'See' },
              { key: 'know' as Tab, label: 'Know' },
              { key: 'arrive' as Tab, label: 'Getting to the Venue', highlight: true },
            ]
          ).map(({ key, label, highlight }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="relative px-6 py-3 font-sans text-[11px] tracking-[0.2em] uppercase transition-colors"
              style={{
                color:
                  activeTab === key
                    ? '#1A1108'
                    : highlight
                    ? 'rgba(201,149,108,0.75)'
                    : 'rgba(139,115,85,1)',
              }}
            >
              {highlight && activeTab !== key && (
                <span className="mr-1.5" style={{ color: '#C9956C' }}>↗</span>
              )}
              {label}
              {activeTab === key && (
                <motion.div
                  layoutId="tab-line"
                  className="absolute bottom-0 left-0 right-0 h-px bg-terracotta"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >

            {/* ── Eat ── */}
            {activeTab === 'eat' && (
              <>
                <p className="font-sans text-sm italic text-center mb-8" style={{ color: 'rgba(26,17,8,0.52)' }}>
                  You came all the way to Lucknow. Please eat properly.
                </p>

                {/* Diet filter */}
                <div className="flex justify-center gap-2 mb-8">
                  {(
                    [
                      { key: 'nonveg' as EatFilter, label: '● Non-Veg', active: '#B71C1C' },
                      { key: 'veg' as EatFilter, label: '● Veg', active: '#2E7D32' },
                    ]
                  ).map(({ key, label, active }) => {
                    const isActive = eatFilter === key
                    return (
                      <button
                        key={key}
                        onClick={() => setEatFilter(key)}
                        className="font-sans text-[10px] tracking-[0.18em] uppercase px-5 py-2 border transition-all duration-200"
                        style={
                          isActive
                            ? {
                                backgroundColor: active,
                                borderColor: active,
                                color: '#FDFAF6',
                              }
                            : {
                                backgroundColor: 'transparent',
                                borderColor: 'rgba(26,17,8,0.20)',
                                color: 'rgba(26,17,8,0.52)',
                              }
                        }
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>

                {/* Cards */}
                <motion.div
                  key={eatFilter}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="grid gap-4 md:grid-cols-2 items-start"
                >
                  {filteredRestaurants.map((r) => (
                    <RestaurantCard key={r.name} r={r} />
                  ))}
                </motion.div>

                {/* Lucknow Essentials glossary */}
                <div
                  className="mt-12 pt-10"
                  style={{ borderTop: '1px solid rgba(26,17,8,0.08)' }}
                >
                  <p
                    className="font-sans text-[9px] tracking-[0.35em] uppercase text-center mb-6 text-terracotta"
                  >
                    Lucknow Essentials — a quick glossary
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
                    {SPECIALITIES.map((s) => (
                      <div key={s.name} className="flex gap-2">
                        <span className="font-serif text-dark text-sm shrink-0 pt-px whitespace-nowrap">
                          {s.name}
                        </span>
                        <span
                          className="font-sans text-xs leading-relaxed"
                          style={{ color: 'rgba(26,17,8,0.50)' }}
                        >
                          — {s.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── See ── */}
            {activeTab === 'see' && (
              <>
                <p className="font-sans text-sm italic text-center mb-8" style={{ color: 'rgba(26,17,8,0.52)' }}>
                  The city of nawabs has been here since the 18th century. Give it a few hours.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {SEE_ITEMS.map((item) => (
                    <PlaceCard key={item.name} item={item} />
                  ))}
                </div>
              </>
            )}

            {/* ── Know ── */}
            {activeTab === 'know' && (
              <>
                <p className="font-sans text-sm italic text-center mb-8" style={{ color: 'rgba(26,17,8,0.52)' }}>
                  Everything we wish someone had put in one place before we visited.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {KNOW_ITEMS.map((item) => (
                    <PlaceCard key={item.name} item={item} />
                  ))}
                </div>
              </>
            )}

            {/* ── Arrive ── */}
            {activeTab === 'arrive' && (
              <>
                <p className="font-sans text-sm italic text-center mb-8" style={{ color: 'rgba(26,17,8,0.52)' }}>
                  Golden Blossom Imperial Resorts, Lucknow — however you&rsquo;re getting here.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  {ARRIVE_MODES.map((mode) => (
                    <ArriveCard key={mode.id} mode={mode} />
                  ))}
                </div>
              </>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
