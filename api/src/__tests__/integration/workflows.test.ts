import request from 'supertest';
import express from 'express';
import { OfferRepository } from '../../repositories/OfferRepository.js';
import { SupplierRepository } from '../../repositories/SupplierRepository.js';
import { OfferService } from '../../services/OfferService.js';
import { SupplierService } from '../../services/SupplierService.js';
import { createOfferRouter } from '../../routes/offers.js';
import { createSupplierRouter } from '../../routes/suppliers.js';
import { errorHandler } from '../../middleware/index.js';

describe('Integration Tests - Complete Workflows', () => {
  let app: express.Application;
  let supplierRepository: SupplierRepository;
  let offerRepository: OfferRepository;
  let offerService: OfferService;
  let supplierService: SupplierService;

  beforeEach(() => {
    // Create fresh repositories and services for each test
    supplierRepository = new SupplierRepository();
    const supplierIds = supplierRepository.getSupplierIds();
    offerRepository = new OfferRepository(supplierIds);
    
    offerService = new OfferService(offerRepository, supplierRepository);
    supplierService = new SupplierService(supplierRepository);

    // Create Express app with all middleware and routes
    app = express();
    app.use(express.json());
    app.use('/api', createOfferRouter(offerService));
    app.use('/api', createSupplierRouter(supplierService));
    app.use(errorHandler);
  });

  describe('Complete Offer Lifecycle', () => {
    it('should complete full CRUD lifecycle: create, read, update, delete', async () => {
      // Get a valid supplier ID
      const suppliersResponse = await request(app).get('/api/suppliers');
      expect(suppliersResponse.status).toBe(200);
      const validSupplierId = suppliersResponse.body[0].id;

      // 1. CREATE - Create a new offer
      const createData = {
        title: 'Integration Test Offer',
        description: 'This is a test offer for integration testing',
        price: 99.99,
        supplierId: validSupplierId,
      };

      const createResponse = await request(app)
        .post('/api/offers')
        .send(createData);

      expect(createResponse.status).toBe(201);
      expect(createResponse.body).toHaveProperty('id');
      expect(createResponse.body.title).toBe(createData.title);
      expect(createResponse.body.description).toBe(createData.description);
      expect(createResponse.body.price).toBe(createData.price);
      expect(createResponse.body.supplierId).toBe(createData.supplierId);
      expect(createResponse.body).toHaveProperty('createdAt');
      expect(createResponse.body).toHaveProperty('updatedAt');

      const createdOfferId = createResponse.body.id;

      // 2. READ - Get the created offer by ID
      const getByIdResponse = await request(app).get(`/api/offer/${createdOfferId}`);

      expect(getByIdResponse.status).toBe(200);
      expect(getByIdResponse.body.id).toBe(createdOfferId);
      expect(getByIdResponse.body.title).toBe(createData.title);
      expect(getByIdResponse.body.description).toBe(createData.description);
      expect(getByIdResponse.body.price).toBe(createData.price);

      // 3. READ - Verify offer appears in list
      const getAllResponse = await request(app).get('/api/offers');

      expect(getAllResponse.status).toBe(200);
      expect(Array.isArray(getAllResponse.body)).toBe(true);
      const offerIds = getAllResponse.body.map((o: any) => o.id);
      expect(offerIds).toContain(createdOfferId);

      // 4. UPDATE - Update the offer
      const updateData = {
        title: 'Updated Integration Test Offer',
        description: 'This offer has been updated',
        price: 149.99,
      };

      const updateResponse = await request(app)
        .put(`/api/offer/${createdOfferId}`)
        .send(updateData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.id).toBe(createdOfferId);
      expect(updateResponse.body.title).toBe(updateData.title);
      expect(updateResponse.body.description).toBe(updateData.description);
      expect(updateResponse.body.price).toBe(updateData.price);

      // 5. READ - Verify update persisted
      const getUpdatedResponse = await request(app).get(`/api/offer/${createdOfferId}`);

      expect(getUpdatedResponse.status).toBe(200);
      expect(getUpdatedResponse.body.title).toBe(updateData.title);
      expect(getUpdatedResponse.body.description).toBe(updateData.description);
      expect(getUpdatedResponse.body.price).toBe(updateData.price);

      // 6. DELETE - Delete the offer
      const deleteResponse = await request(app).delete(`/api/offer/${createdOfferId}`);

      expect(deleteResponse.status).toBe(204);
      expect(deleteResponse.body).toEqual({});

      // 7. READ - Verify offer is deleted
      const getDeletedResponse = await request(app).get(`/api/offer/${createdOfferId}`);

      expect(getDeletedResponse.status).toBe(404);
      expect(getDeletedResponse.body).toHaveProperty('error');
      expect(getDeletedResponse.body).toHaveProperty('message');
      expect(getDeletedResponse.body.statusCode).toBe(404);

      // 8. READ - Verify offer no longer in list
      const getFinalListResponse = await request(app).get('/api/offers');

      expect(getFinalListResponse.status).toBe(200);
      const finalOfferIds = getFinalListResponse.body.map((o: any) => o.id);
      expect(finalOfferIds).not.toContain(createdOfferId);
    });

    it('should handle multiple offers in lifecycle independently', async () => {
      const suppliersResponse = await request(app).get('/api/suppliers');
      const validSupplierId = suppliersResponse.body[0].id;

      // Create first offer
      const offer1Data = {
        title: 'First Offer',
        description: 'First test offer',
        price: 50.00,
        supplierId: validSupplierId,
      };

      const create1Response = await request(app)
        .post('/api/offers')
        .send(offer1Data);

      expect(create1Response.status).toBe(201);
      const offer1Id = create1Response.body.id;

      // Create second offer
      const offer2Data = {
        title: 'Second Offer',
        description: 'Second test offer',
        price: 75.00,
        supplierId: validSupplierId,
      };

      const create2Response = await request(app)
        .post('/api/offers')
        .send(offer2Data);

      expect(create2Response.status).toBe(201);
      const offer2Id = create2Response.body.id;

      // Verify both exist
      const getAllResponse = await request(app).get('/api/offers');
      const offerIds = getAllResponse.body.map((o: any) => o.id);
      expect(offerIds).toContain(offer1Id);
      expect(offerIds).toContain(offer2Id);

      // Update first offer
      const updateResponse = await request(app)
        .put(`/api/offer/${offer1Id}`)
        .send({ title: 'Updated First Offer' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe('Updated First Offer');

      // Verify second offer unchanged
      const get2Response = await request(app).get(`/api/offer/${offer2Id}`);
      expect(get2Response.status).toBe(200);
      expect(get2Response.body.title).toBe('Second Offer');

      // Delete first offer
      const deleteResponse = await request(app).delete(`/api/offer/${offer1Id}`);
      expect(deleteResponse.status).toBe(204);

      // Verify first deleted, second still exists
      const get1AfterDelete = await request(app).get(`/api/offer/${offer1Id}`);
      expect(get1AfterDelete.status).toBe(404);

      const get2AfterDelete = await request(app).get(`/api/offer/${offer2Id}`);
      expect(get2AfterDelete.status).toBe(200);
      expect(get2AfterDelete.body.title).toBe('Second Offer');
    });
  });

  describe('Error Handling Across Endpoints', () => {
    it('should handle 404 errors consistently across GET, PUT, and DELETE', async () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174999';

      // GET non-existent offer
      const getResponse = await request(app).get(`/api/offer/${nonExistentId}`);
      expect(getResponse.status).toBe(404);
      expect(getResponse.body).toHaveProperty('error');
      expect(getResponse.body).toHaveProperty('message');
      expect(getResponse.body).toHaveProperty('statusCode', 404);

      // PUT non-existent offer
      const putResponse = await request(app)
        .put(`/api/offer/${nonExistentId}`)
        .send({ title: 'Updated Title' });

      expect(putResponse.status).toBe(404);
      expect(putResponse.body).toHaveProperty('error');
      expect(putResponse.body).toHaveProperty('message');
      expect(putResponse.body).toHaveProperty('statusCode', 404);

      // DELETE non-existent offer
      const deleteResponse = await request(app).delete(`/api/offer/${nonExistentId}`);
      expect(deleteResponse.status).toBe(404);
      expect(deleteResponse.body).toHaveProperty('error');
      expect(deleteResponse.body).toHaveProperty('message');
      expect(deleteResponse.body).toHaveProperty('statusCode', 404);
    });

    it('should handle 400 validation errors consistently across POST and PUT', async () => {
      const suppliersResponse = await request(app).get('/api/suppliers');
      const validSupplierId = suppliersResponse.body[0].id;

      // Create offer with invalid data (negative price)
      const invalidCreateData = {
        title: 'Test Offer',
        description: 'Test description',
        price: -10,
        supplierId: validSupplierId,
      };

      const postResponse = await request(app)
        .post('/api/offers')
        .send(invalidCreateData);

      expect(postResponse.status).toBe(400);
      expect(postResponse.body).toHaveProperty('error');
      expect(postResponse.body).toHaveProperty('message');
      expect(postResponse.body).toHaveProperty('statusCode', 400);

      // Create a valid offer first
      const validData = {
        title: 'Valid Offer',
        description: 'Valid description',
        price: 100,
        supplierId: validSupplierId,
      };

      const createResponse = await request(app)
        .post('/api/offers')
        .send(validData);

      const offerId = createResponse.body.id;

      // Update with invalid data (empty title)
      const invalidUpdateData = {
        title: '',
      };

      const putResponse = await request(app)
        .put(`/api/offer/${offerId}`)
        .send(invalidUpdateData);

      expect(putResponse.status).toBe(400);
      expect(putResponse.body).toHaveProperty('error');
      expect(putResponse.body).toHaveProperty('message');
      expect(putResponse.body).toHaveProperty('statusCode', 400);
    });

    it('should handle invalid UUID format consistently', async () => {
      const invalidId = 'not-a-valid-uuid';

      // GET with invalid ID
      const getResponse = await request(app).get(`/api/offer/${invalidId}`);
      expect(getResponse.status).toBe(400);
      expect(getResponse.body).toHaveProperty('statusCode', 400);

      // PUT with invalid ID
      const putResponse = await request(app)
        .put(`/api/offer/${invalidId}`)
        .send({ title: 'Test' });

      expect(putResponse.status).toBe(400);
      expect(putResponse.body).toHaveProperty('statusCode', 400);

      // DELETE with invalid ID
      const deleteResponse = await request(app).delete(`/api/offer/${invalidId}`);
      expect(deleteResponse.status).toBe(400);
      expect(deleteResponse.body).toHaveProperty('statusCode', 400);
    });

    it('should handle non-existent supplier ID during offer creation', async () => {
      const nonExistentSupplierId = '123e4567-e89b-12d3-a456-426614174888';

      const createData = {
        title: 'Test Offer',
        description: 'Test description',
        price: 100,
        supplierId: nonExistentSupplierId,
      };

      const response = await request(app)
        .post('/api/offers')
        .send(createData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Supplier');
    });
  });

  describe('Validation Error Messages', () => {
    it('should provide detailed field information for missing required fields', async () => {
      // Missing all required fields
      const response = await request(app)
        .post('/api/offers')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('details');
      expect(response.body).toHaveProperty('statusCode', 400);
      
      // Verify details is an array with field information
      expect(Array.isArray(response.body.details)).toBe(true);
      expect(response.body.details.length).toBeGreaterThan(0);
      
      // Check that details mention the missing fields
      const detailsString = response.body.details.join(' ');
      expect(detailsString).toMatch(/title|description|price|supplierId/i);
    });

    it('should provide field-specific validation errors for invalid data types', async () => {
      const invalidData = {
        title: 'Test Offer',
        description: 'Test description',
        price: 'not-a-number', // Invalid type
        supplierId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const response = await request(app)
        .post('/api/offers')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
      
      // Check that details mention the price field
      const detailsString = response.body.details.join(' ');
      expect(detailsString).toMatch(/price/i);
    });

    it('should provide field-specific validation errors for constraint violations', async () => {
      const suppliersResponse = await request(app).get('/api/suppliers');
      const validSupplierId = suppliersResponse.body[0].id;

      // Title too long
      const longTitleData = {
        title: 'a'.repeat(201), // Exceeds 200 character limit
        description: 'Test description',
        price: 100,
        supplierId: validSupplierId,
      };

      const titleResponse = await request(app)
        .post('/api/offers')
        .send(longTitleData);

      expect(titleResponse.status).toBe(400);
      expect(titleResponse.body).toHaveProperty('details');
      expect(Array.isArray(titleResponse.body.details)).toBe(true);
      
      const titleDetails = titleResponse.body.details.join(' ');
      expect(titleDetails).toMatch(/title/i);

      // Negative price
      const negativePriceData = {
        title: 'Test Offer',
        description: 'Test description',
        price: -50,
        supplierId: validSupplierId,
      };

      const priceResponse = await request(app)
        .post('/api/offers')
        .send(negativePriceData);

      expect(priceResponse.status).toBe(400);
      expect(priceResponse.body).toHaveProperty('details');
      
      const priceDetails = priceResponse.body.details.join(' ');
      expect(priceDetails).toMatch(/price/i);
    });

    it('should provide validation errors for multiple invalid fields', async () => {
      const multipleErrorsData = {
        title: '', // Empty
        description: 'a'.repeat(1001), // Too long
        price: 0, // Not positive
        supplierId: 'invalid-uuid', // Invalid format
      };

      const response = await request(app)
        .post('/api/offers')
        .send(multipleErrorsData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
      
      // Should have multiple error messages
      expect(response.body.details.length).toBeGreaterThan(1);
      
      const detailsString = response.body.details.join(' ');
      // Check that multiple fields are mentioned
      expect(detailsString).toMatch(/title|description|price|supplierId/i);
    });

    it('should provide clear validation errors during update operations', async () => {
      const suppliersResponse = await request(app).get('/api/suppliers');
      const validSupplierId = suppliersResponse.body[0].id;

      // Create a valid offer first
      const createData = {
        title: 'Valid Offer',
        description: 'Valid description',
        price: 100,
        supplierId: validSupplierId,
      };

      const createResponse = await request(app)
        .post('/api/offers')
        .send(createData);

      const offerId = createResponse.body.id;

      // Update with invalid data
      const invalidUpdateData = {
        title: '', // Empty
        price: -10, // Negative
      };

      const updateResponse = await request(app)
        .put(`/api/offer/${offerId}`)
        .send(invalidUpdateData);

      expect(updateResponse.status).toBe(400);
      expect(updateResponse.body).toHaveProperty('details');
      expect(Array.isArray(updateResponse.body.details)).toBe(true);
      expect(updateResponse.body.details.length).toBeGreaterThan(0);
      
      const detailsString = updateResponse.body.details.join(' ');
      expect(detailsString).toMatch(/title|price/i);
    });
  });
});
