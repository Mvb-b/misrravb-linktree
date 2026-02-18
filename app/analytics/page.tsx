'use client'

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MousePointerClick, 
  TrendingUp, 
  Clock, 
  Globe,
  ArrowLeft,
  RefreshCw,
  Activity,
  Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';

interface AnalyticsData {
  totalClicks: number;
  clicksLast24h: number;
  clicksByPlatform: { platform: string; count: number }[];
  trend: { date: string; count: number }[];
  topLinks: { platform: string; url: string; count: number }[];
}

const platformColors: Record<string, string> = {
  twitch: '#9146FF',
  tiktok: '#00F2EA',
  instagram: '#E1306C',
  twitter: '#1DA1F2',
  youtube: '#FF0000',
  facebook: '#1877F2',
};

function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/stats');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError('Error al cargar estadísticas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-dark-bg p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="glass-card p-3 rounded-xl hover:border-fire-orange/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-fire-orange" />
            </Link>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
                <span className="text-fire-orange">Analytics</span> Dashboard
              </h1>
              <p className="text-gray-500 text-sm">Métricas de clicks en tiempo real</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-gray-500 text-sm">Actualizado: {lastUpdated.toLocaleTimeString('es-CL')}</span>
            )}
            <button onClick={fetchData} disabled={loading} className="glass-card p-3 rounded-xl hover:border-fire-orange/50 transition-all disabled:opacity-50">
              <RefreshCw className={`w-5 h-5 text-fire-orange ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {loading && !data ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-fire-orange/30 border-t-fire-orange rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Cargando métricas...</p>
            </div>
          </div>
        ) : error ? (
          <div className="glass-card p-8 rounded-xl text-center">
            <Activity className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-400">{error}</p>
            <button onClick={fetchData} className="mt-4 px-4 py-2 bg-fire-orange/20 text-fire-orange rounded-lg hover:bg-fire-orange/30 transition-colors">
              Reintentar
            </button>
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-fire-orange/20 rounded-lg">
                    <MousePointerClick className="w-5 h-5 text-fire-orange" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{formatNumber(data.totalClicks)}</p>
                <p className="text-gray-500 text-sm">Total Clicks</p>
              </div>
              
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{formatNumber(data.clicksLast24h)}</p>
                <p className="text-gray-500 text-sm">Últimas 24h</p>
              </div>
              
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{data.clicksByPlatform.length}</p>
                <p className="text-gray-500 text-sm">Plataformas</p>
              </div>
              
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{data.trend[data.trend.length - 1]?.count || 0}</p>
                <p className="text-gray-500 text-sm">Clicks Hoy</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-fire-orange/20 rounded-lg">
                    <Globe className="w-5 h-5 text-fire-orange" />
                  </div>
                  <h2 className="font-display text-lg font-semibold">Clicks por Plataforma</h2>
                </div>
                
                {data.clicksByPlatform.length > 0 ? (
                  <div className="space-y-4">
                    {data.clicksByPlatform.map((item) => {
                      const max = Math.max(...data.clicksByPlatform.map(p => p.count), 1);
                      const percentage = (item.count / max) * 100;
                      const color = platformColors[item.platform] || '#FF6B35';
                      
                      return (
                        <div key={item.platform}>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="flex items-center gap-2 capitalize text-white">
                              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: color }} />
                              {item.platform}
                            </span>
                            <span className="text-gray-400">{item