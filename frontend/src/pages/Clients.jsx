import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Building2, 
  FileText,
  Users,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'

const Clients = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch clients from backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/clients')
        const data = await response.json()
        
        if (data.success) {
          setClients(data.data)
        } else {
          setError('Error al cargar los clientes')
        }
      } catch (err) {
        setError('Error de conexión')
        console.error('Error fetching clients:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gestión de clientes y documentación requerida</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Agregar Cliente
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-text-primary">
              {clients.length}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-secondary">Total Clientes</p>
            </div>
            <div className="p-3 bg-background-100 rounded-lg">
              <Building2 className="h-6 w-6 text-text-muted" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-text-primary">
              {clients.reduce((sum, client) => sum + client.document_count, 0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-secondary">Documentos Requeridos</p>
            </div>
            <div className="p-3 bg-background-100 rounded-lg">
              <FileText className="h-6 w-6 text-text-muted" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-text-primary">
              {clients.length > 0 ? Math.round(clients.reduce((sum, client) => sum + client.document_count, 0) / clients.length) : 0}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-secondary">Promedio por Cliente</p>
            </div>
            <div className="p-3 bg-background-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-text-muted" />
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="card">

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículos Habilitados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personal Habilitado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documentos Requeridos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-500">CUIT: {client.cuit}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.contact_name}</div>
                      <div className="text-sm text-gray-500">{client.contact_email}</div>
                      <div className="text-sm text-gray-500">{client.contact_phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.vehicle_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.personnel_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="text-sm">
                        <div className="text-lg font-bold text-gray-900">{client.document_count}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        Ver detalles
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Clients
