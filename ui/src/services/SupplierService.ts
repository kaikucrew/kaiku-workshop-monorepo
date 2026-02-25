import type { Supplier, CreateSupplierData } from '@/types'
import { apiGet, apiPost } from './httpClient'

/**
 * SupplierService provides operations for suppliers
 */
export class SupplierService {
  async getAll(): Promise<Supplier[]> {
    return apiGet<Supplier[]>('/api/suppliers')
  }

  async getById(id: string): Promise<Supplier> {
    return apiGet<Supplier>(`/api/supplier/${id}`)
  }

  async create(data: CreateSupplierData): Promise<Supplier> {
    return apiPost<Supplier>('/api/suppliers', data)
  }
}

export const supplierService = new SupplierService()
export default supplierService
