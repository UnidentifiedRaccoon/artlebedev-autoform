import { reactive } from 'vue'
import type { FormSchema, FormField, FormData, FormErrors, TouchedFields, DetailedFormState } from '../types'

export const useFormData = (schema: FormSchema) => {
  const formData = reactive<FormData>({})
  const errors = reactive<FormErrors>({})
  const touched = reactive<TouchedFields>({})

  const getFieldKey = (field: FormField): string => {
    return field.model || field.name || ''
  }

  const initializeForm = (newSchema: FormSchema): void => {
    Object.keys(formData).forEach(key => delete formData[key])
    Object.keys(errors).forEach(key => delete errors[key])
    Object.keys(touched).forEach(key => delete touched[key])

    if (newSchema && newSchema.fields) {
      newSchema.fields.forEach(field => {
        const key = getFieldKey(field)
        if (!key) return
        
        if (field.type === 'checkbox') {
          formData[key] = field.defaultValue ?? false
        } else if (field.type === 'number') {
          formData[key] = field.defaultValue ?? ''
        } else {
          formData[key] = field.defaultValue ?? ''
        }
        touched[key] = false
      })
    }
  }

  const resetForm = (): void => {
    initializeForm(schema)
  }

  const updateFieldValue = (key: string, value: string | number | boolean): void => {
    formData[key] = value
  }

  const setFieldError = (key: string, error: string | null): void => {
    if (error) {
      errors[key] = error
    } else {
      delete errors[key]
    }
  }

  const clearErrors = (): void => {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  const markAsTouched = (key: string): void => {
    touched[key] = true
  }

  const isTouched = (key: string): boolean => {
    return touched[key] === true
  }

  const getFormData = (): FormData => {
    return { ...formData }
  }

  const getDetailedFormState = (): DetailedFormState => {
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

