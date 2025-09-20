import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Truck, 
  Users, 
  Building2, 
  Upload, 
  Bell, 
  User,
  Menu,
  X
} from 'lucide-react'
import { useNotifications } from '../contexts/NotificationContext'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  
  // Safely get notifications context, with fallback
  let openNotifications = () => {}
  try {
    const notifications = useNotifications()
    openNotifications = notifications.openNotifications
  } catch (error) {
    // Context not available, use fallback
    console.log('Notification context not available')
  }

  const navigation = [
    { name: 'Vehículos', href: '/vehiculos', icon: Truck },
    { name: 'Personal', href: '/personal', icon: Users },
    { name: 'Clientes', href: '/clientes', icon: Building2 },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-background-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-text-primary bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-soft-lg">
          <div className="flex h-16 items-center justify-between px-6">
            <Link 
              to="/" 
              className="flex items-center hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-2"
              aria-label="Ir al dashboard principal"
            >
              <Truck className="h-8 w-8 text-primary-600" aria-hidden="true" />
              <span className="ml-3 text-xl font-bold text-text-primary">DocuFlota</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-text-muted hover:text-text-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Cerrar menú de navegación"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="flex-1 px-6 py-6" role="navigation" aria-label="Navegación principal">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl mb-2 transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700 shadow-soft'
                      : 'text-text-secondary hover:bg-background-100 hover:text-text-primary'
                  }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <Icon className="mr-3 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-border-light shadow-soft">
          <div className="flex h-20 items-center px-6">
            <Link 
              to="/" 
              className="flex items-center hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-2"
              aria-label="Ir al dashboard principal"
            >
              <Truck className="h-8 w-8 text-primary-600" aria-hidden="true" />
              <div className="ml-3">
                <span className="text-xl font-bold text-text-primary">DocuFlota</span>
                <p className="text-sm text-text-muted">Gestión de Documentación</p>
              </div>
            </Link>
          </div>
          <nav className="flex-1 px-6 py-6" role="navigation" aria-label="Navegación principal">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl mb-2 transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700 shadow-soft'
                      : 'text-text-secondary hover:bg-background-100 hover:text-text-primary'
                  }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <Icon className="mr-3 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border-light bg-white px-4 shadow-soft sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-text-primary lg:hidden focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú de navegación"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button
                type="button"
                onClick={openNotifications}
                className="-m-2.5 p-2.5 text-text-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg transition-colors"
                aria-label="Ver notificaciones"
              >
                <Bell className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-1.5 p-1.5 text-text-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg transition-colors"
                aria-label="Abrir perfil de usuario"
              >
                <User className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
