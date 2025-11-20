import * as fc from 'fast-check';
import { OfferRepository } from '../../repositories/OfferRepository.js';

describe('Offer Repository Property Tests', () => {
  /**
   * Feature: crud-api, Property 4: Created offer IDs are unique
   * Validates: Requirements 2.3
   */
  it('should assign unique IDs to all created offers', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 200 }),
            description: fc.string({ minLength: 1, maxLength: 1000 }),
            price: fc.float({ min: Math.fround(0.01), max: Math.fround(1000000), noNaN: true }),
            supplierId: fc.uuid(),
          }),
          { minLength: 1, maxLength: 100 }
        ),
        async (offerDataArray) => {
          const repository = new OfferRepository();
          const createdIds = new Set<string>();

          // Create all offers and collect their IDs
          for (const offerData of offerDataArray) {
            const offer = repository.create(offerData);
            
            // Check that this ID hasn't been seen before
            expect(createdIds.has(offer.id)).toBe(false);
            
            // Add to the set of seen IDs
            createdIds.add(offer.id);
          }

          // Verify all IDs are unique (set size equals array length)
          expect(createdIds.size).toBe(offerDataArray.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
