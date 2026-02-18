'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, MousePointerClick, Calendar } from 'lucide-react'

interface AnalyticsData {
  totalClicks: number
  lastUpdated: string
  platformStats: Record<string, number>
  dailyStats: Record<string, number>
  recentClicks: Array<{
    platform: string
    timestamp: string
  }>
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/click')
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchData()
      const interval = setInterval(fetchData, 30000) // Refresh every 30s
      return () => clearInterval(interval)
    }
  }, [isOpen])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 z-40 glass-card p-3 rounded-full hover:scale-110 transition-all hover:bg-fire-orange/20"
        title="Ver estadísticas"
      >
        <BarChart3 size={20} className="text-fire-orange" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-fire-orange/20 rounded-lg">
              <BarChart3 size={24} className="text-fire-orange" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white">Analytics</h2>
              <p className="text-sm text-gray-400">Clicks en links</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-fire-orange/30 border-t-fire-orange rounded-full animate-spin" />
          </div>
        ) : data ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-card p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <MousePointerClick size={16} className="text-fire-orange" />
                  <span className="text-sm text-gray-400">Total Clicks</span>
                </div>
                <p className="text-3xl font-bold text-white">{data.totalClicks}</p>
              </div>
              
              <div className="glass-card p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-green-400" />
                  <span className="text-sm text-gray-400">Plataformas</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {Object.keys(data.platformStats).length}
                </p>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <BarChart3 size={14} /> Por Plataforma
              </h3>
              <div className="space-y-2">
                {Object.entries(data.platformStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([platform, count]) => {
                    const max = Math.max(...Object.values(data.platformStats))
                    const percent = max > 0 ? (count / max) * 100 : 0
                    return (
                      <div key={platform} className="flex items-center gap-3">
                        <span className="w-20 text-sm text-gray-400 capitalize">{platform}</span>
                        <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-fire-orange to-twitch-purple rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-white w-8 text-right">{count}</span>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <Calendar size={14} /> Actividad Reciente
              </h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {data.recentClicks
                  .slice()
                  .reverse()
                  .slice(0, 10)
                  .map((click, i) => (
                    <div key={i} className="flex justify-between text-sm py-1 border-b border-white/5">
                      <span className="text-gray-300 capitalize">{click.platform}</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(click.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-center py-8">No data yet</p>
        )}
      </div>
    </div>
  )
}
