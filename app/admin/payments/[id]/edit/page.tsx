'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, User, DollarSign, Calendar, FileText, CheckCircle } from 'lucide-react';

interface Payment {
  id: number; paymentRecorderId: string; amount: number; date: string;
  description: string; status: 'pending' | 'completed' | 'cancelled';
}

export default function EditPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Payment | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    try {
      const res = await fetch(`/api/admin/payments?id=${id}`);
      const data = await res.json();
      if (data.payments && data.payments[0]) {
        setForm(data.payments[0]);
      } else {
        setError('Pago no encontrado');
      }
    } catch (err) {
      setError('Error cargando el pago');
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
      const res = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(id),
          paymentRecorderId: form.paymentRecorderId,
          amount: form.amount,
          date: form.date,
          description: form.description,
          status: form.status
        })
      });

      if (res.ok) {
        router.push('/admin/payments');
      } else {
        const data = await res.json();
        setError(data.error || 'Error al actualizar');
      }
    } catch (err) {
      setError('Error de conexion');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-gray-100 p-4 md:p-6 flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-gray-100 p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
            <p className="text-red-400">{error || 'Pago no encontrado'}</p>
            <Link href="/admin/payments" className="text-violet-400 hover:text-violet-300 mt-4 inline-block">
              Volver a pagos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/payments" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Volver a pagos
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-violet-500" />
            Editar Pago #{id}
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" /> Usuario (ID)
              </label>
              <input
                type="text"
                value={form.paymentRecorderId}
                onChange={(e) => setForm(f => f ? ({ ...f, paymentRecorderId: e.target.value }) : null)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" /> Monto
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm(f => f ? ({ ...f, amount: parseFloat(e.target.value) || 0 }) : null)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" /> Fecha
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm(f => f ? ({ ...f, date: e.target.value }) : null)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" /> Descripcion
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(f => f ? ({ ...f, description: e.target.value }) : null)}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-500" /> Estado
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm(f => f ? ({ ...f, status: e.target.value as any }) : null)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-violet-500"
              >
                <option value="pending">Pendiente</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Link
              href="/admin/payments"
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> ) : ( <> <Save className="w-5 h-5" /> Guardar Cambios </> )} </button> </div> </form> </div> </div> ); }
