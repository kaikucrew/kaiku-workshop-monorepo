import React, { createContext, useContext, useState, useCallback } from 'react'
import { NotificationState, NotificationType } from '../types'

interface NotificationContextValue {
  notifications: NotificationState[]
  showSuccess: (message: string, duration?: number) => void
  showError: (message: string, duration?: number) => void
  showInfo: (message: string, duration?: number) => void
  dismissNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

const DEFAULT_DURATION = 5000 // 5 seconds

/**
 * Provider component for notification context
 * Manages notification queue and auto-dismissal
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationState[]>([])

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  const addNotification = useCallback(
    (message: string, type: NotificationType, duration: number = DEFAULT_DURATION) => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const notification: NotificationState = {
        id,
        message,
        type,
        duration,
      }

      setNotifications((prev) => [...prev, notification])

      // Auto-dismiss after duration
      if (duration > 0) {
        setTimeout(() => {
          dismissNotification(id)
        }, duration)
      }
    },
    [dismissNotification]
  )

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      addNotification(message, 'success', duration)
    },
    [addNotification]
  )

  const showError = useCallback(
    (message: string, duration?: number) => {
      addNotification(message, 'error', duration)
    },
    [addNotification]
  )

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      addNotification(message, 'info', duration)
    },
    [addNotification]
  )

  const value: NotificationContextValue = {
    notifications,
    showSuccess,
    showError,
    showInfo,
    dismissNotification,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

/**
 * Hook to access notification functionality
 * Must be used within NotificationProvider
 * 
 * @returns Notification methods and state
 * @throws Error if used outside NotificationProvider
 */
export const useNotification = (): NotificationContextValue => {
  const context = useContext(NotificationContext)
  
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  
  return context
}
