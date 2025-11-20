import { OfferRepository } from '../repositories/OfferRepository.js';
import { SupplierRepository } from '../repositories/SupplierRepository.js';
import { Offer, CreateOfferDTO, UpdateOfferDTO } from '../types.js';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public details?: string[]) {
    super(message);
    this.name = 'ValidationError';
  }
}

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

export class OfferService {
  constructor(
    private offerRepository: OfferRepository,
    private supplierRepository: SupplierRepository
  ) {}

  getAllOffers(): Offer[] {
    return this.offerRepository.findAll();
  }

  getOfferById(id: string): Offer {
    if (!isValidUUID(id)) {
      throw new ValidationError('Invalid ID format', ['id: Must be a valid UUID']);
    }
    const offer = this.offerRepository.findById(id);
    if (!offer) {
      throw new NotFoundError(`Offer with id ${id} not found`);
    }
    return offer;
  }

  createOffer(data: CreateOfferDTO): Offer {
    // Validate that supplier exists
    const supplier = this.supplierRepository.findById(data.supplierId);
    if (!supplier) {
      throw new ValidationError(
        `Supplier with id ${data.supplierId} does not exist`,
        ['supplierId: Supplier not found']
      );
    }

    return this.offerRepository.create(data);
  }

  updateOffer(id: string, data: UpdateOfferDTO): Offer {
    if (!isValidUUID(id)) {
      throw new ValidationError('Invalid ID format', ['id: Must be a valid UUID']);
    }
    
    // Check if offer exists
    const existingOffer = this.offerRepository.findById(id);
    if (!existingOffer) {
      throw new NotFoundError(`Offer with id ${id} not found`);
    }

    // If supplierId is being updated, validate that supplier exists
    if (data.supplierId) {
      const supplier = this.supplierRepository.findById(data.supplierId);
      if (!supplier) {
        throw new ValidationError(
          `Supplier with id ${data.supplierId} does not exist`,
          ['supplierId: Supplier not found']
        );
      }
    }

    const updated = this.offerRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Offer with id ${id} not found`);
    }
    return updated;
  }

  deleteOffer(id: string): void {
    if (!isValidUUID(id)) {
      throw new ValidationError('Invalid ID format', ['id: Must be a valid UUID']);
    }
    const deleted = this.offerRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Offer with id ${id} not found`);
    }
  }
}
