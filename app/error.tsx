'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, RefreshCcw, Home, Bomb } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('💥 Error crítico:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Explosion particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-explode"
            style={{
              left: '50%',
              top: '40%',
              backgroundColor: i % 2 === 0 ? '#FF6B35' : '#9146FF',
              animationDelay: `${i * 0.1}s`,
              transform: `rotate(${i * 45}deg) translateX(${50 + i * 20}px)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* 500 Badge */}
        <div className="mb-8 relative inline-block">
          <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full" />
          <h1 className="relative text-7xl md:text-8xl font-black font-display text-white glitch-text-red">
            500
          </h1>
        </div>

        {/* Explosion Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative animate-pulse">
            <Bomb size={64} className="text-red-400" />
            <div className="absolute inset-0 bg-red-500/40 blur-xl rounded-full" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
          <span className="text-red-400">💥</span> Server Exploded <span className="text-red-400">💥</span>
        </h2>

        {/* Message */}
        <p className="text-gray-400 max-w-lg mx-auto mb-6 text-lg">
          Algo se rompió peor que mi KDA en ranked.
          <br />
          <span className="text-fire-orange">Ni F8 va a salvar esto.</span>
        </p>

        {/* Error details (collapsible) */}
        {error.digest && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg inline-block">
            <p className="text-xs text-red-400 font-mono">Error ID: {error.digest}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="glass-card px-6 py-3 rounded-xl flex items-center justify-center gap-2 border-red-500/30 hover:bg-red-500/20 transition-all hover:-translate-y-1 group"
          >
            <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            <span>Reintentar</span>
          </button>

          <a
            href="/"
            className="glass-card px-6 py-3 rounded-xl flex items-center justify-center gap-2 bg-fire-orange/20 border-fire-orange/30 hover:bg-fire-orange/30 transition-all hover:-translate-y-1"
          >
            <Home size={20} />
            <span>Refugio seguro</span>
          </a>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes explode {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes glitch-red {
          0%, 100% { text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
          25% { text-shadow: -2px 0 #ff0000, 2px 0 #00ffff; }
          50% { text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
          75% { text-shadow: -2px 0 #ff0000, 2px 0 #00ffff; }
        }
        .animate-explode {
          animation: explode 1.5s ease-out forwards;
        }
        .glitch-text-red {
          animation: glitch-red 0.3s infinite;
        }
      `}</style>
    </div>
  )
}
