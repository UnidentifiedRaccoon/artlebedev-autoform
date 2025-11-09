import { ref, computed } from 'vue'
import type { FormSchema, ParseResult } from '../types'

export const useSchemaParser = () => {
  const schemaText = ref('')
  const jsonError = ref('')

  const parseSchema = (text: string): ParseResult => {
    if (!text || !text.trim()) {
      return { schema: null, error: '' }
    }

    try {
      const parsed = JSON.parse(text)

      const validationError = validateSchemaStructure(parsed)
      if (validationError) {
        return { schema: null, error: validationError }
      }

      return { schema: parsed as FormSchema, error: '' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
      return { schema: null, error: `Ошибка парсинга JSON: ${errorMessage}` }
    }
  }

  const formatSchema = (text: string): string => {
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

  const validateSchemaStructure = (schema: unknown): string | null => {
    if (!schema || typeof schema !== 'object') {
      return 'Схема должна быть объектом'
    }

    const schemaObj = schema as Record<string, unknown>

    if (!schemaObj.fields) {
      return 'Схема должна содержать поле "fields"'
    }

    if (!Array.isArray(schemaObj.fields)) {
      return 'Поле "fields" должно быть массивом'
    }

    const fields = schemaObj.fields as Array<Record<string, unknown>>

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]

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
      if (!validTypes.includes(field.type as string)) {
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

  const updateSchemaText = (text: string): void => {
    schemaText.value = text
  }

  const clearSchema = (): void => {
    schemaText.value = ''
    jsonError.value = ''
  }

  const isSchemaValid = computed(() => !jsonError.value && schemaText.value.trim() !== '')

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

