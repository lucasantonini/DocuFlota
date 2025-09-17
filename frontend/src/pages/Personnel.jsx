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
  FileText
} from 'lucide-react'
import UploadModal from '../components/UploadModal'

const Personnel = () => {
  const [personnel, setPersonnel] = useState([
    {
      id: 1,
      name: 'Juan Carlos Pérez',
      role: 'Chofer',
      status: 'valid',
      nextExpiration: '2024-06-15',
      documents: []
    },
    {
      id: 2,
      name: 'María Elena González',
      role: 'Chofer',
      status: 'warning',
      nextExpiration: '2024-02-20',
      documents: []
    },
    {
      id: 3,
      name: 'Roberto Martínez',
      role: 'Administrativo',
      status: 'expired',
      nextExpiration: '2024-04-20',
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
        }
      ]
    }
  ])

  const [expandedRows, setExpandedRows] = useState(new Set([3])) // Roberto expanded by default
  const [uploadModal, setUploadModal] = useState({ isOpen: false, personnelId: null, personnelName: '' })

  const stats = {
    total: personnel.length,
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
        <button className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Agregar Personal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Personal</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Personal registrado</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Por Vencer</p>
              <p className="text-3xl font-bold text-warning-600">{stats.expiringSoon}</p>
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

      {/* Personnel List */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Lista de Personal</h2>
        </div>

        <div className="space-y-4">
          {personnel.map((person) => (
            <div key={person.id} className="border border-gray-200 rounded-lg">
              {/* Personnel Row */}
              <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleRow(person.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {expandedRows.has(person.id) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{person.name}</div>
                    <div className="text-sm text-gray-500">{person.role}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  {getStatusBadge(person.status)}
                  <div className="text-sm text-gray-500">
                    Próximo vencimiento: {formatDate(person.nextExpiration)}
                  </div>
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
                </div>
              </div>

              {/* Expanded Documents */}
              {expandedRows.has(person.id) && person.documents.length > 0 && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Documentos de la persona
                  </h4>
                  <div className="space-y-3">
                    {person.documents.map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-3">
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
              )}
            </div>
          ))}
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
