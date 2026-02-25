'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  FileText,
  Calendar,
  ArrowLeft
} from 'lucide-react';

interface Devotional {
  id: number;
  title: string;
  content: string;
  devotional_date: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export default function DevotionalsAdmin() {
  const router = useRouter();
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDevotionals();
  }, [statusFilter, showDeleted]);

  const fetchDevotionals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (showDeleted) params.append('includeDeleted', 'true');

      const res = await fetch(`/api/admin/devotionals?${params}`);
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (res.status === 403) {
          setError('No tienes permisos de administrador');
          return;
        }
        throw new Error('Failed to fetch devotionals');
      }
      const data = await res.json();
      setDevotionals(data.devotionals || []);
    } catch (err) {
      setError('Error al cargar los devocionales');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, action: 'soft' | 'restore' = 'soft') => {
    if (action === 'soft' && !confirm('¿Estás seguro de que quieres eliminar este devocional?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/devotionals?id=${id}&action=${action}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchDevotionals();
      } else {
        setError('Error al eliminar/restaurar el devocional');
      }
    } catch {
      setError('Error al procesar la solicitud');
    }
  };

  const filteredDevotionals = devotionals.filter(
    (dev) =>
      dev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-xl p-8">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-white/10 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-12 bg-white/5 rounded"></div>
                  <div className="h-12 bg-white/5 rounded"></div>
                  <div className="h-12 bg-white/5 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="glass-card p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Volver al inicio"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold fire-glow">Panel de Devocionales</h1>
          </div>
          <p className="text-gray-400">
            Administra los devocionales diarios del stream
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-card border-red-500/50 bg-red-500/10 p-4 rounded-xl mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar devocional..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-[#FF6B35] transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-[#FF6B35] transition-colors cursor-pointer"
              >
                <option value="all">Todos</option>
                <option value="published">Publicados</option>
                <option value="draft">Borradores</option>
              </select>

              <label className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                <input
                  type="checkbox"
                  checked={showDeleted}
                  onChange={(e) => setShowDeleted(e.target.checked)}
                  className="w-4 h-4 accent-[#FF6B35]"
                />
                <span className="text-sm">Ver eliminados</span>
              </label>

              <Link
                href="/admin/devotionals/new"
                className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF8C69] text-white rounded-lg transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Nuevo
              </Link>
            </div>
          </div>
        </div>

        {/* Devotionals Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Título</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Fecha</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Estado</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Actualizado</th>
                  <th className="text-right px-6 py-4 text-gray-400 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDevotionals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="w-12 h-12 text-gray-600" />
                        <p>No se encontraron devocionales</p>
                        {searchQuery && (
                          <p className="text-sm text-gray-500">
                            Intenta con otra búsqueda
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDevotionals.map((devotional) => (
                    <tr
                      key={devotional.id}
                      className={devotional.deleted_at ? 'opacity-50' : ''}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {devotional.deleted_at && (
                            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                              Eliminado
                            </span>
                          )}
                          <span className={devotional.deleted_at ? 'line-through' : ''}>
                            {devotional.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {formatDate(devotional.devotional_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            devotional.status === 'published'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {devotional.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {formatDate(devotional.updated_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {devotional.deleted_at ? (
                            <button
                              onClick={() => handleDelete(devotional.id, 'restore')}
                              className="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-green-400"
                              title="Restaurar"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <>
                              <Link
                                href={`/admin/devotionals/${devotional.id}/edit`}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(devotional.id, 'soft')}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400">
          <p>
            Mostrando {filteredDevotionals.length} de {devotionals.length} devocionales
          </p>
          {showDeleted && (
            <p className="text-red-400">
              {devotionals.filter((d) => d.deleted_at).length} eliminados
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
