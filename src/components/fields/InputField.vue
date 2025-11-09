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

<script setup lang="ts">
import { computed } from 'vue'
import type { FormField } from '../../types'

interface Props {
  field: FormField
  modelValue: string | number
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  error: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'validate': []
}>()

const fieldId = computed(() => props.field.model || props.field.name)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value
  
  if (props.field.type === 'number') {
    value = target.value === '' ? '' : Number(target.value)
  }
  
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

