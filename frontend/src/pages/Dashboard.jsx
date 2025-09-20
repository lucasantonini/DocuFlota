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
import DocumentDistributionChart from '../components/charts/DocumentDistributionChart'
import DriverRankingChart from '../components/charts/DriverRankingChart'
import UpcomingExpirationsChart from '../components/charts/UpcomingExpirationsChart'

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

  // Data for document distribution chart
  const documentDistributionData = [
    { name: 'Vigentes', value: stats.validDocuments },
    { name: 'Por vencer', value: stats.expiringSoon },
    { name: 'Vencidos', value: stats.expired }
  ]

  // Data for driver ranking chart
  const driverRankingData = [
    {
      id: 1,
      name: 'Juan Carlos Pérez',
      compliance: 95,
      trend: {
        type: 'up',
        delta: '+4%',
        ariaLabel: 'Mejora del 4% respecto a la semana anterior'
      }
    },
    {
      id: 2,
      name: 'María Elena González',
      compliance: 88,
      trend: {
        type: 'down',
        delta: '-2%',
        ariaLabel: 'Disminución del 2% respecto a la semana anterior'
      }
    },
    {
      id: 3,
      name: 'Roberto Martínez',
      compliance: 72,
      trend: {
        type: 'neutral',
        delta: '→ 0%',
        ariaLabel: 'Sin cambios respecto a la semana anterior'
      }
    },
    {
      id: 4,
      name: 'Ana López',
      compliance: 91,
      trend: {
        type: 'up',
        delta: '+3%',
        ariaLabel: 'Mejora del 3% respecto a la semana anterior'
      }
    },
    {
      id: 5,
      name: 'Pedro Sánchez',
      compliance: 85,
      trend: {
        type: 'neutral',
        delta: '→ 0%',
        ariaLabel: 'Sin cambios respecto a la semana anterior'
      }
    }
  ]

  // Data for upcoming expirations chart
  const upcomingExpirationsData = [
    { month: 'Ene', documents: 8 },
    { month: 'Feb', documents: 12 },
    { month: 'Mar', documents: 15 },
    { month: 'Abr', documents: 6 },
    { month: 'May', documents: 9 },
    { month: 'Jun', documents: 11 }
  ]

  const handleViewAllDrivers = () => {
    // Navigate to personnel page or open modal
    console.log('Ver todos los choferes')
  }

  const StatCard = ({ title, value, description, icon: Icon, color = 'text-text-primary', statusLabel, statusColor, compact = false }) => (
    <div className={`card animate-slide-up ${compact ? 'p-4' : ''}`} role="region" aria-label={`Estadística: ${title}`}>
      <div className={`flex items-center ${compact ? 'gap-4' : 'justify-between'}`}>
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
        <div className={`p-4 bg-background-100 rounded-2xl shadow-soft ${compact ? 'p-3' : ''}`}>
          <Icon className={`text-text-secondary ${compact ? 'h-6 w-6' : 'h-8 w-8'}`} aria-hidden="true" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="container-main space-y-8 animate-fade-in">
      {/* Hero Section with Main Stats */}
      <div className="card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Hero content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-text-primary mb-4 animate-fade-in">
              Tu flota siempre en regla
            </h1>
            <p className="text-xl text-text-secondary mb-4 animate-fade-in">
              Gestión inteligente de documentos con alertas automáticas y control en tiempo real.
            </p>
            <p className="text-lg text-text-muted animate-fade-in">
              Olvídate de vencimientos, centralizá todo en un solo lugar y evitá riesgos innecesarios.
            </p>
          </div>

          {/* Right side - Main stats */}
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-primary-600">
                  {stats.totalDocuments}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-secondary">Documentos Totales</p>
                </div>
                <div className="p-3 bg-background-100 rounded-lg">
                  <FileText className="h-6 w-6 text-text-muted" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-primary-600">
                  {stats.vehicles}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-secondary">Vehículos</p>
                </div>
                <div className="p-3 bg-background-100 rounded-lg">
                  <Truck className="h-6 w-6 text-text-muted" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-primary-600">
                  {stats.personnel}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-secondary">Personal</p>
                </div>
                <div className="p-3 bg-background-100 rounded-lg">
                  <Users className="h-6 w-6 text-text-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* New Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Document Distribution Chart */}
        <DocumentDistributionChart data={documentDistributionData} />
        
        {/* Driver Ranking Chart */}
        <DriverRankingChart 
          data={driverRankingData} 
          onViewAll={handleViewAllDrivers}
        />
      </div>

      {/* Upcoming Expirations Chart */}
      <div className="grid grid-cols-1">
        <UpcomingExpirationsChart data={upcomingExpirationsData} />
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
