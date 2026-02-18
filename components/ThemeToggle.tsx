'use client'

import { useTheme } from './ThemeContext'
import { Crown, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme, isStreamer } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 glass-card p-3 rounded-full transition-all duration-300 hover:scale-110"
      title={isStreamer ? 'Modo Streamer' : 'Modo Normal'}
    >
      {isStreamer ? (
        <Crown size={24} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
      ) : (
        <Moon size={24} className="text-gray-400 hover:text-white" />
      )}
    </button>
  )
}
