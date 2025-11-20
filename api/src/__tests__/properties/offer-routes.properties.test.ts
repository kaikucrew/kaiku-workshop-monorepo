import * as fc from 'fast-check';
import express from 'express';
import request from 'supertest';
import { OfferRepository } from '../../repositories/OfferRepository.js';
import { SupplierRepository } from '../../repositories/SupplierRepository.js';
import { OfferService } from '../../services/OfferService.js';
import { createOfferRouter } from '../../routes/offers.js';
import { errorHandler } from '../../middleware/errorHandler.js';

// Helper function to create a test app
function createTestApp() {
  const supplierRepository = new SupplierRepository();
  const supplierIds = supplierRepository.getSupplierIds();
  const offerRepository = new OfferRepository(supplierIds);
  const offerService = new OfferService(offerRepository, supplierRepository);
  
  const app = express();
  app.use(express.json());
  app.use('/api', createOfferRouter(offerService));
  app.use(errorHandler);
  
  return { app, offerService, supplierRepository };
}

describe('Offer Routes Property Tests', () => {
  /**
   * Feature: crud-api, Property 1: Get all offers returns complete collection
   * Validates: Requirements 1.1, 1.3
   */
  it('should return all offers with status 200', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null), // No input needed, we test with existing seed data
        async () => {
          const { app, offerService } = createTestApp();
          
          // Get expected offers from service
          const expectedOffers = offerService.getAllOffers();
          
          // Make request
          const response = await request(app).get('/api/offers');
          
          // Verify status code
          expect(response.status).toBe(200);
          
          // Verify response is an array
          expect(Array.isArray(response.body)).toBe(true);
          
          // Verify all offers are returned
          expect(response.body.length).toBe(expectedOffers.length);
          
          // Verify each offer is present
          const responseIds = new Set(response.body.map((o: any) => o.id));
          expectedOffers.forEach(offer => {
            expect(responseIds.has(offer.id)).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: crud-api, Property 2: Create offer with valid data succeeds
   * Validates: Requirements 2.1, 2.3
   */
  it('should create offer with valid data and return 201', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 200 }),
          description: fc.string({ minLength: 1, maxLength: 1000 }),
          price: fc.float({ min: Math.fround(0.01), max: Math.fround(1000000), noNaN: true }),
        }),
        async (offerData) => {
          const { app, supplierRepository } = createTestApp();
          
          // Get a valid supplier ID
          const suppliers = supplierRepository.findAll();
          const validSupplierId = suppliers[0].id;
          
          const createData = {
            ...offerData,
            supplierId: validSupplierId,
          };
          
          // Make request
          const response = await request(app)
            .post('/api/offers')
            .send(createData);
          
          // Verify status code
          expect(response.status).toBe(201);
          
          // Verify response contains created offer
          expect(response.body).toHaveProperty('id');
          expect(response.body.title).toBe(createData.title);
          expect(response.body.description).toBe(createData.description);
          expect(response.body.price).toBeCloseTo(createData.price, 2);
          expect(response.body.supplierId).toBe(createData.supplierId);
          expect(response.body).toHaveProperty('createdAt');
          expect(response.body).toHaveProperty('updatedAt');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: crud-api, Property 3: Invalid offer data is rejected
   * Validates: Requirements 2.2, 2.4, 7.2
   */
  it('should reject invalid offer data with 400', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          // Missing required fields
          fc.record({
            description: fc.string({ minLength: 1, maxLength: 1000 }),
            price: fc.float({ min: Math.fround(0.01), max: Math.fround(1000000), noNaN: true }),
          }),
          // Invalid price (negative or zero)
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 200 }),
            description: fc.string({ minLength: 1, maxLength: 1000 }),
            price: fc.oneof(
              fc.constant(0),
              fc.float({ max: Math.fround(-0.01), noNaN: true })
            ),
            supplierId: fc.uuid(),
          }),
          // Empty title
          fc.record({
            title: fc.constant(''),
            description: fc.string({ minLength: 1, maxLength: 1000 }),
            price: fc.float({ min: Math.fround(0.01), max: Math.fround(1000000), noNaN: true }),
            supplierId: fc.uuid(),
          }),
          // Title too long
          fc.record({
            title: fc.string({ minLength: 201, maxLength: 300 }),
            description: fc.string({ minLength: 1, maxLength: 1000 }),
            price: fc.float({ min: Math.fround(0.01), max: Math.fround(1000000), noNaN: true }),
            supplierId: fc.uuid(),
          })
        ),
        async (invalidData) => {
          const { app } = createTestApp();
          
          // Make request
          const response = await request(app)
            .post('/api/offers')
            .send(invalidData);
          
          // Verify status code is 400
          expect(response.status).toBe(400);
          
          // Verify error response structure
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('statusCode');
          expect(response.body.statusCode).toBe(400);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: crud-api, Property 5: Get offer by ID returns correct data
   * Validates: Requirements 3.1
   */
  it('should return correct offer data by ID with status 200', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null),
        async () => {
          const { app, offerService } = createTestApp();
          
          // Get an existing offer
          const offers = offerService.getAllOffers();
          if (offers.length === 0) {
            return true; // Skip if no offers
          }
          
          const existingOffer = offers[0];
          
          // Make request
          const response = await request(app).get(`/api/offer/${existingOffer.id}`);
          
          // Verify status code
          expect(response.status).toBe(200);
          
          // Verify correct offer is returned
          expect(response.body.id).toBe(existingOffer.id);
          expect(response.body.title).toBe(existingOffer.title);
          expect(response.body.description).toBe(existingOffer.description);
          expect(response.body.price).toBe(existingOffer.price);
          expect(response.body.supplierId).toBe(existingOffer.supplierId);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: crud-api, Property 6: Get non-existent offer returns 404
   * Validates: Requirements 3.2, 5.2
   */
  it('should return 404 for non-existent offer ID', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        async (nonExistentId) => {
          const { app, offerService } = createTestApp();
          
          // Verify the ID doesn't exist
          const offers = offerService.getAllOffers();
          const existingIds = new Set(offers.map(o => o.id));
          
          if (existingIds.has(nonExistentId)) {
            return true; // Skip if ID happens to exist
          }
          
          // Make request
          const response = await request(app).get(`/api/offer/${nonExistentId}`);
          
          // Verify status code
          expect(response.status).toBe(404);
          
          // Verify error response structure
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('statusCode');
          expect(response.body.statusCode).toBe(404);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: crud-api, Property 7: Update offer with valid data succeeds
   * Validates: Requirements 4.1, 4.4
   */
  it('should update offer with valid data and preserve ID', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 200 }),
          description: fc.string({ minLength: 1, maxLength: 1000 }),
          price: fc.float({ min: Math.fround(0.01), max: Math.fround(1000000), noNaN: true }),
        }),
        async (updateData) => {
          const { app, offerService, supplierRepository } = createTestApp();
          
          // Get an existing offer
          const offers = offerService.getAllOffers();
          if (offers.length === 0) {
            return true; // Skip if no offers
          }
          
          const existingOffer = offers[0];
          const originalId = existingOffer.id;
          
          // Get a valid supplier ID
          const suppliers = supplierRepository.findAll();
          const validSupplierId = suppliers[0].id;
          
          const updatePayload = {
            ...updateData,
            supplierId: validSupplierId,
          };
          
          // Make request
          const response = await request(app)
            .put(`/api/offer/${originalId}`)
            .send(updatePayload);
          
          // Verify status code
          expect(response.status).toBe(200);
          
          // Verify ID is preserved
          expect(response.body.id).toBe(originalId);
          
          // Verify data is updated
          expect(response.body.title).toBe(updatePayload.title);
          expect(response.body.description).toBe(updatePayload.description);
          expect(response.body.price).toBeCloseTo(updatePayload.price, 2);
          expect(response.body.supplierId).toBe(updatePayload.supplierId);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: crud-api, Property 8: Update non-existent offer returns 404
   * Validates: Requirements 4.2
   */
  it('should return 404 when updating non-existent offer', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        async (nonExistentId, updateData) => {
          const { app, offerService } = createTestApp();
          
          // Verify the ID doesn't exist
          const offers = offerService.getAllOffers();
          const existingIds = new Set(offers.map(o => o.id));
          
          if (existingIds.has(nonExistentId)) {
            return true; // Skip if ID happens to exist
          }
          
          // Make request
          const response = await request(app)
            .put(`/api/offer/${nonExistentId}`)
            .send(updateData);
          
          // Verify status code
          expect(response.status).toBe(404);
          
          // Verify error response structure
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('statusCode');
          expect(response.body.statusCode).toBe(404);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: crud-api, Property 9: Update with invalid data is rejected
   * Validates: Requirements 4.3, 7.2
   */
  it('should reject update with invalid data with 400', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          // Invalid price (negative or zero)
          fc.record({
            price: fc.oneof(
              fc.constant(0),
              fc.float({ max: Math.fround(-0.01), noNaN: true })
            ),
          }),
          // Empty title
          fc.record({
            title: fc.constant(''),
          }),
          // Title too long
          fc.record({
            title: fc.string({ minLength: 201, maxLength: 300 }),
          }),
          // Description too long
          fc.record({
            description: fc.string({ minLength: 1001, maxLength: 1500 }),
          })
        ),
        async (invalidUpdateData) => {
          const { app, offerService } = createTestApp();
          
          // Get an existing offer
          const offers = offerService.getAllOffers();
          if (offers.length === 0) {
            return true; // Skip if no offers
          }
          
          const existingOffer = offers[0];
          
          // Make request
          const response = await request(app)
            .put(`/api/offer/${existingOffer.id}`)
            .send(invalidUpdateData);
          
          // Verify status code is 400
          expect(response.status).toBe(400);
          
          // Verify error response structure
          expect(response.body).toHaveProperty('error');
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('statusCode');
          expect(response.body.statusCode).toBe(400);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: crud-api, Property 10: Delete offer removes it completely
   * Validates: Requirements 5.1, 5.3
   */
  it('should delete offer and make it non-retrievable', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 200 }),
          description: fc.string({ minLength: 1, maxLength: 1000 }),
          price: fc.float({ min: Math.fround(0.01), max: Math.fround(1000000), noNaN: true }),
        }),
        async (offerData) => {
          const { app, offerService, supplierRepository } = createTestApp();
          
          // Get a valid supplier ID
          const suppliers = supplierRepository.findAll();
          const validSupplierId = suppliers[0].id;
          
          // Create an offer to delete
          const createData = {
            ...offerData,
            supplierId: validSupplierId,
          };
          
          const createResponse = await request(app)
            .post('/api/offers')
            .send(createData);
          
          const createdOfferId = createResponse.body.id;
          
          // Delete the offer
          const deleteResponse = await request(app)
            .delete(`/api/offer/${createdOfferId}`);
          
          // Verify status code is 204
          expect(deleteResponse.status).toBe(204);
          
          // Verify offer is no longer retrievable
          const getResponse = await request(app)
            .get(`/api/offer/${createdOfferId}`);
          
          expect(getResponse.status).toBe(404);
          
          // Verify offer is not in the list
          const allOffersResponse = await request(app).get('/api/offers');
          const offerIds = allOffersResponse.body.map((o: any) => o.id);
          expect(offerIds).not.toContain(createdOfferId);
        }
      ),
      { numRuns: 100 }
    );
  });
});
