import request from 'supertest'
import { app } from '../../server.js'
import * as fc from 'fast-check'

describe('Version Endpoint Property Tests', () => {
  const originalEnv = process.env.API_VERSION

  afterEach(() => {
    // Restore original environment variable
    if (originalEnv !== undefined) {
      process.env.API_VERSION = originalEnv
    } else {
      delete process.env.API_VERSION
    }
  })

  /**
   * Feature: health-version-endpoints, Property 1: Version reflects environment variable
   * Validates: Requirements 2.2
   */
  it('should return version matching API_VERSION environment variable', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate realistic version strings (alphanumeric, dots, dashes, underscores)
        // Avoid strings that could be JavaScript prototype properties or cause security issues
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,48}[a-zA-Z0-9]$/),
        async (versionString) => {
          // Set the environment variable
          process.env.API_VERSION = versionString

          // Make request to version endpoint
          const response = await request(app).get('/')

          // Verify response matches the environment variable
          expect(response.status).toBe(200)
          expect(response.body.version).toBe(versionString)
        }
      ),
      { numRuns: 100 }
    )
  })
})
