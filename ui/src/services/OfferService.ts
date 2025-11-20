import type { Offer, CreateOfferData, UpdateOfferData } from '@/types'
import { apiGet, apiPost, apiPut, apiDelete } from './httpClient'

/**
 * OfferService provides CRUD operations for offers
 * Uses TanStack React Query compatible fetch functions
 */
export class OfferService {
  /**
   * Fetch all offers
   * @returns Promise resolving to array of offers
   */
  async getAll(): Promise<Offer[]> {
    return apiGet<Offer[]>('/api/offers')
  }

  /**
   * Fetch a single offer by ID
   * @param id - Offer ID
   * @returns Promise resolving to the offer
   */
  async getById(id: string): Promise<Offer> {
    return apiGet<Offer>(`/api/offer/${id}`)
  }

  /**
   * Create a new offer
   * @param data - Offer creation data
   * @returns Promise resolving to the created offer
   */
  async create(data: CreateOfferData): Promise<Offer> {
    return apiPost<Offer>('/api/offers', data)
  }

  /**
   * Update an existing offer
   * @param id - Offer ID
   * @param data - Offer update data
   * @returns Promise resolving to the updated offer
   */
  async update(id: string, data: UpdateOfferData): Promise<Offer> {
    return apiPut<Offer>(`/api/offer/${id}`, data)
  }

  /**
   * Delete an offer
   * @param id - Offer ID
   * @returns Promise resolving when deletion is complete
   */
  async delete(id: string): Promise<void> {
    return apiDelete<void>(`/api/offer/${id}`)
  }
}

/**
 * Default OfferService instance
 */
export const offerService = new OfferService()

export default offerService
