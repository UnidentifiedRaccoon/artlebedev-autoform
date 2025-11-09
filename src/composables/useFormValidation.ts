import type { FormField, FormSchema, FormData, FormErrors, TouchedFields } from '../types'
import { validateFieldValue } from '../schemas/fieldValidation'

export const useFormValidation = () => {
  const validateField = (field: FormField, value: unknown): string | null => {
    return validateFieldValue(field, value)
  }

  const validateForm = (schema: FormSchema, formData: FormData): FormErrors => {
    const errors: FormErrors = {}
    
    if (!schema.fields) {
      return errors
    }
    
    schema.fields.forEach(field => {
      const key = field.model || field.name
      if (!key) return
      
      const value = formData[key]
      const error = validateField(field, value)
      
      if (error) {
        errors[key] = error
      }
    })
    
    return errors
  }

  const isFormValid = (
    schema: FormSchema, 
    formData: FormData, 
    errors: FormErrors, 
    touched: TouchedFields = {}
  ): boolean => {
    if (!schema.fields) return false
    
    const hasAllRequiredFields = schema.fields.every(field => {
      const key = field.model || field.name
      if (!key) return true
      
      if (field.required) {
        const value = formData[key]
        if (!value && value !== 0 && value !== false) {
          return false
        }
      }
      return true
    })
    
    if (!hasAllRequiredFields) {
      return false
    }
    
    const touchedFields = Object.keys(touched).filter(k => touched[k])
    const hasTouchedErrors = touchedFields.some(key => errors[key])
    
    return !hasTouchedErrors
  }

  const shouldShowError = (fieldKey: string, errors: FormErrors, touched: TouchedFields): boolean => {
    return touched[fieldKey] === true && !!errors[fieldKey]
  }

  return {
    validateField,
    validateForm,
    isFormValid,
    shouldShowError
  }
}

