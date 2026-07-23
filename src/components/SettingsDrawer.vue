<template>
  <div class="drawer-overlay" @click.self="$emit('close')">
    <div class="drawer-panel" role="dialog" aria-labelledby="drawer-title" aria-modal="true">
      <!-- Drawer Header -->
      <div class="drawer-header">
        <h3 id="drawer-title" class="drawer-headline">Ajustes del Rincón</h3>
        <button class="btn-icon close-btn" @click="$emit('close')" aria-label="Cerrar ajustes">
          <X :size="20" />
        </button>
      </div>

      <!-- Drawer Content -->
      <div class="drawer-body">
        <p class="drawer-intro">Configuren sus nombres y la fecha de su gran día para personalizar su espacio compartido.</p>
        
        <form @submit.prevent="saveSettings" class="settings-form">
          <!-- Partner A name -->
          <div class="form-group">
            <label for="partnerA" class="form-label">Nombre de la Pareja 1</label>
            <input 
              id="partnerA"
              type="text" 
              class="form-input" 
              v-model="localSettings.partnerA" 
              required
            />
          </div>

          <!-- Partner B name -->
          <div class="form-group">
            <label for="partnerB" class="form-label">Nombre de la Pareja 2</label>
            <input 
              id="partnerB"
              type="text" 
              class="form-input" 
              v-model="localSettings.partnerB" 
              required
            />
          </div>

          <!-- Wedding Date -->
          <div class="form-group">
            <label for="weddingDate" class="form-label">Fecha de la Boda</label>
            <input 
              id="weddingDate"
              type="date" 
              class="form-input" 
              v-model="localSettings.weddingDate" 
            />
          </div>

          <!-- Countdown preview helper -->
          <div class="countdown-preview" v-if="localSettings.weddingDate">
            <Sparkles :size="14" class="preview-icon" />
            <span>Vista previa: {{ getCountdownPreview() }}</span>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="submit" class="btn-primary full-width">Guardar Cambios</button>
          </div>
        </form>

        <div class="drawer-divider"></div>

        <!-- Danger/Action zone -->
        <div class="reset-zone">
          <h4 class="reset-title">Restablecer Rincón</h4>
          <p class="reset-desc">¿Quieres borrar los cambios y volver a cargar los datos románticos de demostración?</p>
          <button 
            type="button" 
            class="btn-reset" 
            @click="resetDemoData"
            id="btn-reset-demo"
          >
            Restablecer Datos Demo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X, Sparkles } from 'lucide-vue-next'

