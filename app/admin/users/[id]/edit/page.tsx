'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const userId = params.id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setError('ID de usuario no proporcionado');
        setFetching(false);
        return;
      }
      try {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        if (meData.success) setCurrentUserId(meData.data.user.id);
        
        const res = await fetch(`/api/admin/users?id=${userId}`);
        const data = await res.json();
        
        if (!data.success) {
          setError(data.error || 'Usuario no encontrado');
          return;
        }
        const users = data.data.users;
        if (!users || users.length === 0) {
          setError('Usuario no encontrado');
          return;
        }
        setUser(users[0]);
        setFormData({
          name: users[0].name,
          email: users[0].email,
          password: '',
          role: users[0].role,
          status: users[0].status,
        });
      } catch (err) {
        setError('Error al cargar usuario');
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          ...(formData.password && { password: formData.password }),
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Error al actualizar usuario');
        return;
      }
      router.push('/admin/users');
    } catch (err) {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-fire-orange/30 border-t-fire-orange rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando usuario...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/users" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a usuarios
        </Link>
        <div className="glass-card rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const isSelf = currentUserId === parseInt(userId || '0');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/users" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a usuarios
        </Link>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
          Editar <span className="text-fire-orange">Usuario</span>
        </h1>
      </div>
      <div className="glass-card rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          {isSelf && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
              <Shield className="w-4 h-4 flex-shrink-0" />
              Estas editando tu propia cuenta
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm text-gray-400 mb-2">Nombre completo *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-fire-orange/50 transition-colors"
              placeholder="Juan Perez"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-2">Email *</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-fire-orange/50 transition-colors"
              placeholder="juan@misrravb.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-gray-400 mb-2">
              Nueva contrasena <span className="text-gray-500 text-xs ml-2">(dejar vacio para mantener la actual)</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-fire-orange/50 transition-colors pr-12"
                placeholder="Minimo 6 caracteres"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="role" className="block text-sm text-gray-400 mb-2">Rol</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-fire-orange/50 transition-colors"
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm text-gray-400 mb-2">Estado</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                disabled={isSelf}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-fire-orange/50 transition-colors"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
              {isSelf && <p className="text-gray-500 text-xs mt-1">No puedes desactivar tu propia cuenta</p>}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Link href="/admin/users" className="px-6 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-fire-orange text-white font-semibold hover:bg-fire-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Save className="w-5 h-5" />Guardar Cambios</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}