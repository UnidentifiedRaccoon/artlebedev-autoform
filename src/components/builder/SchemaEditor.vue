<template>
  <div class="schema-editor-container">
    <div class="panel-header">
      <h2>📝 Редактор схемы</h2>
      <div class="panel-actions">
        <button 
          @click="$emit('format')" 
          class="btn-action" 
          title="Форматировать"
        >
          ✨ Форматировать
        </button>
        <button 
          @click="$emit('clear')" 
          class="btn-action btn-danger" 
          title="Очистить"
        >
          🗑️ Очистить
        </button>
      </div>
    </div>

    <div class="editor-wrapper">
      <textarea
        :value="modelValue"
        @input="handleInput"
        class="schema-editor"
        :class="{ 'has-error': error }"
        placeholder="Введите JSON-схему здесь..."
        spellcheck="false"
      ></textarea>
      
      <div v-if="error" class="json-error">
        <strong>❌ Ошибка парсинга JSON:</strong>
        <pre>{{ error }}</pre>
      </div>
      <div v-else class="json-success">
        ✅ JSON валиден
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'format', 'clear'])

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
.schema-editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h2 {
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
}

.panel-actions {
  display: flex;
  gap: 10px;
}

.btn-action {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #42b883;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover {
  background: #35a372;
  transform: translateY(-1px);
}

.btn-danger {
  background: #e74c3c;
}

.btn-danger:hover {
  background: #c0392b;
}

.editor-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.schema-editor {
  flex: 1;
  min-height: 300px;
  padding: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s;
}

.schema-editor:focus {
  outline: none;
  border-color: #42b883;
}

.schema-editor.has-error {
  border-color: #e74c3c;
}

.json-error {
  margin-top: 12px;
  padding: 12px;
  background: #fee;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  color: #c0392b;
  font-size: 13px;
}

.json-error strong {
  display: block;
  margin-bottom: 8px;
}

.json-error pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.json-success {
  margin-top: 12px;
  padding: 12px;
  background: #d4edda;
  border: 1px solid #42b883;
  border-radius: 6px;
  color: #155724;
  font-size: 13px;
  font-weight: 600;
}
</style>

