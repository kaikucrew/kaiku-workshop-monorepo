import { SupplierRepository } from '../repositories/SupplierRepository.js';
import { Supplier, CreateSupplierDTO } from '../types.js';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class SupplierService {
  constructor(private supplierRepository: SupplierRepository) {}

  getAllSuppliers(): Supplier[] {
    return this.supplierRepository.findAll();
  }

  getSupplierById(id: string): Supplier {
    const supplier = this.supplierRepository.findById(id);
    if (!supplier) {
      throw new NotFoundError(`Supplier with id ${id} not found`);
    }
    return supplier;
  }

  createSupplier(data: CreateSupplierDTO): Supplier {
    return this.supplierRepository.create(data);
  }
}
