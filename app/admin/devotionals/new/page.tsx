'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, FileText, Calendar, AlignLeft, CheckCircle, BookOpen } from 'lucide-react';

export default function NewDevotionalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    devotional_date: new Date().toISOString().split('T')[0],
    status: 'draft'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.title.trim() || !form.content.trim() || !form.devotional_date) {
      setError('El título, contenido y fecha son obligatorios');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/devotionals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content,
          devotional_date: form.devotional_date,
          status: form.status
        })
      });

      if (res.ok) {
        router.push('/admin/devotionals');
      } else {
        const data = await res.json();
        setError(data.error || 'Error al guardar el devocional');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/devotionals"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a devocionales
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#FF6B35]" />
            Nuevo Devocional
          </h1>
          <p className="text-gray-400 mt-2">Crea un nuevo devocional diario</p>
        </div>

        {/* Error */}
        {error && (
          <div className="glass-card border-red-500/50 bg-red-500/10 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                Título
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ej: Fe en tiempos difíciles"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Fecha del devocional
              </label>
              <input
                type="date"
                value={form.devotional_date}
                min={today}
                onChange={(e) => setForm(f => ({ ...f, devotional_date: e.target.value }))}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF6B35] transition-colors"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-gray-500" />
                Contenido
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Escribe el contenido del devocional aquí..."
                rows={12}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors resize-y"
              />
              <p className="text-xs text-gray-500 mt-2">
                Puedes usar saltos de línea para formatear el texto. El contenido es compatible con HTML si lo necesitas.
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-500" />
                Estado
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={form.status === 'draft'}
                    onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-4 h-4 accent-[#FF6B35]"
                  />
                  <span className="text-gray-300">Borrador</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={form.status === 'published'}
                    onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-4 h-4 accent-[#FF6B35]"
                  />
                  <span className="text-gray-300">Publicado</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <Link
              href="/admin/devotionals"
              className="flex-1 bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center border border-white/20"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#FF6B35] hover:bg-[#FF8C69] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Devocional
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
