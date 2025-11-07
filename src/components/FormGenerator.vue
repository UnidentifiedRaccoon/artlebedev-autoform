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

        <!-- Text, Email, Password, Number inputs -->
        <input
          v-if="['text', 'email', 'password', 'number'].includes(field.type)"
          :id="getFieldKey(field)"
          :type="field.type"
          :name="getFieldKey(field)"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="field.disabled"
          :min="field.min"
          :max="field.max"
          :minlength="field.minLength"
          :maxlength="field.maxLength"
          :pattern="field.pattern"
          v-model="formData[getFieldKey(field)]"
          @input="validateField(field)"
          class="form-input"
          :class="{ 'input-error': errors[getFieldKey(field)] }"
        />

        <!-- Textarea -->
        <textarea
          v-else-if="field.type === 'textarea'"
          :id="getFieldKey(field)"
          :name="getFieldKey(field)"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="field.disabled"
          :minlength="field.minLength"
          :maxlength="field.maxLength"
          v-model="formData[getFieldKey(field)]"
          @input="validateField(field)"
          class="form-textarea"
          :class="{ 'input-error': errors[getFieldKey(field)] }"
          rows="4"
        ></textarea>

        <!-- Select -->
        <select
          v-else-if="field.type === 'select'"
          :id="getFieldKey(field)"
          :name="getFieldKey(field)"
          :required="field.required"
          :disabled="field.disabled"
          v-model="formData[getFieldKey(field)]"
          @change="validateField(field)"
          class="form-select"
          :class="{ 'input-error': errors[getFieldKey(field)] }"
        >
          <option value="">Выберите вариант</option>
          <option v-for="option in field.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>

        <!-- Checkbox -->
        <div v-else-if="field.type === 'checkbox'" class="checkbox-wrapper">
          <input
            :id="getFieldKey(field)"
            type="checkbox"
            :name="getFieldKey(field)"
            :required="field.required"
            :disabled="field.disabled"
            v-model="formData[getFieldKey(field)]"
            @change="validateField(field)"
            class="form-checkbox"
          />
        </div>

        <!-- Radio -->
        <div v-else-if="field.type === 'radio'" class="radio-group">
          <div v-for="option in field.options" :key="option" class="radio-wrapper">
            <input
              :id="`${getFieldKey(field)}_${option}`"
              type="radio"
              :name="getFieldKey(field)"
              :value="option"
              :required="field.required"
              :disabled="field.disabled"
              v-model="formData[getFieldKey(field)]"
              @change="validateField(field)"
              class="form-radio"
            />
            <label :for="`${getFieldKey(field)}_${option}`" class="radio-label">{{ option }}</label>
          </div>
        </div>

        <!-- Error message -->
        <div v-if="errors[getFieldKey(field)]" class="error-message">
          {{ errors[getFieldKey(field)] }}
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="!isFormValid">
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
      <div class="validation-status" :class="{ valid: isFormValid, invalid: !isFormValid }">
        {{ isFormValid ? '✓ Форма валидна' : '✗ Форма содержит ошибки' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  schema: {
    type: Object,
    required: true,
    default: () => ({ fields: [] })
  }
})

const formData = reactive({})
const errors = reactive({})

// Get field key (supports both 'model' and 'name')
const getFieldKey = (field) => {
  return field.model || field.name
}

// Initialize form data with default values
const initializeForm = () => {
  Object.keys(formData).forEach(key => delete formData[key])
  Object.keys(errors).forEach(key => delete errors[key])
  
  if (props.schema.fields) {
    props.schema.fields.forEach(field => {
      const key = getFieldKey(field)
      if (field.type === 'checkbox') {
        formData[key] = field.defaultValue ?? false
      } else {
        formData[key] = field.defaultValue ?? ''
      }
    })
  }
}

// Validate individual field
const validateField = (field) => {
  const key = getFieldKey(field)
  const value = formData[key]
  
  // Required validation
  if (field.required && !value && value !== 0 && value !== false) {
    errors[key] = 'Это поле обязательно для заполнения'
    return false
  }
  
  // Skip other validations if field is empty and not required
  if (!value && !field.required) {
    delete errors[key]
    return true
  }
  
  // MinLength validation
  if (field.minLength && value.length < field.minLength) {
    errors[key] = `Минимальная длина: ${field.minLength} символов`
    return false
  }
  
  // MaxLength validation
  if (field.maxLength && value.length > field.maxLength) {
    errors[key] = `Максимальная длина: ${field.maxLength} символов`
    return false
  }
  
  // Min validation (numbers)
  if (field.type === 'number' && field.min !== undefined && Number(value) < field.min) {
    errors[key] = `Минимальное значение: ${field.min}`
    return false
  }
  
  // Max validation (numbers)
  if (field.type === 'number' && field.max !== undefined && Number(value) > field.max) {
    errors[key] = `Максимальное значение: ${field.max}`
    return false
  }
  
  // Pattern validation
  if (field.pattern && value) {
    const regex = new RegExp(field.pattern)
    if (!regex.test(value)) {
      errors[key] = 'Значение не соответствует требуемому формату'
      return false
    }
  }
  
  delete errors[key]
  return true
}

// Check if entire form is valid
const isFormValid = computed(() => {
  if (!props.schema.fields) return false
  
  return props.schema.fields.every(field => {
    const key = getFieldKey(field)
    const value = formData[key]
    
    if (field.required && !value && value !== 0 && value !== false) {
      return false
    }
    
    return !errors[key]
  })
})

const handleSubmit = () => {
  console.log('Form submitted:', formData)
  alert('Форма успешно отправлена! Данные в консоли.')
}

const resetForm = () => {
  initializeForm()
}

// Watch for schema changes and reinitialize
watch(() => props.schema, () => {
  initializeForm()
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

.form-input,
.form-textarea,
.form-select {
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #42b883;
}

.form-input:disabled,
.form-textarea:disabled,
.form-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.input-error {
  border-color: #e74c3c !important;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
}

.form-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-radio {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.radio-label {
  cursor: pointer;
  font-size: 14px;
  color: #2c3e50;
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

