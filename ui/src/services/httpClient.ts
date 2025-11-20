import type { ApiError } from '@/types'

/**
 * Custom error class for API errors
 * Used by TanStack React Query for error handling
 */
export class ApiErrorException extends Error {
  statusCode: number
  details?: string[]
  error: string

  constructor(error: ApiError) {
    super(error.message)
    this.name = 'ApiErrorException'
    this.error = error.error
    this.statusCode = error.statusCode
    this.details = error.details
  }
}

/**
 * Base API URL configuration
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Parse error response from API
 */
async function parseError(response: Response): Promise<ApiErrorException> {
  try {
    const errorData: ApiError = await response.json()
    return new ApiErrorException(errorData)
  } catch {
    // If response is not JSON, create a generic error
    return new ApiErrorException({
      error: 'API Error',
      message: response.statusText || 'An unexpected error occurred',
      statusCode: response.status
    })
  }
}

/**
 * HTTP Client wrapper for TanStack React Query
 * Provides fetch functions that can be used with useQuery and useMutation
 */

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw await parseError(response)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiErrorException) {
      throw error
    }

    if (error instanceof TypeError) {
      throw new ApiErrorException({
        error: 'Network Error',
        message: 'Failed to connect to the server. Please check your internet connection.',
        statusCode: 0
      })
    }

    throw new ApiErrorException({
      error: 'Unknown Error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      statusCode: 0
    })
  }
}

/**
 * POST request
 */
export async function apiPost<T>(endpoint: string, data?: unknown): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined
    })

    if (!response.ok) {
      throw await parseError(response)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiErrorException) {
      throw error
    }

    if (error instanceof TypeError) {
      throw new ApiErrorException({
        error: 'Network Error',
        message: 'Failed to connect to the server. Please check your internet connection.',
        statusCode: 0
      })
    }

    throw new ApiErrorException({
      error: 'Unknown Error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      statusCode: 0
    })
  }
}

/**
 * PUT request
 */
export async function apiPut<T>(endpoint: string, data?: unknown): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined
    })

    if (!response.ok) {
      throw await parseError(response)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiErrorException) {
      throw error
    }

    if (error instanceof TypeError) {
      throw new ApiErrorException({
        error: 'Network Error',
        message: 'Failed to connect to the server. Please check your internet connection.',
        statusCode: 0
      })
    }

    throw new ApiErrorException({
      error: 'Unknown Error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      statusCode: 0
    })
  }
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw await parseError(response)
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiErrorException) {
      throw error
    }

    if (error instanceof TypeError) {
      throw new ApiErrorException({
        error: 'Network Error',
        message: 'Failed to connect to the server. Please check your internet connection.',
        statusCode: 0
      })
    }

    throw new ApiErrorException({
      error: 'Unknown Error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      statusCode: 0
    })
  }
}
