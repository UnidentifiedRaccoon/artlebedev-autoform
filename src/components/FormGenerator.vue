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

        <div v-if="errors[getFieldKey(field)]" class="error-message">
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
      <h3>Текущие значения формы:</h3>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
      <div class="validation-status" :class="{ valid: isFormValidComputed, invalid: !isFormValidComputed }">
        {{ isFormValidComputed ? '✓ Форма валидна' : '✗ Форма содержит ошибки' }}
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

const props = defineProps({
  schema: {
    type: Object,
    required: true,
    default: () => ({ fields: [] })
  }
})

// Use composables
const { formData, errors, getFieldKey, initializeForm, resetForm, setFieldError } = useFormData(props.schema)
const { validateField, isFormValid } = useFormValidation()

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
}

/**
 * Check if form is valid
 */
const isFormValidComputed = computed(() => {
  return isFormValid(props.schema, formData, errors)
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
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #2c3e50;
}

.form-data-preview pre {
  background: #fff;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
  margin: 0 0 12px 0;
  border: 1px solid #ddd;
}

.validation-status {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
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
