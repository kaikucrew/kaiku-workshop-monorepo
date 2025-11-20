import { v4 as uuidv4 } from 'uuid';
import { Offer } from '../types.js';

export class OfferRepository {
  private offers: Map<string, Offer> = new Map();

  constructor(supplierIds?: string[]) {
    if (supplierIds && supplierIds.length > 0) {
      this.initializeSeedData(supplierIds);
    }
  }

  findAll(): Offer[] {
    return Array.from(this.offers.values());
  }

  findById(id: string): Offer | undefined {
    return this.offers.get(id);
  }

  create(offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>): Offer {
    const now = new Date();
    const offer: Offer = {
      id: uuidv4(),
      ...offerData,
      createdAt: now,
      updatedAt: now,
    };
    this.offers.set(offer.id, offer);
    return offer;
  }

  update(id: string, data: Partial<Omit<Offer, 'id'>>): Offer | undefined {
    const existing = this.offers.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: Offer = {
      ...existing,
      ...data,
      id: existing.id, // Preserve ID
      updatedAt: new Date(),
    };
    this.offers.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.offers.delete(id);
  }

  private initializeSeedData(supplierIds: string[]): void {
    const seedOffers = [
      {
        title: 'Premium Laptop Bundle',
        description: 'High-performance laptop with accessories and extended warranty',
        price: 1299.99,
        supplierId: supplierIds[0],
      },
      {
        title: 'Office Furniture Set',
        description: 'Complete ergonomic office setup including desk, chair, and storage',
        price: 899.50,
        supplierId: supplierIds[1],
      },
      {
        title: 'Cloud Storage Plan',
        description: '1TB cloud storage with advanced security features for 1 year',
        price: 120.00,
        supplierId: supplierIds[0],
      },
      {
        title: 'Professional Camera Kit',
        description: 'DSLR camera with multiple lenses and photography accessories',
        price: 2499.99,
        supplierId: supplierIds[2],
      },
      {
        title: 'Smart Home Starter Pack',
        description: 'IoT devices bundle including smart lights, thermostat, and hub',
        price: 349.99,
        supplierId: supplierIds[1],
      },
      {
        title: 'Wireless Headphones',
        description: 'Noise-cancelling over-ear headphones with premium sound quality',
        price: 299.00,
        supplierId: supplierIds[3],
      },
      {
        title: 'Standing Desk Converter',
        description: 'Adjustable height desk converter for healthier work posture',
        price: 199.99,
        supplierId: supplierIds[1],
      },
      {
        title: 'Software Development Suite',
        description: 'Annual license for professional development tools and IDEs',
        price: 599.00,
        supplierId: supplierIds[0],
      },
      {
        title: 'Mechanical Keyboard',
        description: 'RGB backlit mechanical keyboard with custom switches',
        price: 159.99,
        supplierId: supplierIds[3],
      },
      {
        title: 'External SSD 2TB',
        description: 'High-speed portable solid state drive with USB-C connectivity',
        price: 249.99,
        supplierId: supplierIds[2],
      },
      {
        title: 'Video Conferencing Kit',
        description: 'HD webcam, microphone, and lighting setup for remote work',
        price: 399.00,
        supplierId: supplierIds[0],
      },
      {
        title: 'Ergonomic Mouse',
        description: 'Vertical ergonomic mouse with programmable buttons',
        price: 79.99,
        supplierId: supplierIds[3],
      },
      {
        title: 'Monitor Arm Mount',
        description: 'Dual monitor arm mount with cable management',
        price: 129.99,
        supplierId: supplierIds[1],
      },
      {
        title: 'Portable Power Bank',
        description: '20000mAh power bank with fast charging and multiple ports',
        price: 59.99,
        supplierId: supplierIds[2],
      },
      {
        title: 'Wireless Charging Station',
        description: 'Multi-device wireless charging pad for phones and accessories',
        price: 89.99,
        supplierId: supplierIds[3],
      },
    ];

    seedOffers.forEach(offerData => {
      this.create(offerData);
    });
  }
}
