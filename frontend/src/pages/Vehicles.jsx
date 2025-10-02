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
import UploadModal from '../components/UploadModal'
import ReplaceDocumentModal from '../components/ReplaceDocumentModal'
import DocumentHistoryModal from '../components/DocumentHistoryModal'

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [uploadModal, setUploadModal] = useState({ isOpen: false, vehicleId: null, vehicleName: '', clientId: null })
  const [replaceModal, setReplaceModal] = useState({ isOpen: false, document: null, vehicleName: '' })
  const [historyModal, setHistoryModal] = useState({ isOpen: false, document: null, vehicleName: '' })

  // Fetch vehicles from backend
  useEffect(() => {
    fetchVehicles()
  }, [])

  // Calculate vehicle statistics
  const stats = {
    total: vehicles.length,
    valid: vehicles.filter(v => v.global_status === 'valid').length,
    warning: vehicles.filter(v => v.global_status === 'warning').length,
    expired: vehicles.filter(v => v.global_status === 'expired').length
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

  const handleUploadClick = (vehicleId, vehicleName, clientId) => {
    setUploadModal({
      isOpen: true,
      vehicleId,
      vehicleName,
      clientId
    })
  }

  const handleUploadClose = () => {
    setUploadModal({
      isOpen: false,
      vehicleId: null,
      vehicleName: '',
      clientId: null
    })
  }

  const handleUploadSuccess = (uploadedDocuments) => {
    // Refresh vehicles data to show new documents
    fetchVehicles()
    handleUploadClose()
  }

  const handleReplaceClick = (document, vehicleName) => {
    setReplaceModal({
      isOpen: true,
      document,
      vehicleName
    })
  }

  const handleReplaceClose = () => {
    setReplaceModal({
      isOpen: false,
      document: null,
      vehicleName: ''
    })
  }

  const handleReplaceSuccess = (updatedDocument) => {
    // Refresh vehicles data to show updated document
    fetchVehicles()
    handleReplaceClose()
  }

  const handleHistoryClick = (document, vehicleName) => {
    setHistoryModal({
      isOpen: true,
      document,
      vehicleName
    })
  }

  const handleHistoryClose = () => {
    setHistoryModal({
      isOpen: false,
      document: null,
      vehicleName: ''
    })
  }

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      
      if (data.success) {
        setVehicles(data.data)
      } else {
        setError('Error al cargar los vehículos')
      }
    } catch (err) {
      setError('Error de conexión')
      console.error('Error fetching vehicles:', err)
    } finally {
      setLoading(false)
    }
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
    const today = new Date()
    const expirationDate = new Date(document.expiration_date)
    const diffTime = expirationDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (document.status === 'expired') {
      return (
        <div className="flex items-center gap-2">
          <span className="status-danger">Vencido</span>
          <span className="text-sm text-gray-500">
            {Math.abs(diffDays)} días vencido
          </span>
        </div>
      )
    } else if (document.status === 'valid') {
      return (
        <div className="flex items-center gap-2">
          <span className="status-valid">Vigente</span>
          <span className="text-sm text-gray-500">
            Vence en {diffDays} días
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando vehículos...</p>
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
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-success-600">
              {stats.valid}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-secondary">Vigentes</p>
            </div>
            <div className="p-3 bg-success-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-warning-600">
              {stats.warning}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-secondary">Por Vencer</p>
            </div>
            <div className="p-3 bg-warning-50 rounded-lg">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-danger-600">
              {stats.expired}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-secondary">Vencidos</p>
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
                      {getStatusBadge(vehicle.global_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.next_expiration ? formatDate(vehicle.next_expiration) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUploadClick(vehicle.id, vehicle.name, vehicle.client_id)}
                          className="flex items-center gap-1 text-primary-600 hover:text-primary-900"
                        >
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
                  {expandedRows.has(vehicle.id) && vehicle.documents && vehicle.documents.length > 0 && (
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
                                      Vence: {formatDate(document.expiration_date)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  {getDocumentStatus(document)}
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => handleReplaceClick(document, vehicle.name)}
                                      className="flex items-center gap-1 text-primary-600 hover:text-primary-900 text-sm"
                                    >
                                      <Upload className="h-4 w-4" />
                                      Cargar documento
                                    </button>
                                    <button 
                                      onClick={() => handleHistoryClick(document, vehicle.name)}
                                      className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
                                    >
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

      {/* Modals */}
      <UploadModal
        isOpen={uploadModal.isOpen}
        onClose={handleUploadClose}
        onUpload={handleUploadSuccess}
        entityId={uploadModal.vehicleId}
        entityName={uploadModal.vehicleName}
        entityType="vehicle"
        clientId={uploadModal.clientId}
      />

      <ReplaceDocumentModal
        isOpen={replaceModal.isOpen}
        onClose={handleReplaceClose}
        onReplace={handleReplaceSuccess}
        document={replaceModal.document}
        entityName={replaceModal.vehicleName}
      />

      <DocumentHistoryModal
        isOpen={historyModal.isOpen}
        onClose={handleHistoryClose}
        document={historyModal.document}
        entityName={historyModal.vehicleName}
      />
    </div>
  )
}

export default Vehicles
