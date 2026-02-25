'use client'

import { useState, useEffect } from 'react'
import { Radio, Circle, AlertCircle } from 'lucide-react'

interface TwitchData {
  isLive: boolean
  viewers: number
  title: string
  game: string
  thumbnail: string
  error?: string
  fallback?: boolean
}

export function LiveStatus() {
  const [data, setData] = useState<TwitchData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const response = await fetch('/api/twitch/live')
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch Twitch status:', error)
        setData({
          isLive: false,
          viewers: 0,
          title: '',
          game: '',
          thumbnail: '',
          error: 'Failed to fetch',
        })
      } finally {
        setLoading(false)
      }
    }

    checkLiveStatus()
    const interval = setInterval(checkLiveStatus, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="fixed top-4 left-4 z-40 glass-card px-4 py-2 rounded-full flex items-center gap-2 opacity-50">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
        <span className="text-sm text-gray-400">Cargando...</span>
      </div>
    )
  }

  // Error / Fallback state (show as offline but clickable)
  if (!data || data.error) {
    return (
      <a
        href="https://www.twitch.tv/misrravb"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 left-4 z-40 glass-card px-4 py-2 rounded-full flex items-center gap-2 opacity-60 hover:opacity-100 transition-all"
        title={data?.error || 'Ver en Twitch'}
      >
        <Circle size={10} className="fill-gray-500 text-gray-500" />
        <span className="text-sm text-gray-400">Twitch</span>
        {data?.fallback && (
          <AlertCircle size={14} className="text-yellow-500" />
        )}
      </a>
    )
  }

  // Offline state
  if (!data.isLive) {
    return (
      <a
        href="https://www.twitch.tv/misrravb"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 left-4 z-40 glass-card px-4 py-2 rounded-full flex items-center gap-2 opacity-60 hover:opacity-100 transition-all hover:scale-105 group"
      >
        <Circle size={10} className="fill-gray-500 text-gray-500 group-hover:fill-gray-400" />
        <span className="text-sm text-gray-400 group-hover:text-gray-300">Offline</span>
      </a>
    )
  }

  // Live state
  return (
    <a
      href="https://www.twitch.tv/misrravb"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-4 left-4 z-50 glass-card px-4 py-3 rounded-xl flex flex-col gap-1 bg-red-500/10 border-red-500/30 hover:scale-105 transition-all animate-pulse min-w-[200px]"
    >
      {/* Live badge */}
      <div className="flex items-center gap-2">
        <Radio size={18} className="text-red-500 animate-pulse" />
        <span className="font-semibold text-red-400">LIVE</span>
        <span className="text-sm text-red-300">{data.viewers.toLocaleString('es-CL')} espectadores</span>
      </div>

      {/* Title (truncated) */}
      {data.title && (
        <p className="text-xs text-white/90 truncate font-medium" title={data.title}>
          {data.title}
        </p>
      )}

      {/* Game */}
      {data.game && (
        <p className="text-xs text-red-300/70">
          {data.game}
        </p>
      )}

      {/* Thumbnail preview */}
      {data.thumbnail && (
        <div className="mt-2 rounded overflow-hidden border border-red-500/20">
          <img
            src={data.thumbnail}
            alt="Stream preview"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      )}
    </a>
  )
}
