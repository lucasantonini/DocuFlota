import React, { createContext, useContext, useState } from 'react'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [showNotifications, setShowNotifications] = useState(false)

  const openNotifications = () => setShowNotifications(true)
  const closeNotifications = () => setShowNotifications(false)

  return (
    <NotificationContext.Provider value={{
      showNotifications,
      openNotifications,
      closeNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  )
}
