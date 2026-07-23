<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <!-- Modal Header -->
      <div class="modal-header">
        <h3 id="modal-title" class="modal-headline">{{ modalTitle }}</h3>
        <button class="btn-icon close-btn" @click="$emit('close')" aria-label="Cerrar ventana">
          <X :size="20" />
        </button>
      </div>

      <!-- Modal Body (Dynamic Forms) -->
      <form @submit.prevent="submitForm" class="modal-body">
        
        <!-- Form 1: Próximas Citas -->
        <div v-if="activeTab === 'citas'">
          <div class="form-group">
            <label for="date-title" class="form-label">¿Qué plan tenemos?</label>
            <input 
              id="date-title"
              type="text" 
              class="form-input" 
              placeholder="Ej. Taller de Cerámica Japonesa" 
              v-model="formData.citas.title"
              required
            />
          </div>
          <div class="form-group">
            <label for="date-time" class="form-label">Fecha y Hora</label>
            <input 
              id="date-time"
              type="datetime-local" 
              class="form-input" 
              v-model="formData.citas.date"
              required
            />
          </div>
          <div class="form-group">
            <label for="date-location" class="form-label">¿Dónde?</label>
            <input 
              id="date-location"
              type="text" 
              class="form-input" 
              placeholder="Ej. Estudio Barro Vivo" 
              v-model="formData.citas.location"
              required
            />
          </div>
          <div class="form-group">
            <label for="date-organizer" class="form-label">¿Quién organiza?</label>
            <select id="date-organizer" class="form-select" v-model="formData.citas.createdBy">
              <option :value="state.coupleSettings.partnerA">{{ state.coupleSettings.partnerA }}</option>
              <option :value="state.coupleSettings.partnerB">{{ state.coupleSettings.partnerB }}</option>
              <option value="Ambos">Ambos</option>
            </select>
          </div>
        </div>

        <!-- Form 2: Pendientes Boda -->
        <div v-else-if="activeTab === 'boda'">
          <div class="form-group">
            <label for="task-category" class="form-label">Categoría del Preparativo</label>
            <select id="task-category" class="form-select" v-model="formData.boda.sectionId" required>
              <option v-for="sec in state.boda" :key="sec.id" :value="sec.id">
                {{ sec.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="task-title" class="form-label">Descripción de la Tarea</label>
            <input 
              id="task-title"
              type="text" 
              class="form-input" 
              placeholder="Ej. Encargar centros de mesa..." 
              v-model="formData.boda.title"
              required
            />
          </div>
        </div>

        <!-- Form 3: Citas después de casados (Deseos) -->
        <div v-else-if="activeTab === 'casados'">
          <div class="form-group">
            <label for="wish-title" class="form-label">Idea de deseo para después de la boda</label>
            <input 
              id="wish-title"
              type="text" 
              class="form-input" 
              placeholder="Ej. Viajar a Japón en nuestra luna de miel" 
              v-model="formData.casados.title"
              required
            />
          </div>
          <div class="form-group">
            <label for="wish-category" class="form-label">Categoría</label>
            <select id="wish-category" class="form-select" v-model="formData.casados.category">
              <option value="Viajes">Viajes ✈️</option>
              <option value="Gastronomía">Gastronomía 🍳</option>
              <option value="Aventura">Aventura ⛰️</option>
              <option value="Hogar">Hogar 🏠</option>
              <option value="Crecimiento">Crecimiento 🌱</option>
            </select>
          </div>
          <div class="form-group">
            <label for="wish-notes" class="form-label">Nota o Recordatorio Romántico</label>
            <textarea 
              id="wish-notes"
              class="form-input text-area" 
              placeholder="Escribe un detalle de por qué quieren hacer esto..." 
              v-model="formData.casados.notes"
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- Form 4: Pelis o series por ver -->
        <div v-else-if="activeTab === 'peliculas'">
          <div class="form-group">
            <label for="media-title" class="form-label">Título de la Película o Serie</label>
            <input 
              id="media-title"
              type="text" 
              class="form-input" 
              placeholder="Ej. Horizonte Perdido" 
              v-model="formData.peliculas.title"
              required
            />
          </div>
          <div class="form-group">
            <label for="media-type" class="form-label">Tipo</label>
            <select id="media-type" class="form-select" v-model="formData.peliculas.type">
              <option value="pelicula">Película 🎬</option>
              <option value="serie">Serie 📺</option>
            </select>
          </div>
          <div class="form-group">
            <label for="media-genre" class="form-label">Género</label>
            <select id="media-genre" class="form-select" v-model="formData.peliculas.genre">
              <option value="Acción">Acción 💥</option>
              <option value="Drama">Drama 🎭</option>
              <option value="Romance">Romance 💖</option>
              <option value="Suspenso">Suspenso 🕯️</option>
              <option value="Comedia">Comedia 😂</option>
              <option value="Fantasía">Fantasía 🦄</option>
            </select>
          </div>
          <div class="form-group">
            <label for="media-status" class="form-label">Estado Inicial</label>
            <select id="media-status" class="form-select" v-model="formData.peliculas.status">
              <option value="pendiente">Pendiente</option>
              <option value="prioridad">Prioridad ⭐</option>
              <option value="vista">Ya vista</option>
            </select>
          </div>
        </div>

        <!-- Form Actions Footer -->
        <div class="form-footer">
          <button type="button" class="btn-secondary" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  state: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const modalTitle = computed(() => {
  switch (props.activeTab) {
    case 'citas': return 'Planear Nueva Cita'
    case 'boda': return 'Añadir Pendiente Boda'
    case 'casados': return 'Nuevo Deseo Casados'
    case 'peliculas': return 'Añadir Película o Serie'
    default: return 'Añadir Elemento'
  }
})

// Initialize form data with structure
const formData = ref({
  citas: {
    title: '',
    date: '',
    location: '',
    createdBy: props.state.coupleSettings.partnerA
  },
  boda: {
    sectionId: props.state.boda[0]?.id || '',
    title: ''
  },
  casados: {
    title: '',
    category: 'Viajes',
    notes: '',
    votes: {},
    completed: false
  },
  peliculas: {
    title: '',
    type: 'pelicula',
    genre: 'Acción',
    status: 'pendiente'
  }
})

function submitForm() {
  let payload = {}
  
  if (props.activeTab === 'citas') {
    payload = {
      id: 'c-' + Date.now(),
      ...formData.value.citas
    }
  } else if (props.activeTab === 'boda') {
    payload = {
      ...formData.value.boda
    }
  } else if (props.activeTab === 'casados') {
    // Automatically set up the voting state with a positive vote for the person who created it
    const currentPartner = props.state.coupleSettings.partnerA
    const votes = {}
    votes[currentPartner] = true

    payload = {
      id: 'w-' + Date.now(),
      ...formData.value.casados,
      votes: votes
    }
  } else if (props.activeTab === 'peliculas') {
    payload = {
      id: 'm-' + Date.now(),
      ...formData.value.peliculas
    }
  }

  emit('save', payload)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(51, 49, 46, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}

.modal-container {
  background-color: var(--color-surface-container-lowest);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-outline-variant);
}

.modal-headline {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
}

.close-btn {
  color: var(--color-outline);
}

.modal-body {
  padding: 24px;
}

.text-area {
  resize: none;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  border-top: 1px solid var(--color-surface-container);
  padding-top: 20px;
}

@keyframes slide-up {
  from {
    transform: translateY(24px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
