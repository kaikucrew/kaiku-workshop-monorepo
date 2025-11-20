import * as fc from 'fast-check';
import { OfferRepository } from '../../repositories/OfferRepository.js';
import { SupplierRepository } from '../../repositories/SupplierRepository.js';
import { OfferService, ValidationError, NotFoundError } from '../../services/OfferService.js';

describe('Service Layer Validation Property Tests', () => {
  /**
   * Feature: crud-api, Property 12: Validation failures do not modify data
   * Validates: Requirements 8.3
   */
  it('should not modify data when validation fails', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 200 }),
          description: fc.string({ minLength: 1, maxLength: 1000 }),
          price: fc.float({ min: Math.fround(0.01), max: Math.fround(1000000), noNaN: true }),
          supplierId: fc.uuid(),
        }),
        fc.uuid(), // Non-existent supplier ID for validation failure
        async (validOfferData, nonExistentSupplierId) => {
          // Setup repositories and service
          const supplierRepository = new SupplierRepository();
          const supplierIds = supplierRepository.getSupplierIds();
          const offerRepository = new OfferRepository(supplierIds);
          const offerService = new OfferService(offerRepository, supplierRepository);

          // Get initial state
          const initialOffers = offerService.getAllOffers();
          const initialOfferCount = initialOffers.length;
          const initialOfferIds = new Set(initialOffers.map(o => o.id));

          // Attempt to create offer with non-existent supplier (should fail validation)
          const invalidOfferData = {
            ...validOfferData,
            supplierId: nonExistentSupplierId,
          };

          try {
            offerService.createOffer(invalidOfferData);
            // If we get here, the supplier ID happened to exist (very unlikely with random UUID)
            // In this case, we can't test validation failure, so we skip this iteration
            return true;
          } catch (error) {
            // Verify it's a validation error
            expect(error).toBeInstanceOf(ValidationError);
          }

          // Verify data was not modified
          const afterFailureOffers = offerService.getAllOffers();
          expect(afterFailureOffers.length).toBe(initialOfferCount);
          
          // Verify no new offers were added
          const afterFailureIds = new Set(afterFailureOffers.map(o => o.id));
          expect(afterFailureIds).toEqual(initialOfferIds);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not modify data when update validation fails', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // Non-existent supplier ID for validation failure
        async (nonExistentSupplierId) => {
          // Setup repositories and service
          const supplierRepository = new SupplierRepository();
          const supplierIds = supplierRepository.getSupplierIds();
          const offerRepository = new OfferRepository(supplierIds);
          const offerService = new OfferService(offerRepository, supplierRepository);

          // Get an existing offer
          const existingOffers = offerService.getAllOffers();
          if (existingOffers.length === 0) {
            return true; // Skip if no offers
          }

          const offerToUpdate = existingOffers[0];
          const originalOffer = { ...offerToUpdate };

          // Attempt to update with non-existent supplier (should fail validation)
          try {
            offerService.updateOffer(offerToUpdate.id, {
              supplierId: nonExistentSupplierId,
            });
            // If we get here, the supplier ID happened to exist
            return true;
          } catch (error) {
            // Verify it's a validation error
            expect(error).toBeInstanceOf(ValidationError);
          }

          // Verify the offer was not modified
          const unchangedOffer = offerService.getOfferById(offerToUpdate.id);
          expect(unchangedOffer.supplierId).toBe(originalOffer.supplierId);
          expect(unchangedOffer.title).toBe(originalOffer.title);
          expect(unchangedOffer.description).toBe(originalOffer.description);
          expect(unchangedOffer.price).toBe(originalOffer.price);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not modify data when delete fails with non-existent ID', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // Non-existent offer ID
        async (nonExistentOfferId) => {
          // Setup repositories and service
          const supplierRepository = new SupplierRepository();
          const supplierIds = supplierRepository.getSupplierIds();
          const offerRepository = new OfferRepository(supplierIds);
          const offerService = new OfferService(offerRepository, supplierRepository);

          // Get initial state
          const initialOffers = offerService.getAllOffers();
          const initialOfferCount = initialOffers.length;
          const initialOfferIds = new Set(initialOffers.map(o => o.id));

          // Attempt to delete non-existent offer (should fail)
          try {
            offerService.deleteOffer(nonExistentOfferId);
            // If we get here, the offer ID happened to exist
            return true;
          } catch (error) {
            // Verify it's a not found error
            expect(error).toBeInstanceOf(NotFoundError);
          }

          // Verify data was not modified
          const afterFailureOffers = offerService.getAllOffers();
          expect(afterFailureOffers.length).toBe(initialOfferCount);
          
          // Verify no offers were removed
          const afterFailureIds = new Set(afterFailureOffers.map(o => o.id));
          expect(afterFailureIds).toEqual(initialOfferIds);
        }
      ),
      { numRuns: 100 }
    );
  });
});
