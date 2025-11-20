import type { OfferFormData, ValidationErrors } from '@/types'

/**
 * ValidationService provides client-side validation for offer forms
 * Validates according to requirements 7.1, 7.2, 7.3, 7.4
 */
export class ValidationService {
  /**
   * Validate offer title
   * Requirements: 7.1 - Title must not be empty and must not exceed 200 characters
   * @param title - Title to validate
   * @returns Error message if invalid, null if valid
   */
  validateTitle(title: string): string | null {
    if (!title || title.trim().length === 0) {
      return 'Title is required'
    }
    
    if (title.length > 200) {
      return 'Title must not exceed 200 characters'
    }
    
    return null
  }

  /**
   * Validate offer description
   * Requirements: 7.2 - Description must not be empty and must not exceed 1000 characters
   * @param description - Description to validate
   * @returns Error message if invalid, null if valid
   */
  validateDescription(description: string): string | null {
    if (!description || description.trim().length === 0) {
      return 'Description is required'
    }
    
    if (description.length > 1000) {
      return 'Description must not exceed 1000 characters'
    }
    
    return null
  }

  /**
   * Validate offer price
   * Requirements: 7.3 - Price must be a positive number
   * @param price - Price to validate
   * @returns Error message if invalid, null if valid
   */
  validatePrice(price: number): string | null {
    if (typeof price !== 'number' || isNaN(price)) {
      return 'Price must be a valid number'
    }
    
    if (price <= 0) {
      return 'Price must be a positive number'
    }
    
    return null
  }

  /**
   * Validate supplier selection
   * Requirements: 7.4 - A supplier must be selected
   * @param supplierId - Supplier ID to validate
   * @returns Error message if invalid, null if valid
   */
  validateSupplier(supplierId: string | null | undefined): string | null {
    if (!supplierId || supplierId.trim().length === 0) {
      return 'Supplier is required'
    }
    
    return null
  }

  /**
   * Validate entire offer form
   * Validates all fields and returns all validation errors
   * @param data - Form data to validate
   * @returns Object containing validation errors for each field
   */
  validateOfferForm(data: OfferFormData): ValidationErrors {
    const errors: ValidationErrors = {}

    const titleError = this.validateTitle(data.title)
    if (titleError) {
      errors.title = titleError
    }

    const descriptionError = this.validateDescription(data.description)
    if (descriptionError) {
      errors.description = descriptionError
    }

    const priceError = this.validatePrice(data.price)
    if (priceError) {
      errors.price = priceError
    }

    const supplierError = this.validateSupplier(data.supplierId)
    if (supplierError) {
      errors.supplierId = supplierError
    }

    return errors
  }

  /**
   * Check if form has any validation errors
   * @param errors - Validation errors object
   * @returns True if there are any errors, false otherwise
   */
  hasErrors(errors: ValidationErrors): boolean {
    return Object.keys(errors).length > 0
  }
}

/**
 * Default ValidationService instance
 */
export const validationService = new ValidationService()

export default validationService
