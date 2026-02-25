import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const apiKey = process.env.API_AUTH_KEY;

  if (!apiKey) {
    next();
    return;
  }

  if (req.headers['x-api-key'] !== apiKey) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing API key',
      statusCode: 401,
    });
    return;
  }

  next();
}
