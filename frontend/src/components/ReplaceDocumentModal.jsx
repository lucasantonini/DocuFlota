import React, { useState, useRef, useEffect } from 'react'
import { 
  X, 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  RefreshCw
} from 'lucide-react'

const ReplaceDocumentModal = ({ 
  isOpen, 
  onClose, 
  onReplace, 
  document,
  entityName 
}) => {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadMode, setUploadMode] = useState('files')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: document?.name || '',
    expirationDate: document?.expiration_date || ''
  })
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  useEffect(() => {
    if (document) {
      setFormData({
        name: document.name || '',
        expirationDate: document.expiration_date || ''
      })
    }
  }, [document])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'application/pdf']
    const maxSize = 16 * 1024 * 1024 // 16MB

    if (!allowedTypes.includes(file.type)) {
      return 'Solo se permiten archivos PDF, JPG o JPEG'
    }

    if (file.size > maxSize) {
      return 'El archivo no puede ser mayor a 16MB'
    }

    return null
  }

  const handleFile = (selectedFile) => {
    const validationError = validateFile(selectedFile)
    if (validationError) {
      setError(validationError)
      return
    }
    
    setError(null)
    setFile(selectedFile)
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleCameraCapture = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleReplace = async () => {
    if (!file) {
      setError('Debe seleccionar un archivo para reemplazar')
      return
    }

    if (!formData.name || !formData.expirationDate) {
      setError('El nombre del documento y la fecha de vencimiento son obligatorios')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)
      formDataToSend.append('name', formData.name)
      formDataToSend.append('expiration_date', formData.expirationDate)

      const response = await fetch(`/api/documents/replace/${document.id}`, {
        method: 'PUT',
        body: formDataToSend
      })

      const data = await response.json()

      if (data.success) {
        onReplace(data.data)
        handleClose()
      } else {
        setError(data.message || 'Error al reemplazar el documento')
      }
    } catch (err) {
      console.error('Replace error:', err)
      setError('Error de conexión al reemplazar el documento')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setUploadMode('files')
    setError(null)
    setFormData({
      name: document?.name || '',
      expirationDate: document?.expiration_date || ''
    })
    onClose()
  }

  if (!isOpen || !document) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Reemplazar Documento
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
        <div className="p-6 space-y-6">
          {/* Current Document Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Documento actual</h3>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{document.name}</p>
                <p className="text-xs text-gray-500">
                  Vence: {new Date(document.expiration_date).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          </div>

          {/* Document Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del documento *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ingrese el nombre del documento"
            />
          </div>

          {/* Expiration Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de vencimiento *
            </label>
            <input
              type="date"
              value={formData.expirationDate}
              onChange={(e) => handleInputChange('expirationDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo nuevo *
            </label>
            
            {/* Mode Toggle */}
            <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setUploadMode('files')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  uploadMode === 'files'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Upload className="h-4 w-4 inline mr-2" />
                Subir Archivo
              </button>
              <button
                onClick={() => setUploadMode('camera')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  uploadMode === 'camera'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Camera className="h-4 w-4 inline mr-2" />
                Tomar Foto
              </button>
            </div>

            {/* Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-primary-300 bg-primary-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 text-primary-500">
                  {uploadMode === 'files' ? (
                    <Upload className="w-full h-full" />
                  ) : (
                    <Camera className="w-full h-full" />
                  )}
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {uploadMode === 'files' 
                      ? 'Arrastra y suelta el archivo aquí'
                      : 'Toma una foto del documento'
                    }
                  </p>
                  <p className="text-gray-600 mt-1">
                    {uploadMode === 'files' ? 'o' : 'o'} 
                    <button
                      onClick={() => {
                        if (uploadMode === 'files') {
                          fileInputRef.current?.click()
                        } else {
                          cameraInputRef.current?.click()
                        }
                      }}
                      className="text-primary-600 hover:text-primary-700 font-medium ml-1"
                    >
                      {uploadMode === 'files' ? 'selecciona archivo' : 'selecciona de galería'}
                    </button>
                  </p>
                </div>
                
                <p className="text-sm text-gray-500">
                  Solo archivos PDF, JPG o JPEG. Tamaño máximo: 16 MB
                </p>
              </div>
            </div>

            {/* Selected File */}
            {file && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Archivo seleccionado: {file.name}
                  </span>
                </div>
              </div>
            )}

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg"
              onChange={handleFileInput}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              className="hidden"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleReplace}
            disabled={loading || !file}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            {loading ? 'Reemplazando...' : 'Reemplazar Documento'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReplaceDocumentModal
