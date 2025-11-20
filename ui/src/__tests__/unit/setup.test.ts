import { describe, it, expect } from 'vitest'

describe('Test Setup', () => {
  it('should run basic tests', () => {
    expect(true).toBe(true)
  })

  it('should support TypeScript', () => {
    const value: string = 'test'
    expect(value).toBe('test')
  })
})
