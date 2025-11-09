<template>
  <div class="checkbox-wrapper">
    <input
      :id="fieldId"
      type="checkbox"
      :name="fieldId"
      :required="field.required"
      :disabled="field.disabled"
      :checked="modelValue"
      @change="handleChange"
      class="form-checkbox"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FormField } from '../../types'

interface Props {
  field: FormField
  modelValue: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  error: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'validate': []
}>()

const fieldId = computed(() => props.field.model || props.field.name)

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
  emit('validate')
}
</script>

<style scoped>
.checkbox-wrapper {
  display: flex;
  align-items: center;
}

.form-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.form-checkbox:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>

