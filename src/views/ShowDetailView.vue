<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFavorites } from '@/composables/useFavorites'
import { useShow } from '@/composables/useShows'
import ErrorState from '@/components/ErrorState.vue'
import Skeleton from '@/components/Skeleton.vue'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue'
import ExternalLinkIcon from '@/components/icons/ExternalLinkIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import StarIcon from '@/components/icons/StarIcon.vue'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const { show, loading, error, loadShow } = useShow(id)
const { isFavorite, toggle } = useFavorites()
const isFav = computed(() => isFavorite(id))

onMounted(loadShow)

function stripHtml(html: string | null) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}
</script>

<template>
  <div class="detail-page">
    <button class="back-btn" aria-label="Go back" @click="router.back()">
      <ArrowLeftIcon /> Back
    </button>

    <ErrorState
      v-if="error"
      message="Could not load this show"
      detail="It may have been removed or TVMaze is temporarily unavailable."
      @retry="loadShow"
    />

    <!-- Skeleton -->
    <div v-else-if="loading" class="show">
      <Skeleton width="300" height="450" :border-radius="12" />
      <div class="skeleton-info">
        <div style="display: flex; gap: 8px; margin-bottom: 12px">
          <Skeleton width="60" height="22" :border-radius="20" />
          <Skeleton width="80" height="22" :border-radius="20" />
        </div>
        <Skeleton width="260" height="36" style="margin-bottom: 24px" />
        <Skeleton width="100%" height="100" :border-radius="10" style="margin-bottom: 28px" />
        <Skeleton width="100%" height="14" style="margin-bottom: 10px" />
        <Skeleton width="90%" height="14" style="margin-bottom: 10px" />
        <Skeleton width="75%" height="14" style="margin-bottom: 10px" />
        <Skeleton width="80%" height="14" />
      </div>
    </div>

    <article v-else-if="show" class="show">
      <div class="hero">
        <img
          v-if="show.image?.original"
          :src="show.image.original"
          :alt="`${show.name} poster`"
          class="hero-img"
        />
        <div v-else class="hero-placeholder" aria-hidden="true">
          {{ show.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() }}
        </div>
        <div class="hero-overlay" aria-hidden="true" />
        <button
          type="button"
          class="favorite-btn"
          :class="{ 'favorite-btn--active': isFav }"
          :aria-label="isFav ? `Remove ${show.name} from favorites` : `Add ${show.name} to favorites`"
          :aria-pressed="isFav"
          @click="show && toggle(show)"
        >
          <HeartIcon :filled="isFav" />
        </button>
      </div>

      <div class="info">
        <div class="meta-row">
          <span v-for="genre in show.genres" :key="genre" class="genre-tag">{{ genre }}</span>
        </div>

        <h1 class="show-title">{{ show.name }}</h1>

        <div class="stats" aria-label="Show details">
          <div class="stat">
            <span class="stat-label">Rating</span>
            <span class="stat-value rating-value">
              <StarIcon :size="14" />&thinsp;{{ show.rating.average?.toFixed(1) ?? 'N/A' }}
            </span>
          </div>
          <div class="stat">
            <span class="stat-label">Status</span>
            <span class="stat-value">{{ show.status }}</span>
          </div>
          <div v-if="show.runtime" class="stat">
            <span class="stat-label">Runtime</span>
            <span class="stat-value">{{ show.runtime }} min</span>
          </div>
          <div v-if="show.premiered" class="stat">
            <span class="stat-label">Premiered</span>
            <span class="stat-value">{{ show.premiered }}</span>
          </div>
          <div v-if="show.network" class="stat">
            <span class="stat-label">Network</span>
            <span class="stat-value">{{ show.network.name }}</span>
          </div>
          <div v-if="show.language" class="stat">
            <span class="stat-label">Language</span>
            <span class="stat-value">{{ show.language }}</span>
          </div>
        </div>

        <p v-if="show.summary" class="summary">{{ stripHtml(show.summary) }}</p>

        <a
          v-if="show.officialSite"
          :href="show.officialSite"
          target="_blank"
          rel="noopener noreferrer"
          class="official-link"
          :aria-label="`Official site for ${show.name} (opens in new tab)`"
        >
          Official site <ExternalLinkIcon :size="14" />
        </a>
      </div>
    </article>
  </div>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: var(--space-6);
  max-width: 900px;
  margin: 0 auto;
}

.back-btn {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-md);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-bottom: 28px;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.back-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.show {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--space-10);
  align-items: start;
}

.skeleton-info {
  display: flex;
  flex-direction: column;
}

.hero {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 2 / 3;
  background: var(--color-surface);
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-text-dim);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--color-hero-gradient), transparent 60%);
}

.favorite-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: var(--radius-pill);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-overlay);
  color: var(--color-text);
  backdrop-filter: blur(6px);
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease, transform 0.15s ease;
}

.favorite-btn:hover {
  color: var(--color-heart);
  background: var(--color-overlay-dark);
  transform: scale(1.06);
}

.favorite-btn--active {
  color: var(--color-heart);
  background: var(--color-overlay-dark);
}

.favorite-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.genre-tag {
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-accent);
  background: var(--color-accent-muted);
  padding: 3px 10px;
  border-radius: var(--radius-pill);
}

.show-title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-text);
  margin: 0 0 var(--space-6);
  line-height: 1.2;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: var(--space-4);
  margin-bottom: 28px;
  padding: var(--space-5);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-dim);
}

.stat-value {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
}

.rating-value {
  color: var(--color-rating);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.summary {
  color: var(--color-text-muted);
  line-height: 1.7;
  font-size: var(--font-size-base);
  margin: 0 0 var(--space-6);
}

.official-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-accent);
  font-size: var(--font-size-md);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.official-link:hover {
  border-color: var(--color-accent);
}

@media (max-width: 640px) {
  .show {
    grid-template-columns: 1fr;
  }

  .hero {
    max-width: 240px;
    margin: 0 auto;
  }

  .show-title {
    font-size: 1.5rem;
  }
}
</style>
