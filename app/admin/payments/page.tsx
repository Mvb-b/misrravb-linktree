'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Calendar, Edit2, Trash2, TrendingUp, CreditCard, CheckCircle, XCircle, Clock, User, DollarSign } from 'lucide-react';

interface Payment {
  id: number; paymentRecorderId: string; amount: number; date: string;
  description: string; status: 'pending' | 'completed' | 'cancelled';
  createdAt: string; updatedAt: string;
}

interface PaymentSummary {
  totalCompleted: number; totalPending: number; totalAmount: number;
  countCompleted: number; countPending: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: '', recorderId: '' });
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
      if (filters.status) params.set('status', filters.status);
      if (filters.recorderId) params.set('recorderId', filters.recorderId);
      
      const [paymentsRes, summaryRes] = await Promise.all([
        fetch(`/api/admin/payments?${params}`),
        fetch('/api/admin/payments?summary=true')
      ]);
      
      setPayments((await paymentsRes.json()).payments || []);
      setSummary((await summaryRes.json()).summary);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const applyFilters = (e: React.FormEvent) => { e.preventDefault(); fetchData(); };
  const clearFilters = () => { setFilters({ startDate: '', endDate: '', status: '', recorderId: '' }); fetchData(); };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar este pago?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/payments?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } finally { setDeleting(null); }
  };

  const statusConfig = {
    completed: { label: 'Completado', class: 'bg-green-500/20 text-green-400 border-green-500/30' },
    pending: { label: 'Pendiente', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    cancelled: { label: 'Cancelado', class: 'bg-red-500/20 text-red-400 border-red-500/30' }
  };

  const Stats = () => {
    if (!summary) return null;
    const stats = [
      { icon: TrendingUp, color: 'green', label: 'Completado', value: `$${summary.totalCompleted.toLocaleString('es-CL')}`, count: `${summary.countCompleted} pagos` },
      { icon: Clock, color: 'yellow', label: 'Pendiente', value: `$${summary.totalPending.toLocaleString('es-CL')}`, count: `${summary.countPending} pagos` },
      { icon: DollarSign, color: 'violet', label: 'Total', value: `$${summary.totalAmount.toLocaleString('es-CL')}`, count: `${summary.countCompleted + summary.countPending} pagos` },
      { icon: User, color: 'blue', label: 'Promedio', value: `$${(summary.totalAmount / Math.max(summary.countCompleted + summary.countPending, 1)).toFixed(0)}`, count: 'por pago' },
    ];
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 bg-${s.color}-500/20 rounded-lg`}>
                <s.icon className={`w-4 h-4 text-${s.color}-400`} />
              </div>
              <span className="text-xs text-gray-400">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-[10px] text-gray-500 mt-1">{s.count}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <CreditCard className="w-7 h-7 md:w-8 md:h-8 text-violet-500" />
                Administracion de Pagos
              </h1>
              <p className="text-gray-400">Gestiona los pagos manuales registrados</p>
            </div>
            <Link href="/admin/payments/new" className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
              <Plus className="w-5 h-5" /> Nuevo Pago
            </Link>
          </div>
        </div>

        <Stats />

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6">
          <form onSubmit={applyFilters} className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs text-gray-400 mb-1">Desde</label>
              <input type="date" value={filters.startDate} onChange={(e) => setFilters(p => ({ ...p, startDate: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs text-gray-400 mb-1">Hasta</label>
              <input type="date" value={filters.endDate} onChange={(e) => setFilters(p => ({ ...p, endDate: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs text-gray-400 mb-1">Estado</label>
              <select value={filters.status} onChange={(e) => setFilters(p => ({ ...p, status: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm">
                <option value="">Todos</option>
                <option value="pending">Pendiente</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs text-gray-400 mb-1">Usuario</label>
              <input type="text" placeholder="ID de usuario..." value={filters.recorderId} onChange={(e) => setFilters(p => ({ ...p, recorderId: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg text-white text-sm" />
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Filtrar</button>
              <button type="button" onClick={clearFilters} className="text-gray-400 hover:text-white px-3 py-2 text-sm transition-colors">Limpiar</button>
            </div>
          </form>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Cargando...</div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center">
              <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No hay pagos registrados</p>
              <Link href="/admin/payments/new" className="text-violet-400 hover:text-violet-300 text-sm">Crear primer pago</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">ID</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Usuario</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Monto</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Estado</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Fecha</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 hidden md:table-cell">Descripcion</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-400">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-sm text-gray-500">#{p.id}</td>
                      <td className="py-3 px-4"><div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-500" /><span className="text-sm text-white">{p.paymentRecorderId}</span></div></td>
                      <td className="py-3 px-4"><span className="text-sm font-medium text-white">${p.amount.toLocaleString('es-CL')}</span></td>
                      <td className="py-3 px-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[p.status].class}`}>{statusConfig[p.status].label}</span></td>
                      <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-sm text-gray-300"><Calendar className="w-3.5 h-3.5 text-gray-500" />{new Date(p.date).toLocaleDateString('es-CL')}</div></td>
                      <td className="py-3 px-4 hidden md:table-cell"><p className="text-sm text-gray-400 truncate max-w-xs">{p.description}</p></td>
                      <td className="py-3 px-4"><div className="flex items-center justify-end gap-1"><Link href={`/admin/payments/${p.id}/edit`} className="p-2 text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></Link><button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50">{deleting === p.id ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-center"><Link href="/" className="text-gray-500 hover:text-gray-300 text-sm">Volver al inicio</Link></div>
      </div>
    </div>
  );
}
