<template>
  <div>
    <h2 class="page-title">Pelis o series por ver</h2>
    <p class="page-subtitle">Nuestra lista compartida de historias por descubrir.</p>

    <!-- Search Bar -->
    <div class="search-container">
      <Search class="search-icon" :size="20" />
      <input 
        type="text" 
        placeholder="¿Qué vamos a ver hoy?" 
        class="search-input"
        v-model="searchQuery"
        id="input-watchlist-search"
      />
    </div>

    <!-- Filter Chips -->
    <div class="filter-scroll" role="tablist" aria-label="Filtros de lista de reproducción">
      <button 
        class="filter-chip"
        :class="{ 'filter-chip-active': activeFilter === 'todas' }"
        @click="activeFilter = 'todas'"
        role="tab"
        :aria-selected="activeFilter === 'todas'"
        id="filter-all"
      >
        Todas
      </button>
      <button 
        class="filter-chip"
        :class="{ 'filter-chip-active': activeFilter === 'pelicula' }"
        @click="activeFilter = 'pelicula'"
        role="tab"
        :aria-selected="activeFilter === 'pelicula'"
        id="filter-movies"
      >
        Películas
      </button>
      <button 
        class="filter-chip"
        :class="{ 'filter-chip-active': activeFilter === 'serie' }"
        @click="activeFilter = 'serie'"
        role="tab"
        :aria-selected="activeFilter === 'serie'"
        id="filter-series"
      >
        Series
      </button>
      <button 
        class="filter-chip"
        :class="{ 'filter-chip-active': activeFilter === 'prioridad' }"
        @click="activeFilter = 'prioridad'"
        role="tab"
        :aria-selected="activeFilter === 'prioridad'"
        id="filter-priority"
      >
        Prioridad
      </button>
      <button 
        class="filter-chip"
        :class="{ 'filter-chip-active': activeFilter === 'vista' }"
        @click="activeFilter = 'vista'"
        role="tab"
        :aria-selected="activeFilter === 'vista'"
        id="filter-watched"
      >
        Ya vistas
      </button>
    </div>

    <!-- Media Cards List -->
    <div v-if="filteredMedia.length > 0" class="media-list">
      <div 
        v-for="item in filteredMedia" 
        :key="item.id" 
        class="media-card"
        :id="'media-' + item.id"
      >
        <!-- Card Body -->
        <div class="media-body">
          <div class="media-header">
            <span class="media-badge" :class="'badge-' + item.type">
              {{ item.type === 'pelicula' ? 'Película' : 'Serie' }}
            </span>
            <span class="media-bullet">•</span>
            <span class="media-genre">{{ item.genre || 'General' }}</span>
          </div>

          <h3 class="media-title">{{ item.title }}</h3>

          <!-- Status Indicator -->
          <div class="media-status" :class="'status-' + item.status">
            <component :is="getStatusIcon(item.status)" :size="16" />
            <span>{{ getStatusLabel(item.status) }}</span>
          </div>
        </div>

        <!-- Three-dots Actions Dropdown -->
        <div class="media-actions-wrapper">
          <button 
            class="btn-icon" 
            @click="toggleDropdown(item.id)" 
            title="Opciones de título"
            :id="'btn-menu-media-' + item.id"
          >
            <MoreVertical :size="20" />
          </button>
          
          <!-- Dropdown Popup -->
          <div v-if="openDropdownId === item.id" class="actions-dropdown" :id="'menu-popover-' + item.id">
            <button @click="changeStatus(item.id, 'pendiente')" class="dropdown-item">
              <Clock :size="14" />
              <span>Pendiente</span>
            </button>
            <button @click="changeStatus(item.id, 'prioridad')" class="dropdown-item text-primary">
              <Heart :size="14" />
              <span>Prioridad</span>
            </button>
            <button @click="changeStatus(item.id, 'vista')" class="dropdown-item text-tertiary">
              <CheckCircle :size="14" />
              <span>Ya vista</span>
            </button>
            <div class="dropdown-divider"></div>
            <button @click="deleteMedia(item.id)" class="dropdown-item text-error">
              <Trash2 :size="14" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <Film :size="48" class="empty-icon" />
      <h3>No se encontraron resultados</h3>
      <p>Prueba a cambiar tu término de búsqueda o añade una nueva película a la lista.</p>
    </div>

    <!-- Dashed placeholder card at the bottom -->
    <div class="card-dashed" @click="$emit('open-add')" id="btn-watchlist-dashed-add">
      <Plus :size="18" />
      <span>Añadir título a la lista</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  Search, 
  MoreVertical, 
  Clock, 
  Heart, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Film 
} from 'lucide-vue-next'

const props = defineProps({
  state: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'open-add'])

// Filters and search queries
const searchQuery = ref('')
const activeFilter = ref('todas')
const openDropdownId = ref(null)

