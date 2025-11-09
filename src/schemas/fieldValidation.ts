import { z } from 'zod'
import type { FormField } from '../types'

export const createFieldSchema = (field: FormField) => {
  let schema: z.ZodType

  switch (field.type) {
    case 'number':
      schema = z.coerce.number({
        message: 'Введите корректное число'
      })

      if (field.min !== undefined) {
        schema = (schema as z.ZodNumber).min(field.min, {
          message: `Минимальное значение: ${field.min}`
        })
      }

      if (field.max !== undefined) {
        schema = (schema as z.ZodNumber).max(field.max, {
          message: `Максимальное значение: ${field.max}`
        })
      }
      break

    case 'email':
      schema = z.string().email({
        message: 'Введите корректный email адрес'
      })
      break

    case 'checkbox':
      schema = z.boolean({
        message: 'Должно быть булевым значением'
      })

      if (field.required) {
        schema = (schema as z.ZodBoolean).refine((val) => val === true, {
          message: 'Это поле обязательно для заполнения'
        })
      }
      break

    default:
      schema = z.string()

      if (field.minLength !== undefined) {
        schema = (schema as z.ZodString).min(field.minLength, {
          message: `Минимальная длина: ${field.minLength} символов`
        })
      }

      if (field.maxLength !== undefined) {
        schema = (schema as z.ZodString).max(field.maxLength, {
          message: `Максимальная длина: ${field.maxLength} символов`
        })
      }

      if (field.pattern) {
        schema = (schema as z.ZodString).regex(new RegExp(field.pattern), {
          message: 'Значение не соответствует требуемому формату'
        })
      }
      break
  }

  if (field.required) {
    if (field.type === 'checkbox') {
      // Already handled above
    } else if (field.type === 'number') {
      schema = schema
    } else {
      schema = (schema as z.ZodString).min(1, {
        message: 'Это поле обязательно для заполнения'
      })
    }
  } else {
    schema = schema.optional().or(z.literal(''))
  }

  return schema
}

export const validateFieldValue = (field: FormField, value: unknown): string | null => {
  const schema = createFieldSchema(field)
  
  try {
    schema.parse(value)
    return null
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Ошибка валидации'
    }
    return 'Ошибка валидации'
  }
}

