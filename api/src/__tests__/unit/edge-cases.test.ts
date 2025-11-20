import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../middleware/index.js';
import { OfferRepository } from '../../repositories/OfferRepository.js';
import { SupplierRepository } from '../../repositories/SupplierRepository.js';
import { OfferService } from '../../services/OfferService.js';
import { SupplierService } from '../../services/SupplierService.js';
import { createOfferRouter } from '../../routes/offers.js';
import { createSupplierRouter } from '../../routes/suppliers.js';

describe('Edge Cases', () => {
  describe('Empty Collections', () => {
    let app: express.Application;

    beforeEach(() => {
      // Create empty repositories
      const emptySupplierRepository = new SupplierRepository();
      // Clear all suppliers to make it empty
      const supplierIds = emptySupplierRepository.getSupplierIds();
      supplierIds.forEach(id => {
        (emptySupplierRepository as any).suppliers.delete(id);
      });

      const emptyOfferRepository = new OfferRepository([]);
      
      const offerService = new OfferService(emptyOfferRepository, emptySupplierRepository);
      const supplierService = new SupplierService(emptySupplierRepository);

      app = express();
      app.use(express.json());
      app.use('/api', createOfferRouter(offerService));
      app.use('/api', createSupplierRouter(supplierService));
      app.use(errorHandler);
    });

    it('should return empty array with 200 status for GET /api/offers when no offers exist', async () => {
      const response = await request(app).get('/api/offers');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return empty array with 200 status for GET /api/suppliers when no suppliers exist', async () => {
      const response = await request(app).get('/api/suppliers');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Invalid ID Format', () => {
    let app: express.Application;

    beforeEach(() => {
      const supplierRepository = new SupplierRepository();
      const supplierIds = supplierRepository.getSupplierIds();
      const offerRepository = new OfferRepository(supplierIds);
      
      const offerService = new OfferService(offerRepository, supplierRepository);

      app = express();
      app.use(express.json());
      app.use('/api', createOfferRouter(offerService));
      app.use(errorHandler);
    });

    it('should return 400 status for GET /api/offer/:id with invalid UUID format', async () => {
      const response = await request(app).get('/api/offer/invalid-id-123');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('should return 400 status for PUT /api/offer/:id with invalid UUID format', async () => {
      const response = await request(app)
        .put('/api/offer/not-a-uuid')
        .send({
          title: 'Updated Offer',
          price: 100,
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('should return 400 status for DELETE /api/offer/:id with invalid UUID format', async () => {
      const response = await request(app).delete('/api/offer/12345');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('statusCode', 400);
    });
  });

  describe('Missing Required Fields', () => {
    let app: express.Application;

    beforeEach(() => {
      const supplierRepository = new SupplierRepository();
      const supplierIds = supplierRepository.getSupplierIds();
      const offerRepository = new OfferRepository(supplierIds);
      
      const offerService = new OfferService(offerRepository, supplierRepository);

      app = express();
      app.use(express.json());
      app.use('/api', createOfferRouter(offerService));
      app.use(errorHandler);
    });

    it('should return 400 with validation details when title is missing in POST /api/offers', async () => {
      const response = await request(app)
        .post('/api/offers')
        .send({
          description: 'Test description',
          price: 100,
          supplierId: '123e4567-e89b-12d3-a456-426614174000',
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('details');
      expect(response.body).toHaveProperty('statusCode', 400);
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 with validation details when price is missing in POST /api/offers', async () => {
      const response = await request(app)
        .post('/api/offers')
        .send({
          title: 'Test Offer',
          description: 'Test description',
          supplierId: '123e4567-e89b-12d3-a456-426614174000',
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('details');
      expect(response.body).toHaveProperty('statusCode', 400);
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 with validation details when supplierId is missing in POST /api/offers', async () => {
      const response = await request(app)
        .post('/api/offers')
        .send({
          title: 'Test Offer',
          description: 'Test description',
          price: 100,
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('details');
      expect(response.body).toHaveProperty('statusCode', 400);
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 with validation details when all fields are missing in POST /api/offers', async () => {
      const response = await request(app)
        .post('/api/offers')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('details');
      expect(response.body).toHaveProperty('statusCode', 400);
      expect(Array.isArray(response.body.details)).toBe(true);
      expect(response.body.details.length).toBeGreaterThan(0);
    });
  });

  describe('Unexpected Errors', () => {
    it('should return 500 status with generic error message for unexpected errors', async () => {
      const supplierRepository = new SupplierRepository();
      const supplierIds = supplierRepository.getSupplierIds();
      const offerRepository = new OfferRepository(supplierIds);
      
      // Create a custom service class that throws unexpected errors
      class ErrorThrowingOfferService extends OfferService {
        getAllOffers() {
          throw new Error('Unexpected database error');
        }
      }
      
      const offerService = new ErrorThrowingOfferService(offerRepository, supplierRepository);

      const app = express();
      app.use(express.json());
      app.use('/api', createOfferRouter(offerService));
      app.use(errorHandler);

      const response = await request(app).get('/api/offers');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
      expect(response.body).toHaveProperty('message', 'An unexpected error occurred');
      expect(response.body).toHaveProperty('statusCode', 500);
    });
  });
});
