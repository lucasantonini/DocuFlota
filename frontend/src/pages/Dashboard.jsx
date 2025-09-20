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
import { useNotifications } from '../contexts/NotificationContext'
import NotificationPopup from '../components/NotificationPopup'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDocuments: 47,
    vehicles: 12,
    personnel: 25,
    validDocuments: 36,
    expiringSoon: 8,
    expired: 3
  })

  const { showNotifications, closeNotifications } = useNotifications()

  // Sample notifications for expiring documents
  const notifications = [
    {
      vehicle: 'ABC-123 - Tractor Principal',
      document: 'SOAT',
      daysLeft: 15
    },
    {
      vehicle: 'DEF-456 - Semirremolque A',
      document: 'Revisión Técnica',
      daysLeft: 8
    },
    {
      vehicle: 'GHI-789 - Tractor Secundario',
      document: 'Seguro',
      daysLeft: 12
    }
  ]

  const StatCard = ({ title, value, description, icon: Icon, color = 'text-text-primary', statusLabel, statusColor }) => (
    <div className="card animate-slide-up" role="region" aria-label={`Estadística: ${title}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-2">{title}</p>
          <p className={`text-4xl font-bold ${color} mb-2`}>{value}</p>
          <p className="text-sm text-text-muted mb-3">{description}</p>
          {statusLabel && (
            <span className={`inline-block px-3 py-1.5 text-sm font-medium rounded-full ${statusColor}`}>
              {statusLabel}
            </span>
          )}
        </div>
        <div className="p-4 bg-background-100 rounded-2xl shadow-soft">
          <Icon className="h-8 w-8 text-text-secondary" aria-hidden="true" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="container-main space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold text-primary-600 mb-6 leading-tight">
            Tu flota siempre en regla
          </h1>
          <p className="text-xl text-text-secondary mb-4 leading-relaxed">
            Gestión inteligente de documentos con alertas automáticas y control en tiempo real.
          </p>
          <p className="text-lg text-text-muted mb-10 leading-relaxed">
            Olvídate de vencimientos, centralizá todo en un solo lugar y evitá riesgos innecesarios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/vehiculos" 
              className="btn-primary flex items-center justify-center gap-2"
              aria-label="Ir a gestión de documentos de vehículos"
            >
              <FileText className="h-5 w-5" />
              Gestionar Documentos
            </Link>
            <button 
              className="btn-secondary flex items-center justify-center gap-2"
              aria-label="Comenzar a usar la plataforma"
            >
              <Share2 className="h-5 w-5" />
              Comenzar ahora
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 hidden lg:block animate-slide-up">
          <div className="w-36 h-36 bg-primary-100 rounded-3xl flex items-center justify-center shadow-soft">
            <FileText className="h-16 w-16 text-primary-600" />
          </div>
          <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mt-6 ml-12 shadow-soft-md">
            <Share2 className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-responsive">
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
          description="Documentos al día"
          icon={CheckCircle}
          color="text-success-600"
          statusLabel="Vigentes"
          statusColor="status-valid"
        />
        <StatCard
          title="Por Vencer"
          value={stats.expiringSoon}
          description="Próximos a vencer"
          icon={Clock}
          color="text-warning-600"
          statusLabel="Próximos a vencer"
          statusColor="status-warning"
        />
        <StatCard
          title="Vencidos"
          value={stats.expired}
          description="Requieren atención"
          icon={AlertTriangle}
          color="text-danger-600"
          statusLabel="Vencidos"
          statusColor="status-danger"
        />
      </div>

      {/* Notification Popup */}
      <NotificationPopup
        isOpen={showNotifications}
        onClose={closeNotifications}
        notifications={notifications}
      />
    </div>
  )
}

export default Dashboard
