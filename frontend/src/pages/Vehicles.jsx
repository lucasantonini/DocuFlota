import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Upload, 
  History, 
  ChevronDown, 
  ChevronRight,
  Info,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      plate: 'ABC-123',
      name: 'Tractor Principal',
      type: 'Tractor',
      globalStatus: 'expired',
      nextExpiration: '2024-01-14',
      documents: [
        {
          id: 1,
          name: 'SOAT',
          expirationDate: '2024-01-14',
          status: 'expired',
          daysOverdue: 5
        },
        {
          id: 2,
          name: 'Revisión Técnica',
          expirationDate: '2024-03-19',
          status: 'valid',
          daysRemaining: 45
        },
        {
          id: 3,
          name: 'Tarjeta de Propiedad',
          expirationDate: '2024-12-30',
          status: 'valid',
          daysRemaining: 320
        }
      ]
    },
    {
      id: 2,
      plate: 'DEF-456',
      name: 'Semirremolque A',
      type: 'Semirremolque',
      globalStatus: 'warning',
      nextExpiration: '2024-02-09',
      documents: []
    },
    {
      id: 3,
      plate: 'GHI-789',
      name: 'Tractor Secundario',
      type: 'Tractor',
      globalStatus: 'valid',
      nextExpiration: '2024-04-24',
      documents: []
    }
  ])

  const [expandedRows, setExpandedRows] = useState(new Set())

  // Calculate vehicle statistics
  const stats = {
    total: vehicles.length,
    valid: vehicles.filter(v => v.globalStatus === 'valid').length,
    warning: vehicles.filter(v => v.globalStatus === 'warning').length,
    expired: vehicles.filter(v => v.globalStatus === 'expired').length
  }

  const toggleRow = (vehicleId) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(vehicleId)) {
      newExpanded.delete(vehicleId)
    } else {
      newExpanded.add(vehicleId)
    }
    setExpandedRows(newExpanded)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      valid: { label: 'Vigente', className: 'status-valid' },
      warning: { label: 'Por vencer', className: 'status-warning' },
      expired: { label: 'Vencido', className: 'status-danger' }
    }
    const config = statusConfig[status] || statusConfig.valid
    return <span className={config.className}>{config.label}</span>
  }

  const getDocumentStatus = (document) => {
    if (document.status === 'expired') {
      return (
        <div className="flex items-center gap-2">
          <span className="status-danger">Vencido</span>
          <span className="text-sm text-gray-500">
            {document.daysOverdue} días vencido
          </span>
        </div>
      )
    } else if (document.status === 'valid') {
      return (
        <div className="flex items-center gap-2">
          <span className="status-valid">Vigente</span>
          <span className="text-sm text-gray-500">
            Vence en {document.daysRemaining} días
          </span>
        </div>
      )
    }
    return <span className="status-warning">Por vencer</span>
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehículos</h1>
          <p className="text-gray-600">Listado de unidades y su documentación habilitante</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-600">Total: </span>
            <span className="text-lg font-bold text-gray-900">{vehicles.length}</span>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Añadir vehículo
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vehículos Vigentes</p>
              <p className="text-3xl font-bold text-success-600">{stats.valid}</p>
              <p className="text-sm text-gray-500">Documentación al día</p>
            </div>
            <div className="p-3 bg-success-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Por Vencer</p>
              <p className="text-3xl font-bold text-warning-600">{stats.warning}</p>
              <p className="text-sm text-gray-500">Próximos a vencer</p>
            </div>
            <div className="p-3 bg-warning-50 rounded-lg">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vencidos</p>
              <p className="text-3xl font-bold text-danger-600">{stats.expired}</p>
              <p className="text-sm text-gray-500">Vencidos</p>
            </div>
            <div className="p-3 bg-danger-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-danger-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    Estado global
                    <Info className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Próximo vencimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <React.Fragment key={vehicle.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleRow(vehicle.id)}
                          className="mr-3 text-gray-400 hover:text-gray-600"
                        >
                          {expandedRows.has(vehicle.id) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </button>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{vehicle.plate}</div>
                          <div className="text-sm text-gray-500">{vehicle.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(vehicle.globalStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(vehicle.nextExpiration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 text-primary-600 hover:text-primary-900">
                          <Upload className="h-4 w-4" />
                          Cargar
                        </button>
                        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                          <History className="h-4 w-4" />
                          Historial
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    </td>
                  </tr>
                  
                  {/* Expanded Documents Row */}
                  {expandedRows.has(vehicle.id) && vehicle.documents.length > 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        <div className="ml-8">
                          <h4 className="text-sm font-medium text-gray-900 mb-4">
                            Documentos del vehículo
                          </h4>
                          <div className="space-y-4">
                            {vehicle.documents.map((document) => (
                              <div key={document.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                                <div className="flex items-center gap-4">
                                  <FileText className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {document.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Vence: {formatDate(document.expirationDate)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  {getDocumentStatus(document)}
                                  <div className="flex gap-2">
                                    <button className="flex items-center gap-1 text-primary-600 hover:text-primary-900 text-sm">
                                      <Upload className="h-4 w-4" />
                                      Cargar documento
                                    </button>
                                    <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm">
                                      <History className="h-4 w-4" />
                                      Ver historial
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Vehicles
