export interface FormData {
  [key: string]: string | number | boolean
}

export interface FormErrors {
  [key: string]: string
}

export interface TouchedFields {
  [key: string]: boolean
}

export interface DetailedFormState {
  data: FormData
  errors: FormErrors
  validation: {
    errorCount: number
    touchedCount: number
  }
}

