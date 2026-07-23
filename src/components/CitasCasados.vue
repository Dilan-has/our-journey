<template>
  <div>
    <h2 class="page-title">Citas Después de Casados</h2>
    <p class="page-subtitle">Nuestra lista de deseos románticos y proyectos para cuando empiece nuestra vida juntos.</p>

    <!-- Wishlist Grid -->
    <div v-if="state.citasCasados && state.citasCasados.length > 0" class="bucket-grid">
      <div 
        v-for="item in state.citasCasados" 
        :key="item.id" 
        class="bucket-card"
        :class="{ 'bucket-card-completed': item.completed }"
        :id="'bucket-' + item.id"
      >
        <!-- Header: Checkbox + Title + Delete -->
        <div class="bucket-header">
          <button 
            class="checkbox-ring" 
            :class="{ 'checkbox-ring-checked': item.completed }"
            @click="toggleComplete(item.id)"
            :aria-label="item.completed ? 'Marcar como pendiente' : 'Marcar como completado'"
            :id="'btn-check-bucket-' + item.id"
          >
            <Check v-if="item.completed" class="checkbox-icon" />
          </button>
          
          <h3 class="bucket-title" @click="toggleComplete(item.id)">{{ item.title }}</h3>
          
          <button 
            class="btn-icon delete-btn" 
            @click="deleteItem(item.id)"
            title="Eliminar deseo"
            :id="'btn-delete-bucket-' + item.id"
          >
            <Trash2 :size="16" />
          </button>
        </div>

        <!-- Tag badge -->
        <div class="bucket-meta">
          <span class="chip chip-secondary">{{ item.category || 'Aventura' }}</span>
        </div>

        <!-- Note (cursive handwritten style) -->
        <p v-if="item.notes" class="bucket-note">
          "{{ item.notes }}"
        </p>

        <!-- Partner Excitement Hearts -->
        <div class="bucket-votes">
          <span class="votes-title">Nos entusiasma:</span>
          
          <div class="votes-container">
            <!-- Partner A Vote -->
            <button 
              class="vote-heart-btn" 
              :class="{ 'vote-active': hasVoted(item, state.coupleSettings.partnerA) }"
              @click="toggleVote(item.id, state.coupleSettings.partnerA)"
              :title="'A ' + state.coupleSettings.partnerA + (hasVoted(item, state.coupleSettings.partnerA) ? ' le encanta esto' : ' aún no vota')"
              :id="'btn-vote-partnerA-' + item.id"
            >
              <Heart class="heart-icon" :fill="hasVoted(item, state.coupleSettings.partnerA) ? 'var(--color-primary)' : 'none'" :size="18" />
              <span class="partner-name">{{ state.coupleSettings.partnerA }}</span>
            </button>

            <!-- Partner B Vote -->
            <button 
              class="vote-heart-btn" 
              :class="{ 'vote-active': hasVoted(item, state.coupleSettings.partnerB) }"
              @click="toggleVote(item.id, state.coupleSettings.partnerB)"
              :title="'A ' + state.coupleSettings.partnerB + (hasVoted(item, state.coupleSettings.partnerB) ? ' le encanta esto' : ' aún no vota')"
              :id="'btn-vote-partnerB-' + item.id"
            >
              <Heart class="heart-icon" :fill="hasVoted(item, state.coupleSettings.partnerB) ? 'var(--color-primary)' : 'none'" :size="18" />
              <span class="partner-name">{{ state.coupleSettings.partnerB }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <Heart :size="48" class="empty-icon" />
      <h3>Nuestra lista está vacía</h3>
      <p>Añadan cosas que sueñen con hacer una vez que estén casados.</p>
    </div>

    <!-- Add Button Footer -->
    <div class="action-footer">
      <button 
        class="btn-primary flex-center" 
        @click="$emit('open-add')"
        id="btn-add-bucket-item"
      >
        <Plus :size="18" />
        <span>AÑADIR IDEA A LA LISTA</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { Check, Trash2, Heart, Plus } from 'lucide-vue-next'

const props = defineProps({
  state: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'open-add'])

// Checking if a partner has liked the bucket list item
function hasVoted(item, partnerName) {
  return item.votes && item.votes[partnerName] === true
}

// Toggle complete checkbox
function toggleComplete(id) {
  const newState = JSON.parse(JSON.stringify(props.state))
  const item = newState.citasCasados.find(i => i.id === id)
  if (item) {
    item.completed = !item.completed
    emit('update', newState)
  }
}

// Toggle partner votes/hearts
function toggleVote(itemId, partnerName) {
  const newState = JSON.parse(JSON.stringify(props.state))
  const item = newState.citasCasados.find(i => i.id === itemId)
  if (item) {
    if (!item.votes) item.votes = {}
    item.votes[partnerName] = !item.votes[partnerName]
    emit('update', newState)
  }
}

// Delete item from list
function deleteItem(id) {
  if (confirm('¿Estás seguro de que quieres eliminar este deseo de la lista?')) {
    const newState = JSON.parse(JSON.stringify(props.state))
    newState.citasCasados = newState.citasCasados.filter(i => i.id !== id)
    emit('update', newState)
  }
}
</script>

<style scoped>
.bucket-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 40px;
}

@media (min-width: 768px) {
  .bucket-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.bucket-card {
  background-color: var(--color-surface-container-lowest);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.01);
  transition: transform 0.2s, box-shadow 0.2s;
}

.bucket-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(113, 70, 65, 0.04);
}

.bucket-card-completed {
  background-color: var(--color-surface-container-low);
  opacity: 0.85;
}

.bucket-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.bucket-title {
  font-family: var(--font-display);
  font-size: 1.28rem;
  font-weight: 600;
  color: #2d2926;
  flex-grow: 1;
  cursor: pointer;
  line-height: 1.35;
  transition: color 0.2s;
}

.bucket-card-completed .bucket-title {
  text-decoration: line-through;
  color: var(--color-outline);
}

.bucket-meta {
  margin-bottom: 16px;
  padding-left: 36px; /* Align with checkbox width */
}

/* Handwritten italic notes block */
.bucket-note {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1rem;
  color: var(--color-on-surface-variant);
  padding: 10px 16px;
  background-color: var(--color-background);
  border-left: 2px solid var(--color-outline-variant);
  margin-bottom: 20px;
  margin-left: 36px;
  border-radius: 0 var(--radius-default) var(--radius-default) 0;
}

/* Heart Voting area */
.bucket-votes {
  margin-top: auto;
  border-top: 1px solid var(--color-surface-container);
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 36px;
}

.votes-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-outline);
}

.votes-container {
  display: flex;
  gap: 16px;
}

.vote-heart-btn {
  background: transparent;
  border: 1px solid var(--color-outline-variant);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.vote-heart-btn:hover {
  background-color: var(--color-surface-container);
  border-color: var(--color-primary);
}

.vote-heart-btn.vote-active {
  border-color: var(--color-primary-container);
  background-color: var(--color-on-primary-container);
}

.heart-icon {
  color: var(--color-primary);
  transition: transform 0.2s ease;
}

.vote-heart-btn:hover .heart-icon {
  transform: scale(1.15);
}

.partner-name {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-on-surface);
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.2s, color 0.2s, background-color 0.2s;
}

.bucket-card:hover .delete-btn {
  opacity: 0.5;
}

.bucket-card:hover .delete-btn:hover {
  opacity: 1;
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
