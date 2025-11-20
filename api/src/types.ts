import { z } from 'zod';

// ============================================================================
// Entity Interfaces
// ============================================================================

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  supplierId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
}

// ============================================================================
// Validation Schemas (Zod)
// ============================================================================

export const CreateOfferSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  price: z.number().positive(),
  supplierId: z.string().uuid(),
});

export const UpdateOfferSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(1000).optional(),
  price: z.number().positive().optional(),
  supplierId: z.string().uuid().optional(),
});

// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================

export type CreateOfferDTO = z.infer<typeof CreateOfferSchema>;
export type UpdateOfferDTO = z.infer<typeof UpdateOfferSchema>;

// ============================================================================
// Error Response Interface
// ============================================================================

export interface ErrorResponse {
  error: string;
  message: string;
  details?: string[];
  statusCode: number;
}
