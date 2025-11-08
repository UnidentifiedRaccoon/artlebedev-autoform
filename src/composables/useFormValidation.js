/**
 * Composable for form field validation
 */
export function useFormValidation() {
  /**
   * Validate a single field based on its configuration
   * @param {Object} field - Field configuration object
   * @param {any} value - Current field value
   * @returns {string|null} - Error message or null if valid
   */
  const validateField = (field, value) => {
    // Required validation
    if (field.required && !value && value !== 0 && value !== false) {
      return 'Это поле обязательно для заполнения'
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !field.required) {
      return null
    }
    
    // MinLength validation (for strings)
    if (field.minLength && typeof value === 'string' && value.length < field.minLength) {
      return `Минимальная длина: ${field.minLength} символов`
    }
    
    // MaxLength validation (for strings)
    if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
      return `Максимальная длина: ${field.maxLength} символов`
    }
    
    // Min validation (for numbers)
    if (field.type === 'number' && field.min !== undefined && Number(value) < field.min) {
      return `Минимальное значение: ${field.min}`
    }
    
    // Max validation (for numbers)
    if (field.type === 'number' && field.max !== undefined && Number(value) > field.max) {
      return `Максимальное значение: ${field.max}`
    }
    
    // Pattern validation (regex)
    if (field.pattern && value) {
      const regex = new RegExp(field.pattern)
      if (!regex.test(value)) {
        return 'Значение не соответствует требуемому формату'
      }
    }
    
    return null
  }

  /**
   * Validate entire form
   * @param {Object} schema - Form schema
   * @param {Object} formData - Current form data
   * @returns {Object} - Object with field keys and error messages
   */
  const validateForm = (schema, formData) => {
    const errors = {}
    
    if (!schema.fields) {
      return errors
    }
    
    schema.fields.forEach(field => {
      const key = field.model || field.name
      const value = formData[key]
      const error = validateField(field, value)
      
      if (error) {
        errors[key] = error
      }
    })
    
    return errors
  }

  /**
   * Check if form is valid
   * @param {Object} schema - Form schema
   * @param {Object} formData - Current form data
   * @param {Object} errors - Current errors object
   * @param {Object} touched - Touched fields object
   * @returns {boolean} - True if form is valid
   */
  const isFormValid = (schema, formData, errors, touched = {}) => {
    if (!schema.fields) return false
    
    // Get list of touched fields
    const touchedFields = Object.keys(touched).filter(k => touched[k])
    
    // If no fields are touched, consider form as valid (pristine state)
    if (touchedFields.length === 0) {
      return true
    }
    
    // Check if there are any errors in touched fields
    const hasTouchedErrors = touchedFields.some(key => errors[key])
    if (hasTouchedErrors) {
      return false
    }
    
    // Check required fields that are touched
    return touchedFields.every(key => {
      const field = schema.fields.find(f => (f.model || f.name) === key)
      if (!field) return true
      
      const value = formData[key]
      
      if (field.required && !value && value !== 0 && value !== false) {
        return false
      }
      
      return true
    })
  }

  /**
   * Check if error should be shown for a field
   * @param {string} fieldKey - Field key
   * @param {Object} errors - Current errors object
   * @param {Object} touched - Touched fields object
   * @returns {boolean} - True if error should be shown
   */
  const shouldShowError = (fieldKey, errors, touched) => {
    return touched[fieldKey] === true && !!errors[fieldKey]
  }

  return {
    validateField,
    validateForm,
    isFormValid,
    shouldShowError
  }
}