const props = defineProps({
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const localSettings = ref({
  partnerA: props.settings?.partnerA || 'Dilan',
  partnerB: props.settings?.partnerB || 'Sofía',
  weddingDate: props.settings?.weddingDate || ''
})

function saveSettings() {
  emit('save', { ...localSettings.value })
}

function getCountdownPreview() {
  if (!localSettings.value.weddingDate) return ''
  const wedding = new Date(localSettings.value.weddingDate + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const diffTime = wedding - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  const formattedDate = wedding.toLocaleDateString('es-ES', options)

  if (diffDays > 0) {
    return `Faltan ${diffDays} días (${formattedDate})`
  } else if (diffDays === 0) {
    return '¡Hoy es el gran día!'
  } else {
    return `¡Felizmente casados desde el ${formattedDate}!`
  }
}

// Reset data in server database to initial clean seed
async function resetDemoData() {
  if (confirm('Esto borrará todos tus datos actuales y restablecerá la base de datos con los datos de ejemplo iniciales. ¿Deseas continuar?')) {
    try {
      const demoData = {
        coupleSettings: { partnerA: 'Dilan', partnerB: 'Sofía', weddingDate: '2027-10-14' },
        citas: [
          {
            id: '1',
            title: 'Cena bajo las estrellas',
            date: '2026-10-14T20:30:00',
            location: 'Terraza del Mirador, Madrid',
            category: 'Cena',
            createdBy: 'Dilan'
          },
          {
            id: '2',
            title: 'Taller de Cerámica Japonesa',
            date: '2026-10-28T11:00:00',
            location: 'Estudio Barro Vivo',
            category: 'Taller',
            createdBy: 'Sofía'
          },
          {
            id: '3',
            title: 'Cine Clásico y Jazz',
            date: '2026-11-12T17:30:00',
            location: 'Cine Doré',
            category: 'Cine',
            createdBy: 'Dilan'
          }
        ],
        boda: [
          {
            id: 'sec-1',
            name: 'Vestido & Traje',
            icon: 'scissors',
            tasks: [
              { id: 't-1', title: 'Prueba inicial del vestido', completed: true },
              { id: 't-2', title: 'Elegir accesorios y zapatos', completed: false },
              { id: 't-3', title: 'Sastrería final del traje', completed: false }
            ]
          },
          {
            id: 'sec-2',
            name: 'Decoración & Flores',
            icon: 'flower',
            tasks: [
              { id: 't-4', title: 'Definir paleta de colores', completed: true },
              { id: 't-5', title: 'Encargar el ramo de novia', completed: false },
              { id: 't-6', title: 'Centros de mesa & Altar', completed: false }
            ]
          },
          {
            id: 'sec-3',
            name: 'Invitaciones',
            icon: 'mail',
            tasks: [
              { id: 't-7', title: 'Finalizar lista de invitados', completed: true },
              { id: 't-8', title: 'Diseño de la papelería', completed: true },
              { id: 't-9', title: 'Enviar Save the Date', completed: true },
              { id: 't-10', title: 'Impresión de sobres', completed: true }
            ]
          },
          {
            id: 'sec-4',
            name: 'Banquete & Ceremonia',
            icon: 'utensils',
            tasks: [
              { id: 't-11', title: 'Reservar el lugar de celebración', completed: false },
              { id: 't-12', title: 'Degustación del menú', completed: false },
              { id: 't-13', title: 'Contratar DJ / Música', completed: false }
            ]
          },
          {
            id: 'sec-5',
            name: 'Trámites',
            icon: 'file-text',
            tasks: [
              { id: 't-14', title: 'Reserva de fecha en juzgado / iglesia', completed: false },
              { id: 't-15', title: 'Gestión de documentos oficiales', completed: false }
            ]
          }
        ],
        citasCasados: [
          {
            id: '1',
            title: 'Viajar a Japón en nuestra luna de miel',
            category: 'Viajes',
            completed: false,
            votes: { Dilan: true, Sofía: true },
            notes: '¡Para comer mucho sushi y pasear por Kioto!'
          },
          {
            id: '2',
            title: 'Cocinar una cena de tres tiempos juntos',
            category: 'Gastronomía',
            completed: true,
            votes: { Dilan: true, Sofía: false },
            notes: 'Hicimos pasta fresca y tiramisú casero'
          },
          {
            id: '3',
            title: 'Hacer un picnic en el parque de nuestra nueva casa',
            category: 'Aventura',
            completed: false,
            votes: { Dilan: false, Sofía: true },
            notes: 'Llevar quesos, uvas y vino tinto'
          },
          {
            id: '4',
            title: 'Comenzar una tradición de noche de juegos cada viernes',
            category: 'Hogar',
            completed: false,
            votes: { Dilan: true, Sofía: true },
            notes: 'Jugar Catán o Monopoly Deal'
          }
        ],
        peliculas: [
          { id: '1', title: 'Horizonte Perdido', type: 'pelicula', genre: 'Acción', status: 'pendiente' },
          { id: '2', title: 'Ecos del Pasado', type: 'serie', genre: 'Drama', status: 'vista' },
          { id: '3', title: 'Último Pétalo', type: 'pelicula', genre: 'Romance', status: 'prioridad' },
          { id: '4', title: 'Círculos Infinitos', type: 'serie', genre: 'Suspenso', status: 'pendiente' }
        ]
      }
      
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoData)
      })
      
      if (res.ok) {
        // Trigger a page reload to pull fresh data
        window.location.reload()
      }
    } catch (err) {
      console.error('Error resetting demo database:', err)
      alert('Error de conexión al restablecer los datos.')
    }
  }
}
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(51, 49, 46, 0.45);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  background-color: var(--color-surface-container-lowest);
  border-left: 1px solid var(--color-outline-variant);
  width: 100%;
  max-width: 400px;
  height: 100%;
  box-shadow: -8px 0 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--color-outline-variant);
}

.drawer-headline {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
}

.close-btn {
  color: var(--color-outline);
}

.drawer-body {
  padding: 24px;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.drawer-intro {
  font-size: 0.9rem;
  color: var(--color-on-surface-variant);
  margin-bottom: 28px;
  line-height: 1.55;
}

.settings-form {
  display: flex;
  flex-direction: column;
}

.countdown-preview {
  margin-top: 8px;
  margin-bottom: 24px;
  padding: 10px 14px;
  background-color: var(--color-on-primary-container);
  color: var(--color-primary);
  border-radius: var(--radius-default);
  font-size: 0.82rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-icon {
  color: var(--color-primary);
}

.full-width {
  width: 100%;
}

.drawer-divider {
  height: 1px;
  background-color: var(--color-outline-variant);
  margin: 32px 0 24px;
}

.reset-zone {
  margin-top: auto; /* Push to bottom */
  background-color: var(--color-surface-container-low);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  padding: 20px;
}

.reset-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-error);
  margin-bottom: 6px;
}

.reset-desc {
  font-size: 0.82rem;
  color: var(--color-on-surface-variant);
  margin-bottom: 16px;
  line-height: 1.45;
}

.btn-reset {
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: 1px solid var(--color-error);
  color: var(--color-error);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.btn-reset:hover {
  background-color: var(--color-error-container);
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
