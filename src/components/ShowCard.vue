<script setup lang="ts">
import { computed } from 'vue'
import { useFavorites } from '@/composables/useFavorites'
import type { Show } from '@/types'
import HeartIcon from './icons/HeartIcon.vue'
import StarIcon from './icons/StarIcon.vue'

const props = defineProps<{ show: Show }>()

const { isFavorite, toggle } = useFavorites()

const rating = computed(() => props.show.rating.average?.toFixed(1) ?? 'N/A')
const image = computed(() => props.show.image?.medium ?? null)
const initials = computed(() =>
  props.show.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase(),
)
const isFav = computed(() => isFavorite(props.show.id))

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).click()
  }
}
</script>

<template>
  <article
    class="show-card"
    role="button"
    :tabindex="0"
    :aria-label="`${show.name}${rating !== 'N/A' ? `, rated ${rating}` : ''}`"
    @keydown="handleKeydown"
  >
    <div class="poster">
      <img v-if="image" :src="image" :alt="show.name" loading="lazy" />
      <div v-else class="placeholder" aria-hidden="true">{{ initials }}</div>

      <span
        class="rating"
        :class="{ 'rating--high': (show.rating.average ?? 0) >= 8 }"
        aria-hidden="true"
      >
        <StarIcon />&thinsp;{{ rating }}
      </span>

      <button
        type="button"
        class="favorite-btn"
        :class="{ 'favorite-btn--active': isFav }"
        :aria-label="isFav ? `Remove ${show.name} from favorites` : `Add ${show.name} to favorites`"
        :aria-pressed="isFav"
        @click.stop="toggle(show.id)"
      >
        <HeartIcon :filled="isFav" />
      </button>
    </div>
    <p class="title">{{ show.name }}</p>
  </article>
</template>

<style scoped>
.show-card {
  flex: 0 0 auto;
  width: 140px;
  cursor: pointer;
  transition: transform 0.2s ease;
  outline: none;
}

.show-card:hover {
  transform: scale(1.05);
}

.show-card:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: var(--space-1);
  border-radius: var(--radius-md);
}

.poster {
  position: relative;
  width: 140px;
  height: 196px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface);
}

.poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-dim);
  background: var(--color-surface);
}

.rating {
  position: absolute;
  bottom: var(--space-1);
  right: var(--space-1);
  background: var(--color-overlay-dark);
  color: var(--color-rating);
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 2px var(--space-1);
  border-radius: var(--radius-sm);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.rating--high {
  background: var(--color-rating-high-bg);
  color: #fff;
}

.favorite-btn {
  position: absolute;
  top: var(--space-1);
  right: var(--space-1);
  width: 28px;
  height: 28px;
  border-radius: var(--radius-pill);
  border: none;
  background: var(--color-overlay);
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  opacity: 0;
  transform: scale(0.92);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease,
    color 0.15s ease,
    background 0.15s ease;
}

.poster:hover .favorite-btn,
.favorite-btn:focus-visible,
.favorite-btn--active {
  opacity: 1;
  transform: scale(1);
}

.favorite-btn:hover {
  color: var(--color-heart);
  background: var(--color-overlay-dark);
  transform: scale(1.08);
}

.favorite-btn--active {
  color: var(--color-heart);
  background: var(--color-overlay-dark);
}

.favorite-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

@media (hover: none) {
  .favorite-btn {
    opacity: 1;
    transform: scale(1);
  }
}

.title {
  margin: var(--space-2) 0 0;
  font-size: var(--font-size-body);
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}
</style>
