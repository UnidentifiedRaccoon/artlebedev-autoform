import { ref, computed } from 'vue'

/**
 * Composable for parsing and validating JSON schemas
 */
export function useSchemaParser() {
  const schemaText = ref('')
  const jsonError = ref('')

  /**
   * Parse JSON schema from text
   * @param {string} text - JSON text
   * @returns {Object|null} - Parsed schema or null if error
   */
  const parseSchema = (text) => {
    if (!text || !text.trim()) {
      jsonError.value = ''
      return null
    }

    try {
      const parsed = JSON.parse(text)
      
      // Validate schema structure
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

  /**
   * Format JSON schema text
   * @param {string} text - JSON text
   * @returns {string} - Formatted JSON or original text if error
   */
  const formatSchema = (text) => {
    if (!text || !text.trim()) {
      return text
    }

    try {
      const parsed = JSON.parse(text)
      return JSON.stringify(parsed, null, 2)
    } catch (error) {
      // Return original text if formatting fails
      return text
    }
  }

  /**
   * Validate schema structure
   * @param {Object} schema - Parsed schema object
   * @returns {string|null} - Error message or null if valid
   */
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

    // Validate each field
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

      // Validate field type
      const validTypes = ['text', 'email', 'password', 'number', 'textarea', 'select', 'checkbox', 'radio']
      if (!validTypes.includes(field.type)) {
        return `Поле #${i + 1}: неподдерживаемый тип "${field.type}"`
      }

      // Validate options for select and radio
      if ((field.type === 'select' || field.type === 'radio') && !field.options) {
        return `Поле #${i + 1}: для типа "${field.type}" требуется свойство "options"`
      }

      if (field.options && !Array.isArray(field.options)) {
        return `Поле #${i + 1}: свойство "options" должно быть массивом`
      }
    }

    return null
  }

  /**
   * Update schema text
   * @param {string} text - New schema text
   */
  const updateSchemaText = (text) => {
    schemaText.value = text
  }

  /**
   * Clear schema
   */
  const clearSchema = () => {
    schemaText.value = ''
    jsonError.value = ''
  }

  /**
   * Check if schema is valid
   */
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

