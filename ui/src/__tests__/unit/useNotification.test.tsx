import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { NotificationProvider, useNotification } from '../../hooks/useNotification'
import React from 'react'

describe('useNotification', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NotificationProvider>{children}</NotificationProvider>
  )

  it('should throw error when used outside NotificationProvider', () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      renderHook(() => useNotification())
    }).toThrow('useNotification must be used within a NotificationProvider')
    
    consoleError.mockRestore()
  })

  it('should add success notification', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })

    act(() => {
      result.current.showSuccess('Operation successful')
    })

    expect(result.current.notifications).toHaveLength(1)
    expect(result.current.notifications[0].message).toBe('Operation successful')
    expect(result.current.notifications[0].type).toBe('success')
  })

  it('should add error notification', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })

    act(() => {
      result.current.showError('Operation failed')
    })

    expect(result.current.notifications).toHaveLength(1)
    expect(result.current.notifications[0].message).toBe('Operation failed')
    expect(result.current.notifications[0].type).toBe('error')
  })

  it('should add info notification', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })

    act(() => {
      result.current.showInfo('Information message')
    })

    expect(result.current.notifications).toHaveLength(1)
    expect(result.current.notifications[0].message).toBe('Information message')
    expect(result.current.notifications[0].type).toBe('info')
  })

  it('should manage notification queue with multiple notifications', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })

    act(() => {
      result.current.showSuccess('First notification')
      result.current.showError('Second notification')
      result.current.showInfo('Third notification')
    })

    expect(result.current.notifications).toHaveLength(3)
    expect(result.current.notifications[0].message).toBe('First notification')
    expect(result.current.notifications[1].message).toBe('Second notification')
    expect(result.current.notifications[2].message).toBe('Third notification')
  })

  it('should manually dismiss notification', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })

    act(() => {
      result.current.showSuccess('Test notification')
    })

    const notificationId = result.current.notifications[0].id

    act(() => {
      result.current.dismissNotification(notificationId)
    })

    expect(result.current.notifications).toHaveLength(0)
  })

  it('should auto-dismiss notification after default duration', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })

    act(() => {
      result.current.showSuccess('Auto-dismiss test')
    })

    expect(result.current.notifications).toHaveLength(1)

    // Fast-forward time by 5000ms (default duration)
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.notifications).toHaveLength(0)
  })

  it('should auto-dismiss notification after custom duration', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })

    act(() => {
      result.current.showSuccess('Custom duration test', 3000)
    })

    expect(result.current.notifications).toHaveLength(1)

    // Fast-forward time by 2999ms (just before dismissal)
    act(() => {
      vi.advanceTimersByTime(2999)
    })

    expect(result.current.notifications).toHaveLength(1)

    // Fast-forward by 1ms more to trigger dismissal
    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(result.current.notifications).toHaveLength(0)
  })

  it('should generate unique IDs for each notification', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })

    act(() => {
      result.current.showSuccess('First')
      result.current.showSuccess('Second')
    })

    const ids = result.current.notifications.map((n) => n.id)
    expect(ids[0]).not.toBe(ids[1])
    expect(new Set(ids).size).toBe(2)
  })

  it('should set correct duration on notification', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })

    act(() => {
      result.current.showSuccess('Test', 7000)
    })

    expect(result.current.notifications[0].duration).toBe(7000)
  })

  it('should use default duration when not specified', () => {
    const { result } = renderHook(() => useNotification(), { wrapper })

    act(() => {
      result.current.showSuccess('Test')
    })

    expect(result.current.notifications[0].duration).toBe(5000)
  })
})
