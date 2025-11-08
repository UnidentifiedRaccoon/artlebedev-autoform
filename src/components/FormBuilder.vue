<template>
  <div class="form-builder">
    <div class="builder-header">
      <h1><Palette :size="32" class="header-icon" /> Конструктор форм Vue 3</h1>
      <p>Введите JSON-схему слева и увидите сгенерированную форму справа</p>
    </div>

    <div class="builder-content">
      <!-- Left Panel: Schema Editor -->
      <div class="editor-panel">
        <SchemaEditor 
          v-model="schemaText"
          :error="jsonError"
          @format="formatJSON"
          @clear="clearSchema"
        />
        <ExamplesPanel 
          :examples="examples"
          @load-example="loadExample"
        />
      </div>

      <!-- Right Panel: Form Preview -->
      <div class="preview-panel">
        <div class="panel-header">
          <h2><Eye :size="20" class="inline-icon" /> Предварительный просмотр</h2>
        </div>

        <div class="preview-wrapper">
          <div v-if="!jsonError && parsedSchema.fields && parsedSchema.fields.length > 0">
            <FormGenerator :schema="parsedSchema" />
          </div>
          <div v-else class="empty-state">
            <div class="empty-icon"><ClipboardList :size="64" /></div>
            <h3>Форма не создана</h3>
            <p>Введите валидную JSON-схему слева или выберите пример</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useSchemaParser } from '../composables/useSchemaParser'
import FormGenerator from './FormGenerator.vue'
import SchemaEditor from './builder/SchemaEditor.vue'
import ExamplesPanel from './builder/ExamplesPanel.vue'
import { Palette, Eye, ClipboardList } from 'lucide-vue-next'

const { parseSchema, formatSchema: formatSchemaText } = useSchemaParser()

const schemaText = ref('')
const jsonError = ref('')
const parsedSchema = reactive({
  title: '',
  description: '',
  fields: []
})

// Example schemas
const examples = [
  {
    name: 'artlebedev',
    schema: {
      fields: [
        { 
          type: 'text', 
          label: 'Имя', 
          model: 'name', 
          required: true 
        },
        { 
          type: 'email', 
          label: 'Email', 
          model: 'email', 
          required: true 
        },
        { 
          type: 'password', 
          label: 'Пароль', 
          model: 'password', 
          required: true, 
          minLength: 6 
        },
        { 
          type: 'select', 
          label: 'Роль', 
          model: 'role', 
          options: ['Админ', 'Пользователь'], 
          required: true 
        },
        { 
          type: 'checkbox', 
          label: 'Согласен с условиями', 
          model: 'terms', 
          required: true 
        }
      ]
    }
  },
  {
    name: 'Регистрация',
    schema: {
      title: 'Форма регистрации и анкета',
      description: 'Заполните данные для создания аккаунта',
      fields: [
        {
          type: 'text',
          name: 'username',
          label: 'Имя пользователя',
          placeholder: 'Введите имя пользователя',
          required: true,
          minLength: 3,
          maxLength: 20,
          pattern: '^[a-zA-Z0-9_]+$'
        },
        {
          type: 'email',
          name: 'email',
          label: 'Email',
          placeholder: 'example@mail.com',
          required: true
        },
        {
          type: 'password',
          name: 'password',
          label: 'Пароль',
          placeholder: 'Минимум 8 символов',
          required: true,
          minLength: 8
        },
        {
          type: 'number',
          name: 'age',
          label: 'Возраст',
          placeholder: '18',
          required: true,
          min: 18,
          max: 100
        },
        {
          type: 'select',
          name: 'country',
          label: 'Страна',
          required: true,
          options: ['Россия', 'Беларусь', 'Казахстан', 'Украина', 'Другая']
        },
        {
          type: 'radio',
          name: 'gender',
          label: 'Пол',
          required: true,
          options: ['Мужской', 'Женский']
        },
        {
          type: 'checkbox',
          name: 'terms',
          label: 'Я согласен с условиями использования',
          required: true
        }
      ]
    }
  },
  {
    name: 'Обратная связь',
    schema: {
      title: 'Форма обратной связи',
      description: 'Мы будем рады услышать ваше мнение',
      fields: [
        {
          type: 'text',
          name: 'name',
          label: 'Ваше имя',
          placeholder: 'Иван Иванов',
          required: true
        },
        {
          type: 'email',
          name: 'email',
          label: 'Email для связи',
          placeholder: 'ivan@example.com',
          required: true
        },
        {
          type: 'select',
          name: 'topic',
          label: 'Тема обращения',
          required: true,
          options: ['Вопрос', 'Предложение', 'Жалоба', 'Другое']
        },
        {
          type: 'textarea',
          name: 'message',
          label: 'Сообщение',
          placeholder: 'Введите ваше сообщение...',
          required: true,
          minLength: 10,
          maxLength: 500
        },
        {
          type: 'radio',
          name: 'rating',
          label: 'Оцените наш сервис',
          required: true,
          options: ['Отлично', 'Хорошо', 'Удовлетворительно', 'Плохо']
        }
      ]
    }
  },
  {
    name: 'Заказ',
    schema: {
      title: 'Оформление заказа',
      description: 'Заполните данные для доставки',
      fields: [
        {
          type: 'text',
          name: 'recipientName',
          label: 'Имя получателя',
          placeholder: 'Иван Иванов',
          required: true
        },
        {
          type: 'text',
          name: 'phone',
          label: 'Телефон',
          placeholder: '+7 (999) 123-45-67',
          required: true,
          pattern: '^\\+?[0-9\\s\\-\\(\\)]+$'
        },
        {
          type: 'text',
          name: 'address',
          label: 'Адрес доставки',
          placeholder: 'ул. Пушкина, д. 1, кв. 1',
          required: true
        },
        {
          type: 'select',
          name: 'deliveryMethod',
          label: 'Способ доставки',
          required: true,
          options: ['Курьером', 'Самовывоз', 'Почта России']
        },
        {
          type: 'textarea',
          name: 'comment',
          label: 'Комментарий к заказу',
          placeholder: 'Дополнительная информация...',
          required: false
        }
      ]
    }
  }
]

