'use client'

import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'

export function VisitorCounterBadge() {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get stored count
    const stored = localStorage.getItem('misrra-visit-count')
    let currentCount = stored ? parseInt(stored, 10) : 0
    
    // Check if this is a new session
    const lastVisit = sessionStorage.getItem('misrra-session')
    if (!lastVisit) {
      currentCount += 1
      localStorage.setItem('misrra-visit-count', currentCount.toString())
      sessionStorage.setItem('misrra-session', 'active')
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
    
    // Animate the number
    const target = currentCount
    let display = 0
    const increment = target / 20
    const timer = setInterval(() => {
      display += increment
      if (display >= target) {
        display = target
        clearInterval(timer)
      }
      setCount(Math.floor(display))
    }, 50)

    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <div 
      className={`
        fixed bottom-4 right-4 z-50 
        glass-card px-4 py-2 rounded-full 
        flex items-center gap-2 
        transition-all duration-300
        ${isAnimating ? 'scale-110 animate-pulse' : ''}
      `}
    >
      <Eye size={18} className="text-fire-orange" />
      <span className="text-sm font-semibold text-white">{formatNumber(count)}</span>
      <span className="text-xs text-gray-400">visitas</span>
    </div>
  )
}
