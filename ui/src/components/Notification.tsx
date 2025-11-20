import React from 'react'
import { NotificationState } from '../types'
import './Notification.css'

interface NotificationProps {
  notification: NotificationState
  onClose: (id: string) => void
}

/**
 * Notification component for displaying user feedback messages
 * Supports success, error, and info types with auto-dismiss functionality
 * 
 * Requirements: 8.2, 8.3, 8.4
 */
export const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  const { id, message, type } = notification

  const handleClose = () => {
    onClose(id)
  }

  // Get appropriate icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'info':
        return 'ℹ'
      default:
        return ''
    }
  }

  return (
    <div 
      className={`notification notification--${type}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="notification__icon">
        {getIcon()}
      </div>
      <div className="notification__message">
        {message}
      </div>
      <button
        className="notification__close"
        onClick={handleClose}
        aria-label="Close notification"
        type="button"
      >
        ×
      </button>
    </div>
  )
}

/**
 * Container component for rendering multiple notifications
 * Positions notifications in a stack at the top-right of the screen
 */
interface NotificationContainerProps {
  notifications: NotificationState[]
  onClose: (id: string) => void
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  notifications, 
  onClose 
}) => {
  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  )
}
