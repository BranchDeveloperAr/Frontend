import { useState, useEffect } from 'react'
import { Users, CreditCard, CheckCircle, XCircle } from 'lucide-react'

import { supabase } from '../lib/supabase'
import Layout from './Layout'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    expiredSubscriptions: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Total usuarios
      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      // Suscripciones activas
      const { count: activeCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // Suscripciones expiradas
      const { count: expiredCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'expired')

      // Total revenue
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('payment_status', 'approved')

      const revenue = payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0

      setStats({
        totalUsers: usersCount || 0,
        activeSubscriptions: activeCount || 0,
        expiredSubscriptions: expiredCount || 0,
        totalRevenue: revenue
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="p-4 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Cargando...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Panel de control de SAM</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            label="Total Usuarios"
            value={stats.totalUsers}
            color="#3b82f6"
          />
          <StatCard
            icon={CheckCircle}
            label="Suscripciones Activas"
            value={stats.activeSubscriptions}
            color="#10b981"
          />
          <StatCard
            icon={XCircle}
            label="Suscripciones Expiradas"
            value={stats.expiredSubscriptions}
            color="#ef4444"
          />
          <StatCard
            icon={CreditCard}
            label="Ingresos Totales"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            color="#8b5cf6"
          />
        </div>
      </div>
    </Layout>
  )
}