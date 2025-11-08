import { reactive } from 'vue'

export const useFormData = (schema) => {
  const formData = reactive({})
  const errors = reactive({})
  const touched = reactive({})

  const getFieldKey = (field) => {
    return field.model || field.name
  }

  const initializeForm = (newSchema) => {
    Object.keys(formData).forEach(key => delete formData[key])
    Object.keys(errors).forEach(key => delete errors[key])
    Object.keys(touched).forEach(key => delete touched[key])
    
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

  const resetForm = () => {
    initializeForm(schema.value || schema)
  }

  const updateFieldValue = (key, value) => {
    formData[key] = value
  }

  const setFieldError = (key, error) => {
    if (error) {
      errors[key] = error
    } else {
      delete errors[key]
    }
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  const markAsTouched = (key) => {
    touched[key] = true
  }

  const isTouched = (key) => {
    return touched[key] === true
  }

  const getFormData = () => {
    return { ...formData }
  }

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
