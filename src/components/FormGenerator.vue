<template>
  <div class="form-generator">
    <div v-if="schema.title" class="form-header">
      <h2>{{ schema.title }}</h2>
      <p v-if="schema.description" class="form-description">{{ schema.description }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form-content">
      <div v-for="field in schema.fields" :key="getFieldKey(field)" class="form-field">
        <label :for="getFieldKey(field)" class="field-label">
          {{ field.label }}
          <span v-if="field.required" class="required">*</span>
        </label>

        <component 
          :is="getFieldComponent(field.type)"
          :field="field"
          v-model="formData[getFieldKey(field)]"
          :error="errors[getFieldKey(field)]"
          @validate="() => handleFieldValidation(field)"
        />

        <div v-if="shouldShowError(getFieldKey(field), errors, touched)" class="error-message">
          {{ errors[getFieldKey(field)] }}
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="!isFormValidComputed">
          Отправить
        </button>
        <button type="button" @click="resetForm" class="btn-reset">
          Сбросить
        </button>
      </div>
    </form>

    <div class="form-data-preview">
      <h3>Информация о форме:</h3>
      
      <div class="info-section">
        <h4>Данные:</h4>
        <pre>{{ JSON.stringify(detailedFormState.data, null, 2) }}</pre>
      </div>

      <div v-if="Object.keys(detailedFormState.errors).length > 0" class="info-section errors-section">
        <h4>Ошибки валидации:</h4>
        <div v-for="(error, key) in detailedFormState.errors" :key="key" class="error-item">
          <strong>{{ key }}:</strong> {{ error }}
        </div>
      </div>

      <div class="info-section">
        <h4>Статус:</h4>
        <div class="stat-item">
          <span class="stat-label">Затронуто полей:</span>
          <span class="stat-value">{{ detailedFormState.validation.touchedCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Ошибок валидации:</span>
          <span class="stat-value">{{ detailedFormState.validation.errorCount }}</span>
        </div>
      </div>

      <div class="validation-status" :class="{ valid: isFormValidComputed, invalid: !isFormValidComputed }">
        <CheckCircle v-if="isFormValidComputed" :size="16" class="inline-icon" />
        <XCircle v-else :size="16" class="inline-icon" />
        {{ isFormValidComputed ? 'Форма валидна' : 'Форма содержит ошибки' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useFormData } from '../composables/useFormData'
import { useFormValidation } from '../composables/useFormValidation'
import InputField from './fields/InputField.vue'
import TextareaField from './fields/TextareaField.vue'
import SelectField from './fields/SelectField.vue'
import CheckboxField from './fields/CheckboxField.vue'
import RadioField from './fields/RadioField.vue'
import { CheckCircle, XCircle } from 'lucide-vue-next'

const props = defineProps({
  schema: {
    type: Object,
    required: true,
    default: () => ({ fields: [] })
  }
})

// Use composables
const { formData, errors, touched, getFieldKey, initializeForm, resetForm, setFieldError, markAsTouched, getDetailedFormState } = useFormData(props.schema)
const { validateField, isFormValid, shouldShowError } = useFormValidation()

// Map field types to components
const fieldComponents = {
  text: InputField,
  email: InputField,
  password: InputField,
  number: InputField,
  textarea: TextareaField,
  select: SelectField,
  checkbox: CheckboxField,
  radio: RadioField
}

/**
 * Get component for field type
 */
const getFieldComponent = (type) => {
  return fieldComponents[type] || InputField
}

/**
 * Handle field validation
 */
const handleFieldValidation = (field) => {
  const key = getFieldKey(field)
  const value = formData[key]
  const error = validateField(field, value)
  setFieldError(key, error)
  markAsTouched(key)
}

/**
 * Check if form is valid
 */
const isFormValidComputed = computed(() => {
  return isFormValid(props.schema, formData, errors, touched)
})

/**
 * Get detailed form state for display
 */
const detailedFormState = computed(() => {
  return getDetailedFormState()
})

/**
 * Handle form submission
 */
const handleSubmit = () => {
  console.log('Form submitted:', formData)
  alert('Форма успешно отправлена! Данные в консоли.')
}

// Watch for schema changes and reinitialize
watch(() => props.schema, () => {
  initializeForm(props.schema)
}, { immediate: true, deep: true })
</script>

<style scoped>
.form-generator {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
}

.form-header {
  margin-bottom: 30px;
}

.form-header h2 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 28px;
}

.form-description {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.required {
  color: #e74c3c;
  margin-left: 4px;
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  margin-top: -4px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn-submit,
.btn-reset {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit {
  background: #42b883;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #35a372;
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-reset {
  background: #f5f5f5;
  color: #2c3e50;
}

.btn-reset:hover {
  background: #e0e0e0;
}

.form-data-preview {
  margin-top: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.form-data-preview h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 700;
}

.info-section {
  margin-bottom: 20px;
}

.info-section h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
}

.info-section pre {
  background: #fff;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 12px;
  margin: 0;
  border: 1px solid #ddd;
  max-height: 200px;
  overflow-y: auto;
}

.errors-section {
  background: #fff5f5;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e74c3c;
}

.error-item {
  margin-bottom: 8px;
  font-size: 13px;
  color: #c0392b;
}

.error-item:last-child {
  margin-bottom: 0;
}

.error-item strong {
  color: #e74c3c;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
  font-size: 14px;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #6c757d;
}

.stat-value {
  font-weight: 600;
  color: #2c3e50;
}

.validation-status {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.validation-status.valid {
  background: #d4edda;
  color: #155724;
}

.validation-status.invalid {
  background: #f8d7da;
  color: #721c24;
}
</style>
