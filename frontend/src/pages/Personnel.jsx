import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Upload, 
  History, 
  ChevronDown, 
  ChevronRight,
  Users,
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle
} from 'lucide-react'
import UploadModal from '../components/UploadModal'

const Personnel = () => {
  const [personnel, setPersonnel] = useState([
    {
      id: 1,
      name: 'Juan Carlos Pérez',
      status: 'valid',
      nextExpiration: '2024-06-15',
      documents: []
    },
    {
      id: 2,
      name: 'María Elena González',
      status: 'warning',
      nextExpiration: '2024-02-20',
      documents: []
    },
    {
      id: 3,
      name: 'Roberto Martínez',
      status: 'expired',
      nextExpiration: '2024-03-15', // Registro de Conducir (más próximo vencido)
      documents: [
        {
          id: 1,
          name: 'DNI',
          expirationDate: '2024-04-20',
          status: 'expired',
          daysOverdue: 5
        },
        {
          id: 2,
          name: 'Certificado de Antecedentes',
          expirationDate: '2024-09-30',
          status: 'valid',
          daysRemaining: 155
        },
        {
          id: 3,
          name: 'Registro de Conducir',
          expirationDate: '2024-03-15',
          status: 'expired',
          daysOverdue: 20
        },
        {
          id: 4,
          name: 'Seguro ART',
          expirationDate: '2024-05-10',
          status: 'warning',
          daysRemaining: 25
        },
        {
          id: 5,
          name: 'Certificado de Carga Peligrosa',
          expirationDate: '2024-12-31',
          status: 'valid',
          daysRemaining: 280
        }
      ]
    }
  ])

  const [expandedRows, setExpandedRows] = useState(new Set()) // No rows expanded by default
  const [uploadModal, setUploadModal] = useState({ isOpen: false, personnelId: null, personnelName: '' })

  const stats = {
    total: personnel.length,
    valid: personnel.filter(p => p.status === 'valid').length,
    expiringSoon: personnel.filter(p => p.status === 'warning').length,
    expired: personnel.filter(p => p.status === 'expired').length
  }

  const toggleRow = (personnelId) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(personnelId)) {
      newExpanded.delete(personnelId)
    } else {
      newExpanded.add(personnelId)
    }
    setExpandedRows(newExpanded)
  }

  const handleUploadClick = (personnelId, personnelName) => {
    setUploadModal({
      isOpen: true,
      personnelId,
      personnelName
    })
  }

  const handleUploadClose = () => {
    setUploadModal({
      isOpen: false,
      personnelId: null,
      personnelName: ''
    })
  }

  const handleUpload = (files) => {
    // Here you would implement the actual upload logic
    console.log('Uploading files for personnel:', uploadModal.personnelId, files)
    // You can call an API endpoint here to upload the files
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      valid: { label: 'Vigente', className: 'status-valid' },
      warning: { label: 'Por-Vencer', className: 'status-warning' },
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
            {document.daysRemaining} días restantes
          </span>
        </div>
      )
    } else if (document.status === 'warning') {
      return (
        <div className="flex items-center gap-2">
          <span className="status-warning">Por vencer</span>
          <span className="text-sm text-gray-500">
            {document.daysRemaining} días restantes
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
          <h1 className="text-3xl font-bold text-gray-900">Personal</h1>
          <p className="text-gray-600">Choferes y documentación habilitante</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-600">Total: </span>
            <span className="text-lg font-bold text-gray-900">{stats.total}</span>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Agregar Personal
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
              <p className="text-sm font-medium text-text-secondary">Personal Vigente</p>
            </div>
            <div className="p-3 bg-success-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-warning-600">
              {stats.expiringSoon}
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

      {/* Personnel Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado Global
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Próximo Vencimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {personnel.map((person) => (
                <React.Fragment key={person.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleRow(person.id)}
                          className="mr-3 text-gray-400 hover:text-gray-600"
                        >
                          {expandedRows.has(person.id) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </button>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{person.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(person.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(person.nextExpiration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUploadClick(person.id, person.name)}
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
                  {expandedRows.has(person.id) && person.documents.length > 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 bg-gray-50">
                        <div className="ml-8">
                          <h4 className="text-sm font-medium text-gray-900 mb-4">
                            Documentos del personal
                          </h4>
                          <div className="space-y-4">
                            {person.documents.map((document) => (
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
                                    <button 
                                      onClick={() => handleUploadClick(person.id, person.name)}
                                      className="flex items-center gap-1 text-primary-600 hover:text-primary-900 text-sm"
                                    >
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

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModal.isOpen}
        onClose={handleUploadClose}
        onUpload={handleUpload}
        personnelId={uploadModal.personnelId}
        personnelName={uploadModal.personnelName}
      />
    </div>
  )
}

export default Personnel
