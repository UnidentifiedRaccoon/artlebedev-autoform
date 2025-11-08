<template>
  <div class="examples-section">
    <h3><BookOpen :size="18" class="inline-icon" /> Примеры схем:</h3>
    <div class="examples-grid">
      <button
        v-for="(example, index) in examples"
        :key="index"
        @click="$emit('load-example', index)"
        class="btn-example"
      >
        {{ example.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { BookOpen } from 'lucide-vue-next'

defineProps({
  examples: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['load-example'])
</script>

<style scoped>
.examples-section {
  padding: 20px;
  border-top: 2px solid #e9ecef;
  background: #f8f9fa;
}

.examples-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.btn-example {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-example:hover {
  border-color: #42b883;
  background: #f0fdf7;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .examples-grid {
    grid-template-columns: 1fr;
  }
}
</style>

