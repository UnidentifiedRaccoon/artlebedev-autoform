<template>
  <select
    :id="fieldId"
    :name="fieldId"
    :required="field.required"
    :disabled="field.disabled"
    :value="modelValue"
    @change="handleChange"
    class="form-select"
    :class="{ 'input-error': error }"
  >
    <option value="">Выберите вариант</option>
    <option 
      v-for="option in field.options" 
      :key="option" 
      :value="option"
    >
      {{ option }}
    </option>
  </select>
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

const handleChange = (event) => {
  emit('update:modelValue', event.target.value)
  emit('validate')
}
</script>

<style scoped>
.form-select {
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
  width: 100%;
  background-color: white;
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: #42b883;
}

.form-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.input-error {
  border-color: #e74c3c !important;
}
</style>

