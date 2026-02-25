'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MousePointerClick, 
  Calendar,
  RefreshCw,
  ExternalLink,
  ArrowUpRight,
  Clock
} from 'lucide-react';

interface AnalyticsData {
  totalClicks: number;
  clicksLast24h: number;
  clicksByPlatform: { platform: string; count: number }[];
  trend: { date: string; count: number }[];
  topLinks: { platform: string; url: string; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(7);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/analytics/stats');
      const result = await res.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Error al cargar estadísticas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const getMaxClicks = () => {
    if (!data?.trend.length) return 1;
    return Math.max(...data.trend.map(d => d.count), 1);
  };

  const getMaxPlatformClicks = () => {
    if (!data?.clicksByPlatform.length) return 1;
    return Math.max(...data.clicksByPlatform.map(p => p.count), 1);
  };

  const platformColors: Record<string, string> = {
    twitch: 'bg-twitch-purple',
    tiktok: 'bg-pink-500',
    instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
    twitter: 'bg-blue-400',
    youtube: 'bg-red-500',
    facebook: 'bg-blue-600',
    newsletter: 'bg-fire-orange',
    default: 'bg-gray-500'
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
            LinkTree <span className="text-fire-orange">Analytics</span>
          </h1>
          <p className="text-gray-500 text-sm">Estadísticas de clicks en los enlaces</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-fire-orange/50"
          >
            <option value={7}>Últimos 7 días</option>
            <option value={14}>Últimos 14 días</option>
            <option value={30}>Últimos 30 días</option>
          </select>
          
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && !data && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-fire-orange/30 border-t-fire-orange rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando estadísticas...</p>
          </div>
        </div>
      )}

      {data && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-fire-orange/20 rounded-lg">
                  <MousePointerClick className="w-5 h-5 text-fire-orange" />
                </div>
                <span className="text-gray-400 text-sm">Total Clicks</span>
              </div>
              <p className="text-4xl font-bold text-white">{data.totalClicks}</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-gray-400 text-sm">Últimas 24h</span>
              </div>
              <p className="text-4xl font-bold text-white">{data.clicksLast24h}</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-twitch-purple/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-twitch-purple" />
                </div>
                <span className="text-gray-400 text-sm">Plataformas Activas</span>
              </div>
              <p className="text-4xl font-bold text-white">{data.clicksByPlatform.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-fire-orange" />
                Clicks por Día
              </h2>
              
              {data.trend.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay datos suficientes</p>
              ) : (
                <div className="flex items-end gap-2 h-48">
                  {data.trend.map((day, i) => {
                    const height = (day.count / getMaxClicks()) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex-1 flex items-end">
                          <div 
                            className="w-full bg-gradient-to-t from-fire-orange to-fire-coral rounded-t-md transition-all hover:opacity-80"
                            style={{ height: `${height}%` }}
                            title={`${day.count} clicks`}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(day.date).toLocaleDateString('es-CL', { weekday: 'short' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Days labels */}
              <div className="mt-4 flex justify-between text-xs text-gray-500">
                <span>{data.trend[0]?.date || '-'}</span>
                <span>{data.trend[data.trend.length - 1]?.date || '-'}</span>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-fire-orange" />
                Por Plataforma
              </h2>
              
              {data.clicksByPlatform.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay datos suficientes</p>
              ) : (
                <div className="space-y-4">
                  {data.clicksByPlatform
                    .sort((a, b) => b.count - a.count)
                    .map((platform) => {
                      const percent = (platform.count / getMaxPlatformClicks()) * 100;
                      return (
                        <div key={platform.platform} className="flex items-center gap-4">
                          <span className="w-24 text-sm text-gray-400 capitalize">{platform.platform}</span>
                          <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${platformColors[platform.platform] || platformColors.default}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-white w-12 text-right">{platform.count}</span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Top Links */}
            <div className="glass-card p-6 rounded-xl lg:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-fire-orange" />
                Links Más Clickeados
              </h2>
              
              {data.topLinks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay datos suficientes</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left pb-4 text-gray-400 font-medium text-sm">#</th>
                        <th className="text-left pb-4 text-gray-400 font-medium text-sm">Plataforma</th>
                        <th className="text-left pb-4 text-gray-400 font-medium text-sm">URL</th>
                        <th className="text-right pb-4 text-gray-400 font-medium text-sm">Clicks</th>
                        <th className="text-right pb-4 text-gray-400 font-medium text-sm">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topLinks.map((link, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="py-4 text-gray-500">{i + 1}</td>
                          <td className="py-4">
                            <span className="capitalize text-white">{link.platform}</span>
                          </td>
                          <td className="py-4">
                            <span className="text-gray-400 text-sm truncate max-w-xs block">
                              {link.url}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-fire-orange font-semibold">{link.count}</span>
                          </td>
                          <td className="py-4 text-right">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-gray-400 hover:text-fire-orange transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
