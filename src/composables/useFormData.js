import { reactive, computed } from 'vue'

/**
 * Composable for managing form data state
 */
export function useFormData(schema) {
  const formData = reactive({})
  const errors = reactive({})
  const touched = reactive({})

  /**
   * Get field key (supports both 'model' and 'name')
   * @param {Object} field - Field configuration object
   * @returns {string} - Field key
   */
  const getFieldKey = (field) => {
    return field.model || field.name
  }

  /**
   * Initialize form data with default values based on schema
   * @param {Object} newSchema - Form schema
   */
  const initializeForm = (newSchema) => {
    // Clear existing data
    Object.keys(formData).forEach(key => delete formData[key])
    Object.keys(errors).forEach(key => delete errors[key])
    Object.keys(touched).forEach(key => delete touched[key])
    
    // Initialize with default values
    if (newSchema && newSchema.fields) {
      newSchema.fields.forEach(field => {
        const key = getFieldKey(field)
        if (field.type === 'checkbox') {
          formData[key] = field.defaultValue ?? false
        } else {
          formData[key] = field.defaultValue ?? ''
        }
        touched[key] = false
      })
    }
  }

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    initializeForm(schema.value || schema)
  }

  /**
   * Update field value
   * @param {string} key - Field key
   * @param {any} value - New value
   */
  const updateFieldValue = (key, value) => {
    formData[key] = value
  }

  /**
   * Set field error
   * @param {string} key - Field key
   * @param {string|null} error - Error message
   */
  const setFieldError = (key, error) => {
    if (error) {
      errors[key] = error
    } else {
      delete errors[key]
    }
  }

  /**
   * Clear all errors
   */
  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  /**
   * Mark field as touched
   * @param {string} key - Field key
   */
  const markAsTouched = (key) => {
    touched[key] = true
  }

  /**
   * Check if field is touched
   * @param {string} key - Field key
   * @returns {boolean}
   */
  const isTouched = (key) => {
    return touched[key] === true
  }

  /**
   * Get form data as plain object
   * @returns {Object} - Form data
   */
  const getFormData = () => {
    return { ...formData }
  }

  /**
   * Get detailed form state
   * @returns {Object} - Detailed state with data, errors, and metadata
   */
  const getDetailedFormState = () => {
    return {
      data: { ...formData },
      errors: { ...errors },
      validation: {
        errorCount: Object.keys(errors).length,
        touchedCount: Object.keys(touched).filter(k => touched[k]).length
      }
    }
  }

  return {
    formData,
    errors,
    touched,
    getFieldKey,
    initializeForm,
    resetForm,
    updateFieldValue,
    setFieldError,
    clearErrors,
    markAsTouched,
    isTouched,
    getFormData,
    getDetailedFormState
  }
}

