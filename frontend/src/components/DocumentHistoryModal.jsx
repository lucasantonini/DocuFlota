import React, { useState, useEffect } from 'react'
import { 
  X, 
  History, 
  FileText, 
  Calendar,
  User,
  Clock
} from 'lucide-react'

const DocumentHistoryModal = ({ 
  isOpen, 
  onClose, 
  document,
  entityName 
}) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && document) {
      fetchHistory()
    }
  }, [isOpen, document])

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/documents/${document.id}/history`)
      const data = await response.json()

      if (data.success) {
        setHistory(data.data)
      } else {
        setError('Error al cargar el historial')
      }
    } catch (err) {
      console.error('History fetch error:', err)
      setError('Error de conexión al cargar el historial')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleClose = () => {
    setHistory([])
    setError(null)
    onClose()
  }

  if (!isOpen || !document) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Historial del Documento
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {entityName} - {document.name}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Document */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documento actual</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">{document.name}</p>
                  <p className="text-xs text-green-700">
                    Vence: {new Date(document.expiration_date).toLocaleDateString('es-ES')}
                  </p>
                  <p className="text-xs text-green-700">
                    Cargado: {formatDate(document.created_at)}
                  </p>
                </div>
                <div className="text-xs text-green-600 font-medium">
                  ACTUAL
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Versiones anteriores</h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600">Cargando historial...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchHistory}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Reintentar
                </button>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No hay versiones anteriores de este documento</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {item.previous_file_name}
                        </p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>Vencía: {new Date(item.previous_expiration_date).toLocaleDateString('es-ES')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span>Reemplazado: {formatDate(item.replaced_at)}</span>
                          </div>
                          {item.users && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <User className="h-3 w-3" />
                              <span>Por: {item.users.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Versión {history.length - index}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default DocumentHistoryModal