/**
 * Handle schema text changes
 */
const handleSchemaChange = () => {
  const parsed = parseSchema(schemaText.value)
  
  if (parsed) {
    Object.assign(parsedSchema, {
      title: parsed.title || '',
      description: parsed.description || '',
      fields: parsed.fields || []
    })
    jsonError.value = ''
  } else if (!schemaText.value.trim()) {
    // Clear schema if text is empty
    parsedSchema.title = ''
    parsedSchema.description = ''
    parsedSchema.fields = []
    jsonError.value = ''
  } else {
    // There was a parse error
    jsonError.value = 'Ошибка парсинга JSON'
  }
}

/**
 * Format JSON schema
 */
const formatJSON = () => {
  if (!schemaText.value.trim()) return
  
  const formatted = formatSchemaText(schemaText.value)
  if (formatted !== schemaText.value) {
    schemaText.value = formatted
    handleSchemaChange()
  }
}

/**
 * Clear schema
 */
const clearSchema = () => {
  schemaText.value = ''
  jsonError.value = ''
  parsedSchema.title = ''
  parsedSchema.description = ''
  parsedSchema.fields = []
}

/**
 * Load example schema
 */
const loadExample = (index) => {
  const example = examples[index]
  schemaText.value = JSON.stringify(example.schema, null, 2)
  handleSchemaChange()
}

// Watch for schema text changes
watch(schemaText, () => {
  handleSchemaChange()
})

// Load first example on mount
loadExample(0)
</script>

<style scoped>
.form-builder {
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.builder-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.builder-header h1 {
  margin: 0 0 10px 0;
  font-size: 36px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.builder-header p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.builder-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 1800px;
  margin: 0 auto;
  flex: 1;
  min-height: 0;
}

.editor-panel,
.preview-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  min-height: 0;
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-wrapper {
  flex: 1;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 60px 20px;
  color: #6c757d;
  text-align: center;
}

.empty-icon {
  margin-bottom: 20px;
  opacity: 0.5;
  color: #6c757d;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #495057;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

@media (max-width: 1200px) {
  .builder-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .builder-header h1 {
    font-size: 28px;
  }
}
</style>
