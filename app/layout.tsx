import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import SideGate from '@/components/SideGate'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: '#KatMetMi — Katyayani & Mihir',
  description: 'Katyayani & Mihir are getting married — and we\'d love for you to be there. 26 November 2026 · Lucknow.',
  openGraph: {
    title: 'Katyayani & Mihir — 26 · 11 · 2026',
    description: 'Katyayani & Mihir are getting married — and we\'d love for you to be there. 26 November 2026 · Lucknow.',
    images: [{ url: '/engagement.jpeg', width: 1080, height: 1350, alt: 'Katyayani & Mihir' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Katyayani & Mihir — 26 · 11 · 2026',
    description: 'Katyayani & Mihir are getting married — and we\'d love for you to be there. 26 November 2026 · Lucknow.',
    images: ['/engagement.jpeg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full">
        <SideGate />
        {children}
      </body>
    </html>
  )
}
