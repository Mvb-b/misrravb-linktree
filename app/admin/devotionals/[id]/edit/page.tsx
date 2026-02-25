'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, FileText, Calendar, AlignLeft, CheckCircle, BookOpen } from 'lucide-react';

interface Devotional {
  id: number;
  title: string;
  content: string;
  devotional_date: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export default function EditDevotionalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Devotional | null>(null);

  const devotionalId = params.id;

  useEffect(() => {
    if (!devotionalId) return;
    fetchDevotional();
  }, [devotionalId]);

  const fetchDevotional = async () => {
    try {
      const res = await fetch(`/api/admin/devotionals?id=${devotionalId}`);
      const data = await res.json();
      if (data.devotional) {
        setForm(data.devotional);
      } else {
        setError('Devocional no encontrado');
      }
    } catch (err) {
      setError('Error cargando el devocional');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setError('');
    setSaving(true);

    try {
      const res = await fetch('/api/admin/devotionals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(devotionalId),
          title: form.title,
          content: form.content,
          devotional_date: form.devotional_date,
          status: form.status
        })
      });

      if (res.ok) {
        router.push('/admin/devotionals');
      } else {
        const data = await res.json();
        setError(data.error || 'Error al actualizar');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
            <p className="text-red-400">{error || 'Devocional no encontrado'}</p>
            <Link href="/admin/devotionals" className="text-orange-400 hover:text-orange-300 mt-4 inline-block">
              Volver a devocionales
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/devotionals" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Volver a devocionales
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-orange-500" />
            Editar Devocional #{devotionalId}
          </h1>
        </div>

        {error && (
          <div className="bg-gray-900/50 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" /> Título
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(f => f ? ({ ...f, title: e.target.value }) : null)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" /> Fecha del devocional
              </label>
              <input
                type="date"
                value={form.devotional_date}
                onChange={(e) => setForm(f => f ? ({ ...f, devotional_date: e.target.value }) : null)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-gray-500" /> Contenido
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm(f => f ? ({ ...f, content: e.target.value }) : null)}
                rows={12}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-500" /> Estado
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={form.status === 'draft'}
                    onChange={(e) => setForm(f => f ? ({ ...f, status: e.target.value as 'draft' | 'published' }) : null)}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-gray-300">Borrador</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={form.status === 'published'}
                    onChange={(e) => setForm(f => f ? ({ ...f, status: e.target.value as 'draft' | 'published' }) : null)}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-gray-300">Publicado</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Link
              href="/admin/devotionals"
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center border border-gray-700"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}