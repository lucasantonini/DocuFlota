import React from 'react'
import { X, AlertTriangle, Truck } from 'lucide-react'

const NotificationPopup = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-blue-100 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors z-10"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Warning Section */}
        <div className="relative bg-yellow-400 rounded-t-lg p-6 pb-8">
          {/* Diagonal overlay effect */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500 transform rotate-45 translate-x-8 -translate-y-8 rounded-lg"></div>
          
          {/* Warning Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-8 w-8 text-gray-700" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Warning!
          </h3>

          {/* Subtitle */}
          <p className="text-gray-700 text-center text-sm">
            Documentos próximos a vencer
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-b-lg p-6 pt-8">
          {/* Notifications List */}
          <div className="space-y-3 mb-6">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Truck className="h-5 w-5 text-primary-600 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.vehicle}
                  </p>
                  <p className="text-xs text-gray-600">
                    {notification.document} - Vence en {notification.daysLeft} días
                  </p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  {notification.daysLeft}d
                </span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-colors"
            >
              VER DOCUMENTOS
            </button>
          </div>
        </div>

        {/* Pointer/Tail */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 bg-yellow-400 transform rotate-45"></div>
        </div>
      </div>
    </div>
  )
}

export default NotificationPopup
