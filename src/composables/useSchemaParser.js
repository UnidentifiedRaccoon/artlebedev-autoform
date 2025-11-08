import { ref, computed } from 'vue'

export const useSchemaParser = () => {
  const schemaText = ref('')
  const jsonError = ref('')

  const parseSchema = (text) => {
    if (!text || !text.trim()) {
      jsonError.value = ''
      return null
    }

    try {
      const parsed = JSON.parse(text)
      
      const validationError = validateSchemaStructure(parsed)
      if (validationError) {
        jsonError.value = validationError
        return null
      }
      
      jsonError.value = ''
      return parsed
    } catch (error) {
      jsonError.value = error.message
      return null
    }
  }

  const formatSchema = (text) => {
    if (!text || !text.trim()) {
      return text
    }

    try {
      const parsed = JSON.parse(text)
      return JSON.stringify(parsed, null, 2)
    } catch (error) {
      return text
    }
  }

  const validateSchemaStructure = (schema) => {
    if (!schema || typeof schema !== 'object') {
      return 'Схема должна быть объектом'
    }

    if (!schema.fields) {
      return 'Схема должна содержать поле "fields"'
    }

    if (!Array.isArray(schema.fields)) {
      return 'Поле "fields" должно быть массивом'
    }

    for (let i = 0; i < schema.fields.length; i++) {
      const field = schema.fields[i]
      
      if (!field.type) {
        return `Поле #${i + 1}: отсутствует обязательное свойство "type"`
      }

      if (!field.label) {
        return `Поле #${i + 1}: отсутствует обязательное свойство "label"`
      }

      if (!field.model && !field.name) {
        return `Поле #${i + 1}: отсутствует обязательное свойство "model" или "name"`
      }

      const validTypes = ['text', 'email', 'password', 'number', 'textarea', 'select', 'checkbox', 'radio']
      if (!validTypes.includes(field.type)) {
        return `Поле #${i + 1}: неподдерживаемый тип "${field.type}"`
      }

      if ((field.type === 'select' || field.type === 'radio') && !field.options) {
        return `Поле #${i + 1}: для типа "${field.type}" требуется свойство "options"`
      }

      if (field.options && !Array.isArray(field.options)) {
        return `Поле #${i + 1}: свойство "options" должно быть массивом`
      }
    }

    return null
  }

  const updateSchemaText = (text) => {
    schemaText.value = text
  }

  const clearSchema = () => {
    schemaText.value = ''
    jsonError.value = ''
  }

  const isSchemaValid = computed(() => {
    return !jsonError.value && schemaText.value.trim() !== ''
  })

  return {
    schemaText,
    jsonError,
    isSchemaValid,
    parseSchema,
    formatSchema,
    validateSchemaStructure,
    updateSchemaText,
    clearSchema
  }
}

