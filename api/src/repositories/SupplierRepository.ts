import { v4 as uuidv4 } from 'uuid';
import { Supplier } from '../types.js';

export class SupplierRepository {
  private suppliers: Map<string, Supplier> = new Map();

  constructor() {
    this.initializeSeedData();
  }

  findAll(): Supplier[] {
    return Array.from(this.suppliers.values());
  }

  findById(id: string): Supplier | undefined {
    return this.suppliers.get(id);
  }

  private initializeSeedData(): void {
    const seedSuppliers: Supplier[] = [
      {
        id: uuidv4(),
        name: 'Tech Solutions Inc',
        email: 'contact@techsolutions.com',
        phone: '+1-555-0101',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: uuidv4(),
        name: 'Global Supplies Co',
        email: 'info@globalsupplies.com',
        phone: '+1-555-0202',
        createdAt: new Date('2024-02-20'),
      },
      {
        id: uuidv4(),
        name: 'Premium Products Ltd',
        email: 'sales@premiumproducts.com',
        createdAt: new Date('2024-03-10'),
      },
      {
        id: uuidv4(),
        name: 'Quality Goods LLC',
        email: 'support@qualitygoods.com',
        phone: '+1-555-0404',
        createdAt: new Date('2024-04-05'),
      },
    ];

    seedSuppliers.forEach(supplier => {
      this.suppliers.set(supplier.id, supplier);
    });
  }

  create(data: { name: string; email: string; phone?: string }): Supplier {
    const supplier: Supplier = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      createdAt: new Date(),
    };
    this.suppliers.set(supplier.id, supplier);
    return supplier;
  }

  // Method to get supplier IDs for seeding offers
  getSupplierIds(): string[] {
    return Array.from(this.suppliers.keys());
  }
}
