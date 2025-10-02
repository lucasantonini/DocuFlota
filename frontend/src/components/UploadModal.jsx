import React, { useState, useRef, useCallback, useEffect } from 'react'
import { 
  X, 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react'

const UploadModal = ({ 
  isOpen, 
  onClose, 
  onUpload, 
  entityId, 
  entityName, 
  entityType = 'personnel', // 'personnel' or 'vehicle'
  clientId 
}) => {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [uploadMode, setUploadMode] = useState('files') // 'files' or 'camera'
  const [documentTypes, setDocumentTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  // Fetch document types on component mount
  useEffect(() => {
    if (isOpen) {
      fetchDocumentTypes()
    }
  }, [isOpen, entityType])

  const fetchDocumentTypes = async () => {
    try {
      const response = await fetch(`/api/documents/types?category=${entityType}`)
      const data = await response.json()
      if (data.success) {
        setDocumentTypes(data.data)
      }
    } catch (err) {
      console.error('Error fetching document types:', err)
    }
  }

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

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

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => {
      const validationError = validateFile(file)
      return {
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        status: validationError ? 'error' : 'pending',
        progress: 0,
        error: validationError,
        documentType: '',
        expirationDate: ''
      }
    })
    
    setFiles(prev => [...prev, ...newFiles])
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleCameraCapture = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const newFile = {
        id: Date.now() + Math.random(),
        file,
        name: `camera_${Date.now()}.jpg`,
        status: 'pending',
        progress: 0,
        error: null,
        documentType: '',
        expirationDate: ''
      }
      
      setFiles(prev => [...prev, newFile])
    }
  }

  const updateFileData = (fileId, field, value) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, [field]: value }
        : file
    ))
  }

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const addNewFile = () => {
    const newFile = {
      id: Date.now() + Math.random(),
      file: null,
      name: '',
      status: 'new',
      progress: 0,
      error: null,
      documentType: '',
      expirationDate: ''
    }
    setFiles(prev => [...prev, newFile])
  }

  const handleUpload = async () => {
    setLoading(true)
    setError(null)

    try {
      // Validate all files have required data
      const invalidFiles = files.filter(file => 
        !file.documentType || !file.expirationDate || file.status === 'error'
      )

      if (invalidFiles.length > 0) {
        setError('Todos los archivos deben tener tipo de documento y fecha de vencimiento')
        setLoading(false)
        return
      }

      // Prepare form data
      const formData = new FormData()
      const documentsData = []

      files.forEach((fileObj, index) => {
        if (fileObj.file) {
          formData.append('files', fileObj.file)
        }
        
        documentsData.push({
          name: fileObj.documentType,
          type_id: documentTypes.find(dt => dt.name === fileObj.documentType)?.id,
          category: entityType,
          expiration_date: fileObj.expirationDate,
          [`${entityType}_id`]: entityId,
          client_id: clientId
        })
      })

      formData.append('documents', JSON.stringify(documentsData))

      const response = await fetch('/api/documents/upload-multiple', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        onUpload(data.data)
        handleClose()
      } else {
        setError(data.message || 'Error al subir los documentos')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Error de conexión al subir los documentos')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFiles([])
    setUploadMode('files')
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Cargar Documentos - {entityName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {entityType === 'vehicle' ? 'Vehículo' : 'Personal'}
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
        <div className="flex h-[600px]">
          {/* Left Panel - Upload Area */}
          <div className="flex-1 p-6 border-r border-gray-200">
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
                Subir Archivos
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
                      ? 'Arrastra y suelta tus archivos aquí'
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
                      {uploadMode === 'files' ? 'selecciona archivos' : 'selecciona de galería'}
                    </button>
                  </p>
                </div>
                
                <p className="text-sm text-gray-500">
                  Solo archivos PDF, JPG o JPEG. Tamaño máximo: 16 MB
                </p>
              </div>
            </div>

            {/* Add New File Button */}
            <div className="mt-4">
              <button
                onClick={addNewFile}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Agregar otro documento
              </button>
            </div>

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
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

          {/* Right Panel - File List */}
          <div className="flex-1 p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Documentos a cargar ({files.length})
              </h3>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {files.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No hay archivos seleccionados</p>
                </div>
              ) : (
                files.map((file) => (
                  <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {file.name || 'Nuevo documento'}
                        </p>
                        {file.error && (
                          <p className="text-sm text-red-600 mt-1">{file.error}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {/* Document Type */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tipo de documento *
                        </label>
                        <select
                          value={file.documentType}
                          onChange={(e) => updateFileData(file.id, 'documentType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Seleccionar tipo</option>
                          {documentTypes.map((type) => (
                            <option key={type.id} value={type.name}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Expiration Date */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Fecha de vencimiento *
                        </label>
                        <input
                          type="date"
                          value={file.expirationDate}
                          onChange={(e) => updateFileData(file.id, 'expirationDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      {/* File Input for new files */}
                      {file.status === 'new' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Archivo *
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const selectedFile = e.target.files[0]
                                const validationError = validateFile(selectedFile)
                                updateFileData(file.id, 'file', selectedFile)
                                updateFileData(file.id, 'name', selectedFile.name)
                                updateFileData(file.id, 'status', validationError ? 'error' : 'pending')
                                updateFileData(file.id, 'error', validationError)
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
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
            onClick={handleUpload}
            disabled={loading || files.length === 0}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            {loading ? 'Subiendo...' : 'Subir Documentos'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadModal
