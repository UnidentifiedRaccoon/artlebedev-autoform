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