// Filtering logic
const filteredMedia = computed(() => {
  if (!props.state.peliculas) return []

  return props.state.peliculas.filter(item => {
    // 1. Filter by Search Query
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          (item.genre && item.genre.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    if (!matchesSearch) return false

    // 2. Filter by Chip Tab
    if (activeFilter.value === 'todas') return true
    if (activeFilter.value === 'pelicula') return item.type === 'pelicula'
    if (activeFilter.value === 'serie') return item.type === 'serie'
    if (activeFilter.value === 'prioridad') return item.status === 'prioridad'
    if (activeFilter.value === 'vista') return item.status === 'vista'
    
    return true
  })
})

// Status styling mapping helpers
function getStatusIcon(status) {
  switch (status) {
    case 'pendiente': return Clock
    case 'prioridad': return Heart
    case 'vista': return CheckCircle
    default: return Clock
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'pendiente': return 'Pendiente'
    case 'prioridad': return 'Prioridad'
    case 'vista': return 'Ya vista'
    default: return 'Pendiente'
  }
}

// Dropdown popup manager
function toggleDropdown(id) {
  if (openDropdownId.value === id) {
    openDropdownId.value = null
  } else {
    openDropdownId.value = id
  }
}

function changeStatus(id, newStatus) {
  const newState = JSON.parse(JSON.stringify(props.state))
  const item = newState.peliculas.find(p => p.id === id)
  if (item) {
    item.status = newStatus
    emit('update', newState)
  }
  openDropdownId.value = null
}

function deleteMedia(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este título de la lista?')) {
    const newState = JSON.parse(JSON.stringify(props.state))
    newState.peliculas = newState.peliculas.filter(p => p.id !== id)
    emit('update', newState)
  }
  openDropdownId.value = null
}

// Close dropdown clicking outside the card
function closeDropdownOnClickOutside(e) {
  if (!e.target.closest('.media-actions-wrapper')) {
    openDropdownId.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdownOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownOnClickOutside)
})
</script>

<style scoped>
/* Search bar styling */
.search-container {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 52px;
  background-color: var(--color-surface-container-lowest);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  color: var(--color-on-surface);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01);
  outline: none;
  transition: border-color 0.2s, background-color 0.2s;
}

.search-input:focus {
  border-color: var(--color-primary);
  background-color: var(--color-surface-container-lowest);
}

.search-input::placeholder {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--color-outline);
  opacity: 0.6;
}

.search-icon {
  position: absolute;
  left: 20px;
  color: var(--color-outline);
}

/* Scrollable filter chips */
.filter-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 28px;
  scrollbar-width: none; /* Hide scrollbar for Firefox */
}

.filter-scroll::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome/Safari */
}

.filter-chip {
  padding: 8px 18px;
  border-radius: var(--radius-full);
  background-color: var(--color-surface-container-low);
  border: 1px solid transparent;
  color: var(--color-on-surface-variant);
  font-size: 0.92rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s, color 0.2s, transform 0.1s;
}

.filter-chip:hover {
  background-color: var(--color-surface-container);
  color: var(--color-primary);
}

.filter-chip-active {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(113, 70, 65, 0.15);
}

/* Media Cards */
.media-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.media-card {
  background-color: var(--color-surface-container-lowest);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.01);
  transition: transform 0.2s, box-shadow 0.2s;
}

.media-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(113, 70, 65, 0.04);
}

.media-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
}

.media-header {
  display: flex;
  align-items: center;
  font-size: 0.78rem;
  color: var(--color-on-surface-variant);
  letter-spacing: 0.03em;
}

.media-badge {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  background-color: var(--color-surface-container-low);
}

.badge-pelicula {
  background-color: #f7ede2;
  color: #c88a4e;
}

.badge-serie {
  background-color: #e3ebf0;
  color: #558296;
}

.media-bullet {
  margin: 0 8px;
  color: var(--color-outline-variant);
}

.media-genre {
  font-weight: 500;
}

.media-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
  color: #2d2926;
  line-height: 1.25;
}

.media-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88rem;
  font-weight: 500;
}

.status-pendiente {
  color: var(--color-outline);
}

.status-prioridad {
  color: var(--color-primary);
}

.status-vista {
  color: var(--color-tertiary);
}

/* Actions Menu Popover */
.media-actions-wrapper {
  position: relative;
}

.actions-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: var(--color-surface-container-lowest);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  width: 170px;
  display: flex;
  flex-direction: column;
  padding: 6px 0;
  z-index: 50;
  animation: fade-in 0.15s ease;
}

.dropdown-item {
  background: transparent;
  border: none;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  font-size: 0.88rem;
  color: var(--color-on-surface);
  cursor: pointer;
  width: 100%;
  transition: background-color 0.15s;
}

.dropdown-item:hover {
  background-color: var(--color-surface-container-low);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--color-outline-variant);
  margin: 6px 0;
}

.text-primary {
  color: var(--color-primary) !important;
}

.text-tertiary {
  color: var(--color-tertiary) !important;
}

.text-error {
  color: var(--color-error) !important;
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
  margin-bottom: 24px;
}

.empty-icon {
  color: var(--color-primary);
  opacity: 0.5;
}
</style>
