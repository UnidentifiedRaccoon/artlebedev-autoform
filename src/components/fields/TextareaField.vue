<template>
  <textarea
    :id="fieldId"
    :name="fieldId"
    :placeholder="field.placeholder"
    :required="field.required"
    :disabled="field.disabled"
    :minlength="field.minLength"
    :maxlength="field.maxLength"
    :value="modelValue"
    @input="handleInput"
    class="form-textarea"
    :class="{ 'input-error': error }"
    :rows="field.rows || 4"
  ></textarea>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  field: {
    type: Object,
    required: true
  },
  modelValue: {
    type: String,
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
  emit('update:modelValue', event.target.value)
  emit('validate')
}
</script>

<style scoped>
.form-textarea {
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
  width: 100%;
  resize: vertical;
}

.form-textarea:focus {
  outline: none;
  border-color: #42b883;
}

.form-textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.input-error {
  border-color: #e74c3c !important;
}
</style>

