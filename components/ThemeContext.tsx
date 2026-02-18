'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'dark' | 'streamer'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isStreamer: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('misrra-theme') as Theme
    if (saved === 'streamer') setTheme('streamer')
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('misrra-theme', theme)
    
    if (theme === 'streamer') {
      document.documentElement.classList.add('streamer-mode')
    } else {
      document.documentElement.classList.remove('streamer-mode')
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'streamer' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isStreamer: theme === 'streamer' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
