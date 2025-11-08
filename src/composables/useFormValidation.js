export const useFormValidation = () => {
  const validateField = (field, value) => {
    if (field.required && !value && value !== 0 && value !== false) {
      return 'Это поле обязательно для заполнения'
    }
    
    if (!value && !field.required) {
      return null
    }
    
    if (field.minLength && typeof value === 'string' && value.length < field.minLength) {
      return `Минимальная длина: ${field.minLength} символов`
    }
    
    if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
      return `Максимальная длина: ${field.maxLength} символов`
    }
    
    if (field.type === 'number' && field.min !== undefined && Number(value) < field.min) {
      return `Минимальное значение: ${field.min}`
    }
    
    if (field.type === 'number' && field.max !== undefined && Number(value) > field.max) {
      return `Максимальное значение: ${field.max}`
    }
    
    if (field.pattern && value) {
      const regex = new RegExp(field.pattern)
      if (!regex.test(value)) {
        return 'Значение не соответствует требуемому формату'
      }
    }
    
    return null
  }

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

  const isFormValid = (schema, formData, errors, touched = {}) => {
    if (!schema.fields) return false
    
    const touchedFields = Object.keys(touched).filter(k => touched[k])
    
    if (touchedFields.length === 0) {
      return true
    }
    
    const hasTouchedErrors = touchedFields.some(key => errors[key])
    if (hasTouchedErrors) {
      return false
    }
    
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
