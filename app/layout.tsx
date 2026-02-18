import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/ThemeContext'
import { ThemeToggle } from '../components/ThemeToggle'
import { VisitorCounterBadge } from '../components/VisitorCounterBadge'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ 
  subsets: ['latin'], 
  variable: '--font-orbitron',
  weight: ['400', '700', '900']
})

export const metadata: Metadata = {
  title: 'MisrraVB | Streamer Fracasado',
  description: 'Links oficiales de MisrraVB - Twitch, TikTok, Instagram y más',
  keywords: ['MisrraVB', 'streamer', 'twitch', 'gamer', 'Misrain Sebastián Valencia Bustos'],
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
          <ThemeToggle />
          {children}
          <VisitorCounterBadge />
        </ThemeProvider>
      </body>
    </html>
  )
}
