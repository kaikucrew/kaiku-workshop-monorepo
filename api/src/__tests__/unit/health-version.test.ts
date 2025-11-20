import request from 'supertest'
import { app } from '../../server.js'

describe('Health Endpoint', () => {
  it('should return 200 status code', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
  })

  it('should return JSON response with status: "ok"', async () => {
    const response = await request(app).get('/health')
    expect(response.body).toEqual({ status: 'ok' })
  })
})

describe('Version Endpoint', () => {
  const originalEnv = process.env.API_VERSION

  afterEach(() => {
    // Restore original environment variable
    if (originalEnv !== undefined) {
      process.env.API_VERSION = originalEnv
    } else {
      delete process.env.API_VERSION
    }
  })

  it('should return 200 status code', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
  })

  it('should return "local" when API_VERSION is not set', async () => {
    delete process.env.API_VERSION
    const response = await request(app).get('/')
    expect(response.body).toEqual({ version: 'local' })
  })
})
