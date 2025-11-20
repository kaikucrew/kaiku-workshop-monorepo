import type { Supplier } from '@/types'
import { apiGet } from './httpClient'

/**
 * SupplierService provides read operations for suppliers
 * Uses TanStack React Query compatible fetch functions
 */
export class SupplierService {
  /**
   * Fetch all suppliers
   * @returns Promise resolving to array of suppliers
   */
  async getAll(): Promise<Supplier[]> {
    return apiGet<Supplier[]>('/api/suppliers')
  }

  /**
   * Fetch a single supplier by ID
   * @param id - Supplier ID
   * @returns Promise resolving to the supplier
   */
  async getById(id: string): Promise<Supplier> {
    return apiGet<Supplier>(`/api/supplier/${id}`)
  }
}

/**
 * Default SupplierService instance
 */
export const supplierService = new SupplierService()

export default supplierService
