'use client'

import { useRouter } from 'next/navigation'
import { Ghost, ArrowLeft, Home, Skull } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-fire-orange/30 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Glitch effect container */}
      <div className="relative z-10 text-center">
        {/* 404 with glitch effect */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-black font-display text-white relative z-10 glitch-text">
            404
          </h1>
          <div className="absolute inset-0 text-8xl md:text-9xl font-black font-display text-fire-orange/50 glitch-layer-1">
            404
          </div>
          <div className="absolute inset-0 text-8xl md:text-9xl font-black font-display text-twitch-purple/50 glitch-layer-2">
            404
          </div>
        </div>

        {/* Ghost Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Ghost size={80} className="text-white/80 animate-bounce-slow" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/30 rounded-full blur-md" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 fire-glow">
          Fantasma en el servidor
        </h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8 text-lg">
          Esta página se evaporó como mis viewers cuando prendo stream.
          <br />
          <span className="text-fire-orange">Ni el RAID te salva de este error.</span>
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="glass-card px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all hover:-translate-y-1 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Volver atrás</span>
          </button>
          
          <a
            href="/"
            className="glass-card px-6 py-3 rounded-xl flex items-center justify-center gap-2 bg-fire-orange/20 border-fire-orange/30 hover:bg-fire-orange/30 transition-all hover:-translate-y-1 group"
          >
            <Home size={20} />
            <span>Ir al inicio</span>
          </a>
        </div>
      </div>

      {/* CSS for glitch effect */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.6; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); opacity: 0; }
          20% { transform: translate(-3px, 3px); opacity: 0.5; }
          40% { transform: translate(-3px, -3px); opacity: 0.5; }
          60% { transform: translate(3px, 3px); opacity: 0; }
        }
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); opacity: 0; }
          20% { transform: translate(3px, -3px); opacity: 0.5; }
          40% { transform: translate(3px, 3px); opacity: 0.5; }
          60% { transform: translate(-3px, -3px); opacity: 0; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .glitch-text {
          animation: glitch-text 0.5s ease-in-out infinite alternate;
        }
        .glitch-layer-1 {
          animation: glitch-1 3s infinite linear;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        }
        .glitch-layer-2 {
          animation: glitch-2 3s infinite linear;
          animation-delay: 0.1s;
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
        }
      `}</style>
    </div>
  )
}
