<template>
  <div class="radio-group">
    <div 
      v-for="option in field.options" 
      :key="option" 
      class="radio-wrapper"
    >
      <input
        :id="`${fieldId}_${option}`"
        type="radio"
        :name="fieldId"
        :value="option"
        :required="field.required"
        :disabled="field.disabled"
        :checked="modelValue === option"
        @change="handleChange"
        class="form-radio"
      />
      <label 
        :for="`${fieldId}_${option}`" 
        class="radio-label"
      >
        {{ option }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FormField } from '../../types'

interface Props {
  field: FormField
  modelValue: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  error: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'validate': []
}>()

const fieldId = computed(() => props.field.model || props.field.name)

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('validate')
}
</script>

<style scoped>
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

.form-radio:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.radio-label {
  cursor: pointer;
  font-size: 14px;
  color: #2c3e50;
}

.form-radio:disabled + .radio-label {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>

