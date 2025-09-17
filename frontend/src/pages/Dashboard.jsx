import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Truck, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowUp,
  Share2
} from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDocuments: 47,
    vehicles: 12,
    personnel: 25,
    validDocuments: 36,
    expiringSoon: 8,
    expired: 3
  })

  const StatCard = ({ title, value, description, icon: Icon, color = 'text-gray-900', statusLabel, statusColor }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          <p className="text-sm text-gray-500">{description}</p>
          {statusLabel && (
            <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
              {statusLabel}
            </span>
          )}
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-primary-600 mb-4">
            Tu flota siempre en regla
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Gestión inteligente de documentos con alertas automáticas y control en tiempo real.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Olvidate de vencimientos, centralizá todo en un solo lugar y evitá riesgos innecesarios.
          </p>
          <div className="flex gap-4">
            <Link to="/vehiculos" className="btn-primary">
              Gestionar Documentos
            </Link>
            <button className="bg-success-600 hover:bg-success-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Comenzar ahora
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 hidden lg:block">
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center">
            <FileText className="h-12 w-12 text-primary-600" />
          </div>
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mt-4 ml-8">
            <Share2 className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Documentos"
          value={stats.totalDocuments}
          description="Documentos en el sistema"
          icon={FileText}
        />
        <StatCard
          title="Vehículos"
          value={stats.vehicles}
          description="Vehículos registrados"
          icon={Truck}
        />
        <StatCard
          title="Personal"
          value={stats.personnel}
          description="Personal registrado"
          icon={Users}
        />
        <StatCard
          title="Documentos Válidos"
          value={stats.validDocuments}
          description=""
          icon={CheckCircle}
          color="text-success-600"
          statusLabel="Vigentes"
          statusColor="bg-success-100 text-success-600"
        />
        <StatCard
          title="Por Vencer"
          value={stats.expiringSoon}
          description=""
          icon={Clock}
          color="text-warning-600"
          statusLabel="Próximos a vencer"
          statusColor="bg-warning-100 text-warning-600"
        />
        <StatCard
          title="Vencidos"
          value={stats.expired}
          description=""
          icon={AlertTriangle}
          color="text-danger-600"
          statusLabel="Vencidos"
          statusColor="bg-danger-100 text-danger-600"
        />
      </div>
    </div>
  )
}

export default Dashboard
