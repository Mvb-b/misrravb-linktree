'use client'

import { useEffect, useState } from 'react'
import { Gamepad2, X } from 'lucide-react'

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
]

export function KonamiEasterEgg() {
  const [activated, setActivated] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    let currentIndex = 0
    let hintTimer: NodeJS.Timeout

    // Show hint after 30 seconds
    hintTimer = setTimeout(() => {
      if (!activated) setShowHint(true)
    }, 30000)

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const expectedKey = KONAMI_CODE[currentIndex].toLowerCase()

      if (key === expectedKey) {
        currentIndex++
        setProgress(currentIndex)
        
        if (currentIndex === KONAMI_CODE.length) {
          setActivated(true)
          setShowHint(false)
          currentIndex = 0
        }
      } else {
        currentIndex = 0
        setProgress(0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(hintTimer)
    }
  }, [activated])

  if (!activated && !showHint) return null

  return (
    <>
      {/* Success Modal */}
      {activated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center animate-bounce-in">
            <div className="mb-4">
              <Gamepad2 size={64} className="mx-auto text-fire-orange animate-spin-slow" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              ¡CÓDIGO KONAMI!
            </h2>
            <p className="text-gray-300 mb-6">
              Has desbloqueado el modo SECRETO.
              <br />
              <span className="text-fire-orange">+30 vidas (no, es broma)</span>
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setActivated(false)}
                className="glass-card px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-fire-orange/20 transition-all"
              >
                <X size={18} />
                <span>Cerrar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      {showHint && !activated && progress > 0 && (
        <div className="fixed bottom-20 left-4 z-40 glass-card px-3 py-2 rounded-lg">
          <div className="flex gap-1">
            {[...Array(KONAMI_CODE.length)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i < progress ? 'bg-fire-orange' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  )
}
