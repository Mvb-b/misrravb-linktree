import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, BarChart3, ArrowRight, Shield, CreditCard, DollarSign } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getPaymentsSummary } from '@/lib/db';

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'admin') {
    redirect('/admin/login');
  }

  const paymentSummary = getPaymentsSummary();

  const cards = [
    {
      href: '/admin/users',
      icon: Users,
      title: 'Gestión de Usuarios',
      description: 'Crear, editar, desactivar usuarios',
      color: 'fire-orange',
      bgColor: 'orange',
    },
    {
      href: '/admin/analytics',
      icon: BarChart3,
      title: 'Analytics',
      description: 'Ver estadísticas del linktree',
      color: 'purple-500',
      bgColor: 'violet',
    },
    {
      href: '/admin/payments',
      icon: CreditCard,
      title: 'Recaudación',
      description: 'Gestión de pagos y donaciones',
      color: 'green-400',
      bgColor: 'emerald',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Panel de <span className="text-orange-500">Administración</span>
          </h1>
          <p className="text-gray-400">Bienvenido, {user.name}</p>
        </div>

        {/* Summary Widget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-sm text-gray-400">Total Recaudado</span>
            </div>
            <p className="text-2xl font-bold text-white">
              ${paymentSummary.totalCompleted.toLocaleString('es-CL')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {paymentSummary.countCompleted} pagos completados
            </p>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-sm text-gray-400">Pendiente</span>
            </div>
            <p className="text-2xl font-bold text-white">
              ${paymentSummary.totalPending.toLocaleString('es-CL')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {paymentSummary.countPending} pagos pendientes
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm text-gray-400">Total Proyectado</span>
            </div>
            <p className="text-2xl font-bold text-white">
              ${paymentSummary.totalAmount.toLocaleString('es-CL')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Recaudado + Pendiente
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 group hover:border-orange-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl bg-${card.bgColor}-500/20 mb-4`}>
                  <card.icon className={`w-6 h-6 text-${card.bgColor}-400`} />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h2 className="font-display text-xl font-semibold text-white mb-2">
                {card.title}
              </h2>
              <p className="text-gray-400 text-sm">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
