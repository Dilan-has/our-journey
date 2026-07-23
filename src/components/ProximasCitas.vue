<template>
  <div>
    <h2 class="page-title">Próximas Citas</h2>
    <p class="page-subtitle">Momentos especiales planeados para compartir y recordar.</p>

    <!-- Dates List -->
    <div v-if="sortedCitas.length > 0" class="citas-list">
      <div 
        v-for="cita in sortedCitas" 
        :key="cita.id" 
        class="cita-card"
        :id="'cita-' + cita.id"
      >
        <!-- Date Badge Column -->
        <div class="cita-date-col">
          <span class="cita-day">{{ formatDay(cita.date) }}</span>
          <span class="cita-month">{{ formatMonth(cita.date) }}</span>
          <span class="cita-time">{{ formatTime(cita.date) }}</span>
        </div>

        <!-- Details Column -->
        <div class="cita-details-col">
          <h3 class="cita-title">{{ cita.title }}</h3>
          <div class="cita-location">
            <MapPin :size="16" class="cita-icon" />
            <span>{{ cita.location }}</span>
          </div>
          <span class="cita-created">Planificado por {{ cita.createdBy || 'nosotros' }}</span>
        </div>

        <!-- Action Column -->
        <div class="cita-action-col">
          <button 
            class="btn-icon delete-btn" 
            @click="deleteCita(cita.id)" 
            title="Eliminar cita"
            :id="'btn-delete-cita-' + cita.id"
          >
            <Trash2 :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <Sparkles :size="48" class="empty-icon" />
      <h3>No hay citas planeadas todavía</h3>
      <p>Es un gran momento para planificar su próxima aventura juntos.</p>
    </div>

    <!-- Main action button at bottom -->
    <div class="action-footer">
      <button 
        class="btn-primary flex-center" 
        @click="$emit('open-add')"
        id="btn-plan-new-date"
      >
        <Plus :size="18" />
        <span>PLANEAR NUEVA CITA</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MapPin, Trash2, Plus, Sparkles } from 'lucide-vue-next'

const props = defineProps({
  state: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'open-add'])

// Sort upcoming dates chronologically
const sortedCitas = computed(() => {
  if (!props.state.citas) return []
  return [...props.state.citas].sort((a, b) => new Date(a.date) - new Date(b.date))
})

// Helper methods for formatting dates
function formatDay(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.getDate()
}

function formatMonth(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
  return months[date.getMonth()]
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}h`
}

function deleteCita(id) {
  if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
    const newState = JSON.parse(JSON.stringify(props.state))
    newState.citas = newState.citas.filter(c => c.id !== id)
    emit('update', newState)
  }
}
</script>

<style scoped>
.citas-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.cita-card {
  display: flex;
  background-color: var(--color-surface-container-lowest);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  overflow: hidden;
  padding: 20px;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.01);
}

.cita-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(113, 70, 65, 0.04);
}

.cita-date-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--color-outline-variant);
  padding-right: 24px;
  min-width: 90px;
  text-align: center;
}

.cita-day {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.cita-month {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--color-primary-container);
  margin-top: 2px;
}

.cita-time {
  font-size: 0.75rem;
  color: var(--color-on-surface-variant);
  margin-top: 4px;
}

.cita-details-col {
  flex-grow: 1;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cita-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
  color: #2d2926;
  line-height: 1.3;
}

.cita-location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-on-surface-variant);
  font-size: 0.9rem;
}

.cita-icon {
  color: var(--color-primary);
}

.cita-created {
  font-size: 0.75rem;
  font-style: italic;
  color: var(--color-outline);
}

.cita-action-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn {
  opacity: 0.4;
  transition: opacity 0.2s, color 0.2s;
}

.cita-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: var(--color-error);
  background-color: var(--color-error-container);
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-md);
  color: var(--color-on-surface-variant);
  border: 1px dashed var(--color-outline-variant);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
}

.empty-icon {
  color: var(--color-primary);
  opacity: 0.5;
  animation: pulse-green 3s infinite;
}

.action-footer {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.flex-center {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
