'use client'

import { useState, useEffect } from 'react'
import { Radio, Circle } from 'lucide-react'

export function LiveStatus() {
  const [isLive, setIsLive] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)

  useEffect(() => {
    // Simulate checking Twitch status (replace with real API call)
    const checkLiveStatus = async () => {
      // Mock: random live status for demo
      const mockLive = Math.random() > 0.7
      setIsLive(mockLive)
      if (mockLive) {
        setViewerCount(Math.floor(Math.random() * 50) + 5)
      }
    }

    checkLiveStatus()
    const interval = setInterval(checkLiveStatus, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  if (!isLive) {
    return (
      <a
        href="https://www.twitch.tv/misrravb"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 left-4 z-40 glass-card px-4 py-2 rounded-full flex items-center gap-2 opacity-60 hover:opacity-100 transition-all"
      >
        <Circle size={10} className="fill-gray-500 text-gray-500" />
        <span className="text-sm text-gray-400">Offline</span>
      </a>
    )
  }

  return (
    <a
      href="https://www.twitch.tv/misrravb"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-4 left-4 z-40 glass-card px-4 py-2 rounded-full flex items-center gap-2 bg-red-500/20 border-red-500/30 hover:scale-105 transition-all animate-pulse"
    >
      <Radio size={16} className="text-red-500 animate-pulse" />
      <span className="text-sm font-semibold text-red-400">LIVE</span>
      <span className="text-xs text-red-300">{viewerCount} viewers</span>
    </a>
  )
}
