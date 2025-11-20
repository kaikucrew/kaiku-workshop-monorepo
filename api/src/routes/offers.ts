import { Router, Request, Response, NextFunction } from 'express';
import { OfferService, NotFoundError, ValidationError } from '../services/OfferService.js';
import { CreateOfferSchema, UpdateOfferSchema } from '../types.js';
import { validateRequest } from '../middleware/validation.js';

export function createOfferRouter(offerService: OfferService): Router {
  const router = Router();

  // GET /api/offers - List all offers
  router.get('/offers', (req: Request, res: Response, next: NextFunction) => {
    try {
      const offers = offerService.getAllOffers();
      res.status(200).json(offers);
    } catch (error) {
      next(error);
    }
  });

  // POST /api/offers - Create new offer
  router.post(
    '/offers',
    validateRequest(CreateOfferSchema),
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const offer = offerService.createOffer(req.body);
        res.status(201).json(offer);
      } catch (error) {
        if (error instanceof ValidationError) {
          res.status(400).json({
            error: error.name,
            message: error.message,
            details: error.details,
            statusCode: 400,
          });
        } else {
          next(error);
        }
      }
    }
  );

  // GET /api/offer/:id - Get offer by ID
  router.get('/offer/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      const offer = offerService.getOfferById(req.params.id);
      res.status(200).json(offer);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          error: error.name,
          message: error.message,
          statusCode: 404,
        });
      } else if (error instanceof ValidationError) {
        res.status(400).json({
          error: error.name,
          message: error.message,
          details: error.details,
          statusCode: 400,
        });
      } else {
        next(error);
      }
    }
  });

  // PUT /api/offer/:id - Update offer
  router.put(
    '/offer/:id',
    validateRequest(UpdateOfferSchema),
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const offer = offerService.updateOffer(req.params.id, req.body);
        res.status(200).json(offer);
      } catch (error) {
        if (error instanceof NotFoundError) {
          res.status(404).json({
            error: error.name,
            message: error.message,
            statusCode: 404,
          });
        } else if (error instanceof ValidationError) {
          res.status(400).json({
            error: error.name,
            message: error.message,
            details: error.details,
            statusCode: 400,
          });
        } else {
          next(error);
        }
      }
    }
  );

  // DELETE /api/offer/:id - Delete offer
  router.delete('/offer/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      offerService.deleteOffer(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          error: error.name,
          message: error.message,
          statusCode: 404,
        });
      } else if (error instanceof ValidationError) {
        res.status(400).json({
          error: error.name,
          message: error.message,
          details: error.details,
          statusCode: 400,
        });
      } else {
        next(error);
      }
    }
  });

  return router;
}
