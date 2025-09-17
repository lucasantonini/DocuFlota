import React, { useState, useRef, useCallback } from 'react'
import { 
  X, 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  RefreshCw
} from 'lucide-react'

const UploadModal = ({ isOpen, onClose, onUpload, personnelId, personnelName }) => {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [uploadMode, setUploadMode] = useState('files') // 'files' or 'camera'
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

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

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      status: 'uploading',
      progress: 0
    }))
    
    setFiles(prev => [...prev, ...newFiles])
    
    // Simulate upload progress
    newFiles.forEach(fileObj => {
      simulateUpload(fileObj.id)
    })
  }

  const simulateUpload = (fileId) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 30, 100)
          if (newProgress >= 100) {
            clearInterval(interval)
            return { ...file, progress: 100, status: 'success' }
          }
          return { ...file, progress: newProgress }
        }
        return file
      }))
    }, 200)
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
        status: 'uploading',
        progress: 0
      }
      
      setFiles(prev => [...prev, newFile])
      simulateUpload(newFile.id)
    }
  }

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const retryUpload = (fileId) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, status: 'uploading', progress: 0 }
        : file
    ))
    simulateUpload(fileId)
  }

  const handleClose = () => {
    setFiles([])
    setUploadMode('files')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload Files</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-96">
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
                Upload Files
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
                Take Photo
              </button>
            </div>

            {/* Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-orange-300 bg-orange-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 text-orange-500">
                  {uploadMode === 'files' ? (
                    <Upload className="w-full h-full" />
                  ) : (
                    <Camera className="w-full h-full" />
                  )}
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {uploadMode === 'files' 
                      ? 'Drag & Drop your files here'
                      : 'Take a photo of the document'
                    }
                  </p>
                  <p className="text-gray-600 mt-1">
                    {uploadMode === 'files' ? 'or' : 'or'} 
                    <button
                      onClick={() => {
                        if (uploadMode === 'files') {
                          fileInputRef.current?.click()
                        } else {
                          cameraInputRef.current?.click()
                        }
                      }}
                      className="text-orange-600 hover:text-orange-700 font-medium ml-1"
                    >
                      {uploadMode === 'files' ? 'Browse to upload files' : 'Select from gallery'}
                    </button>
                  </p>
                </div>
                
                <p className="text-sm text-gray-500">
                  Only PDF, Excel and Jpeg formats with max file size of 16 MB
                </p>
              </div>
            </div>

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.xlsx,.xls,.jpeg,.jpg"
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
              <h3 className="text-sm font-medium text-gray-900 mb-2">Uploading for: {personnelName}</h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>File Name</div>
                <div>Status</div>
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {files.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No files selected</p>
                </div>
              ) : (
                files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      {file.status === 'uploading' && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {file.status === 'success' && (
                        <span className="text-green-600 text-sm font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Success
                        </span>
                      )}
                      {file.status === 'failed' && (
                        <span className="text-red-600 text-sm font-medium flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Failed
                        </span>
                      )}
                      {file.status === 'uploading' && (
                        <span className="text-blue-600 text-sm font-medium">
                          {Math.round(file.progress)}%
                        </span>
                      )}
                      
                      <div className="flex gap-1">
                        {file.status === 'failed' && (
                          <button
                            onClick={() => retryUpload(file.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadModal
