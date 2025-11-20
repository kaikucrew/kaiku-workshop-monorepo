import * as fc from 'fast-check';
import express from 'express';
import request from 'supertest';
import { SupplierRepository } from '../../repositories/SupplierRepository.js';
import { SupplierService } from '../../services/SupplierService.js';
import { createSupplierRouter } from '../../routes/suppliers.js';
import { errorHandler } from '../../middleware/errorHandler.js';

// Helper function to create a test app
function createTestApp() {
  const supplierRepository = new SupplierRepository();
  const supplierService = new SupplierService(supplierRepository);
  
  const app = express();
  app.use(express.json());
  app.use('/api', createSupplierRouter(supplierService));
  app.use(errorHandler);
  
  return { app, supplierService };
}

describe('Supplier Routes Property Tests', () => {
  /**
   * Feature: crud-api, Property 11: Get all suppliers returns complete collection
   * Validates: Requirements 6.1, 6.3
   */
  it('should return all suppliers with status 200', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null), // No input needed, we test with existing seed data
        async () => {
          const { app, supplierService } = createTestApp();
          
          // Get expected suppliers from service
          const expectedSuppliers = supplierService.getAllSuppliers();
          
          // Make request
          const response = await request(app).get('/api/suppliers');
          
          // Verify status code
          expect(response.status).toBe(200);
          
          // Verify response is an array
          expect(Array.isArray(response.body)).toBe(true);
          
          // Verify all suppliers are returned
          expect(response.body.length).toBe(expectedSuppliers.length);
          
          // Verify each supplier is present
          const responseIds = new Set(response.body.map((s: any) => s.id));
          expectedSuppliers.forEach(supplier => {
            expect(responseIds.has(supplier.id)).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
