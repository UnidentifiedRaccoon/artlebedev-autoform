<template>
  <input
    :id="fieldId"
    :type="field.type"
    :name="fieldId"
    :placeholder="field.placeholder"
    :required="field.required"
    :disabled="field.disabled"
    :min="field.min"
    :max="field.max"
    :minlength="field.minLength"
    :maxlength="field.maxLength"
    :pattern="field.pattern"
    :value="modelValue"
    @input="handleInput"
    class="form-input"
    :class="{ 'input-error': error }"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  field: {
    type: Object,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'validate'])

const fieldId = computed(() => props.field.model || props.field.name)

const handleInput = (event) => {
  const value = props.field.type === 'number' ? event.target.value : event.target.value
  emit('update:modelValue', value)
  emit('validate')
}
</script>

<style scoped>
.form-input {
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: #42b883;
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.input-error {
  border-color: #e74c3c !important;
}
</style>

