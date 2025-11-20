import * as fc from 'fast-check';
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../middleware/errorHandler.js';
import { ErrorResponse } from '../../types.js';
import { ZodError, z } from 'zod';

describe('Error Response Format Property Tests', () => {
  /**
   * Feature: crud-api, Property 13: Error responses include JSON body
   * Validates: Requirements 7.4
   */
  it('should return JSON error response for all error types', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          // Generate different error scenarios
          fc.constant({ type: '400-validation', statusCode: 400 }),
          fc.constant({ type: '404-not-found', statusCode: 404 }),
          fc.constant({ type: '500-internal', statusCode: 500 })
        ),
        fc.string({ minLength: 1, maxLength: 100 }), // Error message
        async (errorScenario, errorMessage) => {
          // Create a test Express app with error handler
          const app = express();
          app.use(express.json());

          // Create a route that throws the specified error type
          app.get('/test-error', (_req: Request, _res: Response, next: NextFunction) => {
            let error: Error;

            switch (errorScenario.type) {
              case '400-validation':
                // Simulate Zod validation error
                const schema = z.object({ field: z.string() });
                try {
                  schema.parse({ field: 123 }); // This will throw
                } catch (e) {
                  error = e as ZodError;
                }
                break;

              case '404-not-found':
                // Simulate custom error with statusCode
                error = new Error(errorMessage);
                (error as any).statusCode = 404;
                (error as any).name = 'NotFoundError';
                break;

              case '500-internal':
                // Simulate unexpected error
                error = new Error(errorMessage);
                break;

              default:
                error = new Error('Unknown error');
            }

            next(error!);
          });

          // Add error handler
          app.use(errorHandler);

          // Make request and verify response
          const response = await request(app).get('/test-error');

          // Verify status code matches expected
          expect(response.status).toBe(errorScenario.statusCode);

          // Verify response is JSON
          expect(response.headers['content-type']).toMatch(/application\/json/);

          // Verify response body has ErrorResponse structure
          const body = response.body as ErrorResponse;
          expect(body).toHaveProperty('error');
          expect(body).toHaveProperty('message');
          expect(body).toHaveProperty('statusCode');

          // Verify types
          expect(typeof body.error).toBe('string');
          expect(typeof body.message).toBe('string');
          expect(typeof body.statusCode).toBe('number');

          // Verify statusCode in body matches HTTP status
          expect(body.statusCode).toBe(errorScenario.statusCode);

          // Verify error and message are non-empty
          expect(body.error.length).toBeGreaterThan(0);
          expect(body.message.length).toBeGreaterThan(0);

          // For validation errors, verify details array exists
          if (errorScenario.type === '400-validation') {
            expect(body).toHaveProperty('details');
            expect(Array.isArray(body.details)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return consistent error format for validation errors with various field errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            path: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 3 }),
            message: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (fieldErrors) => {
          // Create a test Express app
          const app = express();
          app.use(express.json());

          // Create a route that throws a ZodError with custom issues
          app.get('/test-validation', (_req: Request, _res: Response, next: NextFunction) => {
            const zodError = new ZodError(
              fieldErrors.map(fe => ({
                code: 'custom' as const,
                path: fe.path,
                message: fe.message,
              }))
            );
            next(zodError);
          });

          app.use(errorHandler);

          // Make request
          const response = await request(app).get('/test-validation');

          // Verify response structure
          expect(response.status).toBe(400);
          expect(response.headers['content-type']).toMatch(/application\/json/);

          const body = response.body as ErrorResponse;
          expect(body.error).toBe('Validation Error');
          expect(body.message).toBe('Request validation failed');
          expect(body.statusCode).toBe(400);
          expect(Array.isArray(body.details)).toBe(true);
          expect(body.details!.length).toBe(fieldErrors.length);

          // Verify each detail contains path and message
          body.details!.forEach(detail => {
            expect(typeof detail).toBe('string');
            expect(detail.length).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
