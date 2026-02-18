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
  title: 'MisrraVB | Streamer Fracasado',
  description: '🎮 Links oficiales de MisrraVB - Seguime en Twitch, TikTok, Instagram y más. Contenido de streams y gaming.',
  keywords: ['MisrraVB', 'streamer', 'twitch', 'gamer', 'Misrain', 'Sebastian Valencia Bustos', 'gaming', 'esports'],
  authors: [{ name: 'MisrraVB' }],
  creator: 'MisrraVB',
  publisher: 'MisrraVB',
  robots: 'index, follow',
  openGraph: {
    title: 'MisrraVB | Streamer Fracasado',
    description: '🎮 Links oficiales - Seguime en Twitch, TikTok, Instagram y más',
    url: 'https://dev-linktree.misrravb.com',
    siteName: 'MisrraVB Links',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MisrraVB | Streamer Fracasado',
    description: '🎮 Links oficiales - Seguime en Twitch, TikTok, Instagram y más',
    creator: '@misrravb',
  },
  alternates: {
    canonical: 'https://dev-linktree.misrravb.com',
  },
  manifest: '/manifest.json',
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
