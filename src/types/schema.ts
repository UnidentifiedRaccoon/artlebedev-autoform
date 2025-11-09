export type FieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'select' 
  | 'checkbox' 
  | 'radio' 
  | 'textarea'

export interface FormField {
  type: FieldType
  name?: string
  model?: string
  label: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  options?: string[]
  defaultValue?: string | number | boolean
  rows?: number
}

export interface FormSchema {
  title?: string
  description?: string
  fields: FormField[]
}

export interface ParseResult {
  schema: FormSchema | null
  error: string
}

