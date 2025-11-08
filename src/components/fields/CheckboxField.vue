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

<script setup>
import { computed } from 'vue'

const props = defineProps({
  field: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'validate'])

const fieldId = computed(() => props.field.model || props.field.name)

const handleChange = (event) => {
  emit('update:modelValue', event.target.checked)
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

