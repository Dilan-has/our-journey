<template>
  <div>
    <h2 class="page-title">Pendientes Boda</h2>
    <p class="page-subtitle">Nuestra lista de preparativos para el gran día.</p>

    <!-- Progress Indicator -->
    <div class="progress-section" id="wedding-progress">
      <div class="progress-header">
        <span class="progress-label">Progreso</span>
        <span class="progress-stats">
          <strong>{{ progressPercentage }}%</strong> 
          <span class="stats-count">{{ completedCount }} de {{ totalCount }}</span>
        </span>
      </div>
      <div class="progress-track" aria-label="Progreso de pendientes">
        <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </div>

    <!-- Category Groups -->
    <div class="categories-container">
      <div 
        v-for="section in state.boda" 
        :key="section.id" 
        class="category-card"
        :id="'section-' + section.id"
      >
        <!-- Category Title -->
        <h3 class="category-header">
          <component :is="getIcon(section.icon)" class="category-icon" :size="20" />
          <span>{{ section.name }}</span>
        </h3>

        <!-- Tasks List -->
        <ul class="task-list" aria-label="Tareas de esta sección">
          <li 
            v-for="task in section.tasks" 
            :key="task.id" 
            class="task-item"
            :class="{ 'task-item-completed': task.completed }"
            :id="'task-row-' + task.id"
          >
            <!-- Custom animated Sage Green checkbox -->
            <button 
              class="checkbox-ring" 
              :class="{ 'checkbox-ring-checked': task.completed }"
              @click="toggleTask(section.id, task.id)"
              :aria-label="task.completed ? 'Marcar como pendiente' : 'Marcar como completada'"
              :id="'btn-check-task-' + task.id"
            >
              <Check v-if="task.completed" class="checkbox-icon" />
            </button>

            <!-- Task text -->
            <span class="task-title" @click="toggleTask(section.id, task.id)">{{ task.title }}</span>

            <!-- Delete task action -->
            <button 
              class="task-delete-btn" 
              @click="deleteTask(section.id, task.id)"
              title="Eliminar tarea"
              :id="'btn-delete-task-' + task.id"
            >
              <Trash2 :size="14" />
            </button>
          </li>
        </ul>

        <!-- Quick inline task creation input -->
        <div class="inline-add">
          <Plus :size="16" class="inline-add-icon" />
          <input 
            type="text" 
            placeholder="Añadir tarea a esta lista..." 
            class="inline-add-input"
            v-model="quickInputs[section.id]"
            @keyup.enter="addQuickTask(section.id)"
            :id="'input-quick-add-' + section.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Scissors, 
  Flower2, 
  Mail, 
  Utensils, 
  FileText, 
  Check, 
  Trash2, 
  Plus, 
  Heart 
} from 'lucide-vue-next'

const props = defineProps({
  state: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

// Quick inputs state for adding inline tasks
const quickInputs = ref({})

// Progress calculations
const totalCount = computed(() => {
  if (!props.state.boda) return 0
  return props.state.boda.reduce((sum, sec) => sum + (sec.tasks ? sec.tasks.length : 0), 0)
})

const completedCount = computed(() => {
  if (!props.state.boda) return 0
  return props.state.boda.reduce((sum, sec) => {
    return sum + (sec.tasks ? sec.tasks.filter(t => t.completed).length : 0)
  }, 0)
})

const progressPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

// Map icon strings to Lucide components
function getIcon(iconName) {
  switch (iconName) {
    case 'scissors': return Scissors
    case 'flower': return Flower2
    case 'mail': return Mail
    case 'utensils': return Utensils
    case 'file-text': return FileText
    default: return Heart
  }
}

// Toggle checklist tasks
function toggleTask(sectionId, taskId) {
  const newState = JSON.parse(JSON.stringify(props.state))
  const section = newState.boda.find(s => s.id === sectionId)
  if (section) {
    const task = section.tasks.find(t => t.id === taskId)
    if (task) {
      task.completed = !task.completed
      emit('update', newState)
    }
  }
}

// Add quick task from the inline inputs
function addQuickTask(sectionId) {
  const title = quickInputs.value[sectionId]?.trim()
  if (!title) return

  const newState = JSON.parse(JSON.stringify(props.state))
  const section = newState.boda.find(s => s.id === sectionId)
  if (section) {
    if (!section.tasks) section.tasks = []
    section.tasks.push({
      id: 't-' + Date.now(),
      title: title,
      completed: false
    })
    emit('update', newState)
    quickInputs.value[sectionId] = '' // Reset input
  }
}

// Delete task item
function deleteTask(sectionId, taskId) {
  const newState = JSON.parse(JSON.stringify(props.state))
  const section = newState.boda.find(s => s.id === sectionId)
  if (section) {
    section.tasks = section.tasks.filter(t => t.id !== taskId)
    emit('update', newState)
  }
}
</script>

<style scoped>
/* Progress styling - extremely elegant slim line */
.progress-section {
  background-color: var(--color-surface-container-lowest);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  padding: 20px 24px;
  margin-bottom: 36px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.01);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}

.progress-label {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-on-surface-variant);
}

.progress-stats {
  font-size: 1.1rem;
  color: var(--color-primary);
}

.stats-count {
  font-size: 0.88rem;
  color: var(--color-on-surface-variant);
  margin-left: 6px;
}

.progress-track {
  height: 4px;
  background-color: var(--color-surface-container-high);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width 0.4s cubic-bezier(0.1, 0.8, 0.25, 1);
}

/* Category lists */
.categories-container {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.category-card {
  background-color: var(--color-surface-container-lowest);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01);
}

.category-header {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--color-surface-container);
  padding-bottom: 10px;
}

.category-icon {
  color: var(--color-primary);
}

/* Tasks list elements */
.task-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  transition: opacity 0.2s;
}

.task-title {
  font-size: 1rem;
  color: var(--color-on-surface);
  cursor: pointer;
  user-select: none;
  flex-grow: 1;
  transition: color 0.2s, text-decoration 0.2s;
}

.task-item-completed .task-title {
  color: var(--color-outline);
  text-decoration: line-through;
}

/* Inline Quick Add Input */
.inline-add {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px dashed var(--color-surface-container-high);
  color: var(--color-outline);
}

.inline-add-icon {
  opacity: 0.5;
}

.inline-add-input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 0.95rem;
  color: var(--color-on-surface);
  outline: none;
}

.inline-add-input::placeholder {
  font-style: italic;
  opacity: 0.5;
  color: var(--color-outline);
}

.inline-add-input:focus::placeholder {
  opacity: 0.3;
}

/* Deletion trash button */
.task-delete-btn {
  background: transparent;
  border: none;
  color: var(--color-outline);
  opacity: 0;
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-full);
  transition: opacity 0.2s, color 0.2s, background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-item:hover .task-delete-btn {
  opacity: 0.5;
}

.task-item:hover .task-delete-btn:hover {
  opacity: 1;
  color: var(--color-error);
  background-color: var(--color-error-container);
}
</style>
