import { reactive, computed } from 'vue'

/**
 * Composable for managing form data state
 */
export function useFormData(schema) {
  const formData = reactive({})
  const errors = reactive({})

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
    
    // Initialize with default values
    if (newSchema && newSchema.fields) {
      newSchema.fields.forEach(field => {
        const key = getFieldKey(field)
        if (field.type === 'checkbox') {
          formData[key] = field.defaultValue ?? false
        } else {
          formData[key] = field.defaultValue ?? ''
        }
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
   * Get form data as plain object
   * @returns {Object} - Form data
   */
  const getFormData = () => {
    return { ...formData }
  }

  return {
    formData,
    errors,
    getFieldKey,
    initializeForm,
    resetForm,
    updateFieldValue,
    setFieldError,
    clearErrors,
    getFormData
  }
}

