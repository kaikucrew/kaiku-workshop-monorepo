// ============================================================================
// Core Data Models (mapped from API layer)
// ============================================================================

/**
 * Offer entity representing a product offer
 * Mapped from API Offer with ISO 8601 date strings
 */
export interface Offer {
  id: string
  title: string
  description: string
  price: number
  supplierId: string
  supplierName: string
  createdAt: string // ISO 8601 date string
  updatedAt: string // ISO 8601 date string
}

/**
 * Supplier entity
 * Mapped from API Supplier with ISO 8601 date strings
 */
export interface Supplier {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: string // ISO 8601 date string
}

// ============================================================================
// Form Data Types
// ============================================================================

/**
 * Form data for creating or editing an offer
 */
export interface OfferFormData {
  title: string
  description: string
  price: number
  supplierId: string
}

/**
 * Data required to create a new offer
 */
export interface CreateOfferData extends OfferFormData {}

/**
 * Data required to update an existing offer
 * All fields are required in the UI form
 */
export interface UpdateOfferData extends OfferFormData {}

/**
 * Validation errors for offer form fields
 */
export interface ValidationErrors {
  title?: string
  description?: string
  price?: string
  supplierId?: string
}

// ============================================================================
// UI State Types
// ============================================================================

/**
 * Notification type for user feedback
 */
export type NotificationType = 'success' | 'error' | 'info'

/**
 * State for managing notifications
 */
export interface NotificationState {
  id: string
  message: string
  type: NotificationType
  duration: number
}

/**
 * State for managing confirmation dialogs
 */
export interface DialogState {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
}

/**
 * Loading state for async operations
 */
export interface LoadingState {
  isLoading: boolean
  error: Error | null
}

// ============================================================================
// API Response Types (mapped from API layer)
// ============================================================================

/**
 * Error response from API
 * Mapped from API ErrorResponse interface
 */
export interface ApiError {
  error: string
  message: string
  details?: string[]
  statusCode: number
}

/**
 * Generic API response wrapper for successful operations
 */
export interface ApiResponse<T> {
  data: T
  message?: string
}

/**
 * API response for list operations
 */
export interface ApiListResponse<T> {
  data: T[]
  total: number
  page?: number
  pageSize?: number
}
