<template>
  <div class="app-container">
    <!-- Desktop Sidebar -->
    <aside class="desktop-sidebar" aria-label="Navegación principal">
      <div class="sidebar-logo">
        <Heart class="header-icon" />
        <span class="header-title">Our Journey</span>
      </div>
      <nav>
        <ul class="sidebar-menu">
          <li>
            <a 
              href="#"
              class="sidebar-link" 
              :class="{ 'sidebar-link-active': activeTab === 'citas' }"
              @click.prevent="activeTab = 'citas'"
              id="nav-citas-desktop"
            >
              <Calendar :size="20" />
              <span>Próximas Citas</span>
            </a>
          </li>
          <li>
            <a 
              href="#"
              class="sidebar-link" 
              :class="{ 'sidebar-link-active': activeTab === 'boda' }"
              @click.prevent="activeTab = 'boda'"
              id="nav-boda-desktop"
            >
              <BookOpen :size="20" />
              <span>Pendientes Boda</span>
            </a>
          </li>
          <li>
            <a 
              href="#"
              class="sidebar-link" 
              :class="{ 'sidebar-link-active': activeTab === 'casados' }"
              @click.prevent="activeTab = 'casados'"
              id="nav-casados-desktop"
            >
              <Heart :size="20" />
              <span>Citas Casados</span>
            </a>
          </li>
          <li>
            <a 
              href="#"
              class="sidebar-link" 
              :class="{ 'sidebar-link-active': activeTab === 'peliculas' }"
              @click.prevent="activeTab = 'peliculas'"
              id="nav-peliculas-desktop"
            >
              <Film :size="20" />
              <span>Pelis & Series</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Top Header -->
    <header class="app-header">
      <div class="header-title-container">
        <!-- Heart logo visible only on mobile -->
        <Heart class="header-icon md-hide" />
        <span class="header-title md-hide">Our Journey</span>
        
        <!-- Tab status title for desktop -->
        <span class="header-title lg-show">{{ currentTabLabel }}</span>
      </div>

      <div class="header-actions">
        <!-- Live Sync Badge -->
        <div class="sync-badge" :title="connected ? 'Sincronizado con tu pareja en tiempo real' : 'Buscando servidor para sincronizar...'">
          <span class="sync-dot" :class="connected ? 'sync-dot-online' : 'sync-dot-offline'"></span>
          <span>{{ connected ? 'Sincronizado' : 'Conectando...' }}</span>
        </div>
        
        <!-- Settings button -->
        <button 
          class="btn-icon" 
          @click="showSettings = true" 
          title="Ajustes de pareja"
          id="btn-settings"
        >
          <Settings :size="20" />
        </button>
      </div>
    </header>

    <!-- Wedding Countdown Banner -->
    <div v-if="weddingCountdownText" class="countdown-banner">
      <Sparkles :size="16" class="countdown-icon" />
      <span>{{ weddingCountdownText }}</span>
    </div>

    <!-- Active Page View -->
    <main class="page-view" id="main-content">
      <transition name="fade-slide" mode="out-in">
        <component 
          :is="activeComponent" 
          :state="state" 
          @update="updateState" 
          @open-add="triggerAddModal"
        />
      </transition>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="bottom-nav" aria-label="Navegación móvil">
      <button 
        class="nav-item" 
        :class="{ 'nav-item-active': activeTab === 'citas' }"
        @click="activeTab = 'citas'"
        title="Próximas Citas"
        id="nav-citas-mobile"
      >
        <Calendar :size="24" />
      </button>
      <button 
        class="nav-item" 
        :class="{ 'nav-item-active': activeTab === 'boda' }"
        @click="activeTab = 'boda'"
        title="Pendientes Boda"
        id="nav-boda-mobile"
      >
        <BookOpen :size="24" />
      </button>
      <button 
        class="nav-item" 
        :class="{ 'nav-item-active': activeTab === 'casados' }"
        @click="activeTab = 'casados'"
        title="Citas después de casados"
        id="nav-casados-mobile"
      >
        <Heart :size="24" />
      </button>
      <button 
        class="nav-item" 
        :class="{ 'nav-item-active': activeTab === 'peliculas' }"
        @click="activeTab = 'peliculas'"
        title="Pelis o series por ver"
        id="nav-peliculas-mobile"
      >
        <Film :size="24" />
      </button>
    </nav>

    <!-- Floating Action Button (FAB) -->
    <button 
      class="fab" 
      @click="triggerAddModal" 
      :title="'Añadir ' + fabLabel"
      id="btn-fab-add"
    >
      <Plus :size="28" />
    </button>

    <!-- Global Settings Drawer Component -->
    <SettingsDrawer 
      v-if="showSettings" 
      :settings="state.coupleSettings" 
      @close="showSettings = false"
      @save="updateSettings"
    />

    <!-- Contextual Modal Form Component -->
    <ModalForm 
      v-if="showAddModal" 
      :active-tab="activeTab" 
      :state="state"
      @close="showAddModal = false"
      @save="saveNewItem"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { Heart, Calendar, BookOpen, Film, Settings, Plus, Sparkles } from 'lucide-vue-next'

// Lazy-load component imports for better performance and modularity
const ProximasCitas = defineAsyncComponent(() => import('./components/ProximasCitas.vue'))
const PendientesBoda = defineAsyncComponent(() => import('./components/PendientesBoda.vue'))
const CitasCasados = defineAsyncComponent(() => import('./components/CitasCasados.vue'))
const PelisSeries = defineAsyncComponent(() => import('./components/PelisSeries.vue'))
const SettingsDrawer = defineAsyncComponent(() => import('./components/SettingsDrawer.vue'))
const ModalForm = defineAsyncComponent(() => import('./components/ModalForm.vue'))

