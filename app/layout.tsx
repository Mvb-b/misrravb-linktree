import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/ThemeContext'
import { ThemeToggle } from '../components/ThemeToggle'
import { VisitorCounterBadge } from '../components/VisitorCounterBadge'
import { KonamiEasterEgg } from '../components/KonamiEasterEgg'
import { LiveStatus } from '../components/LiveStatus'
import { AnalyticsDashboard } from '../components/AnalyticsDashboard'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ 
  subsets: ['latin'], 
  variable: '--font-orbitron',
  weight: ['400', '700', '900']
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0D0D0D',
}

export const metadata: Metadata = {
  title: {
    default: 'MisrraVB | Streamer Fracasado',
    template: '%s | MisrraVB',
  },
  description: '🎮 Links oficiales de MisrraVB - Seguime en Twitch, TikTok, Instagram y más. Contenido de streams y gaming.',
  keywords: ['MisrraVB', 'streamer', 'twitch', 'gamer', 'Misrain', 'Sebastian Valencia Bustos', 'gaming', 'esports', 'valorant', 'chile'],
  authors: [{ name: 'MisrraVB', url: 'https://dev-linktree.misrravb.com' }],
  creator: 'MisrraVB',
  publisher: 'MisrraVB',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'MisrraVB | Streamer Fracasado',
    description: '🎮 Links oficiales - Seguime en Twitch, TikTok, Instagram y más',
    url: 'https://dev-linktree.misrravb.com',
    siteName: 'MisrraVB Links',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'MisrraVB - Streamer Fracasado',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MisrraVB | Streamer Fracasado',
    description: '🎮 Links oficiales - Seguime en Twitch, TikTok, Instagram y más',
    creator: '@misrravb',
    site: '@misrravb',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://dev-linktree.misrravb.com',
    languages: {
      'es-CL': 'https://dev-linktree.misrravb.com',
    },
  },
  manifest: '/manifest.json',
  other: {
    'profile:first_name': 'Sebastian',
    'profile:last_name': 'Valencia Bustos',
    'profile:username': 'misrravb',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${orbitron.variable} ${inter.className}`}>
        <ThemeProvider>
          <LiveStatus />
          <ThemeToggle />
          {children}
          <VisitorCounterBadge />
          <AnalyticsDashboard />
          <KonamiEasterEgg />
        </ThemeProvider>
      </body>
    </html>
  )
}
