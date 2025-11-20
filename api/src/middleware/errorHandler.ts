import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ErrorResponse } from '../types.js';

/**
 * Global error handling middleware
 * Catches all errors and formats them into consistent ErrorResponse format
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errorResponse: ErrorResponse = {
      error: 'Validation Error',
      message: 'Request validation failed',
      details: err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      statusCode: 400,
    };
    res.status(400).json(errorResponse);
    return;
  }

  // Handle custom errors with statusCode property
  if ('statusCode' in err && typeof (err as any).statusCode === 'number') {
    const statusCode = (err as any).statusCode;
    const errorResponse: ErrorResponse = {
      error: err.name || 'Error',
      message: err.message,
      statusCode: statusCode,
    };
    res.status(statusCode).json(errorResponse);
    return;
  }

  // Handle unexpected errors
  console.error('Unexpected error:', err);
  const errorResponse: ErrorResponse = {
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    statusCode: 500,
  };
  res.status(500).json(errorResponse);
}