// App States
const activeTab = ref('citas')
const connected = ref(false)
const showSettings = ref(false)
const showAddModal = ref(false)

const state = ref({
  coupleSettings: { partnerA: 'Dilan', partnerB: 'Sofía', weddingDate: '2027-10-14' },
  citas: [],
  boda: [],
  citasCasados: [],
  peliculas: []
})

// Tab to component mapping
const activeComponent = computed(() => {
  switch (activeTab.value) {
    case 'citas': return ProximasCitas
    case 'boda': return PendientesBoda
    case 'casados': return CitasCasados
    case 'peliculas': return PelisSeries
    default: return ProximasCitas
  }
})

// Custom titles for header layout on large screens
const currentTabLabel = computed(() => {
  switch (activeTab.value) {
    case 'citas': return 'Próximas Citas'
    case 'boda': return 'Preparativos de Boda'
    case 'casados': return 'Deseos Después de Casados'
    case 'peliculas': return 'Nuestra Watchlist'
    default: return ''
  }
})

// Floating Action Button label based on active tab
const fabLabel = computed(() => {
  switch (activeTab.value) {
    case 'citas': return 'cita'
    case 'boda': return 'pendiente'
    case 'casados': return 'deseo'
    case 'peliculas': return 'película o serie'
    default: return 'elemento'
  }
})

// Countdown logic for the wedding date
const weddingCountdownText = computed(() => {
  const settings = state.value.coupleSettings
  if (!settings || !settings.weddingDate) return ''

  const wedding = new Date(settings.weddingDate + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const diffTime = wedding - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Date formatting in Spanish
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  const formattedDate = wedding.toLocaleDateString('es-ES', options)

  if (diffDays > 0) {
    return `¡Faltan ${diffDays} días para nuestra boda! (${formattedDate})`
  } else if (diffDays === 0) {
    return `¡HOY es nuestra boda! ♥`
  } else {
    return `¡Felizmente casados desde el ${formattedDate}! ♥`
  }
})

// Fetch initial state from database
async function fetchInitialData() {
  try {
    const res = await fetch('/api/data')
    if (res.ok) {
      const data = await res.json()
      state.value = data
      localStorage.setItem('our_journey_data', JSON.stringify(data))
    }
  } catch (err) {
    console.error('Error fetching data:', err)
    // Fallback load from local storage
    const local = localStorage.getItem('our_journey_data')
    if (local) state.value = JSON.parse(local)
  }
}

// REST update function, broadcasts through websocket
async function updateState(newState) {
  state.value = newState
  localStorage.setItem('our_journey_data', JSON.stringify(newState))
  
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newState)
    })
    const data = await res.json()
    if (!data.success) {
      console.error('Failed to save update to database')
    }
  } catch (err) {
    console.warn('Network error updating state, will retry when online:', err)
  }
}

// WebSocket setup for real-time synchronization
let socket
function connectWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = window.location.host
  
  socket = new WebSocket(`${protocol}//${host}/ws`)

  socket.onopen = () => {
    connected.value = true
    console.log('WebSocket sync connection active')
  }

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data)
      if (msg.type === 'UPDATE_DATA') {
        state.value = msg.payload
        localStorage.setItem('our_journey_data', JSON.stringify(msg.payload))
      }
    } catch (err) {
      console.error('Error parsing WS message:', err)
    }
  }

  socket.onclose = () => {
    connected.value = false
    console.log('WebSocket closed, attempting reconnect in 3s...')
    setTimeout(connectWebSocket, 3000)
  }

  socket.onerror = () => {
    socket.close()
  }
}

// Settings management
function updateSettings(newSettings) {
  const newState = {
    ...state.value,
    coupleSettings: newSettings
  }
  updateState(newState)
  showSettings.value = false
}

// Floating button dispatcher
function triggerAddModal() {
  showAddModal.value = true
}

// Modal save handlers
function saveNewItem(payload) {
  const newState = JSON.parse(JSON.stringify(state.value))
  
  if (activeTab.value === 'citas') {
    newState.citas.push(payload)
  } else if (activeTab.value === 'boda') {
    // Add to a specific checklist section
    const section = newState.boda.find(s => s.id === payload.sectionId)
    if (section) {
      section.tasks.push({
        id: 't-' + Date.now(),
        title: payload.title,
        completed: false
      })
    }
  } else if (activeTab.value === 'casados') {
    newState.citasCasados.push(payload)
  } else if (activeTab.value === 'peliculas') {
    newState.peliculas.push(payload)
  }

  updateState(newState)
  showAddModal.value = false
}

onMounted(() => {
  fetchInitialData()
  connectWebSocket()
})
</script>

<style scoped>
/* Scoped adjustments helper for layout and banners */
.md-hide {
  display: flex;
}

.lg-show {
  display: none;
}

@media (min-width: 768px) {
  .md-hide {
    display: none !important;
  }
  .lg-show {
    display: flex !important;
  }
}

/* Wedding countdown banner styling */
.countdown-banner {
  background-color: var(--color-on-primary-container);
  color: var(--color-primary);
  padding: 10px var(--padding-mobile);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  border-bottom: 1px solid var(--color-outline-variant);
  animation: fade-in 0.4s ease;
  text-align: center;
}

.countdown-icon {
  color: var(--color-primary);
  animation: spin-slow 8s linear infinite;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Transition Animations for Tab Content */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
