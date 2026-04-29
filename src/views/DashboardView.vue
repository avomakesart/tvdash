<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useFavorites } from '@/composables/useFavorites'
import { useGenres } from '@/composables/useGenres'
import { useSearch } from '@/composables/useSearch'
import { useShows } from '@/composables/useShows'
import ErrorState from '@/components/ErrorState.vue'
import GenreSection from '@/components/GenreSection.vue'
import HorizontalList from '@/components/HorizontalList.vue'
import SearchBar from '@/components/SearchBar.vue'
import ShowCard from '@/components/ShowCard.vue'
import Skeleton from '@/components/Skeleton.vue'
import ClapperBoardIcon from '@/components/icons/ClapperBoardIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'

const route = useRoute()
const router = useRouter()

const { shows, loading, error, loadShows } = useShows()
const { genreGroups } = useGenres(shows)
const { favoriteIds } = useFavorites()

const query = ref(String(route.query.search ?? ''))

watch(query, (q) => {
  router.replace({ query: q ? { search: q } : {} })
}, { flush: 'post' })

const { results: searchResults, loading: searchLoading, error: searchError } = useSearch(query)

const favoriteShows = computed(() =>
  shows.value.filter((s) => favoriteIds.value.includes(s.id)),
)

onMounted(loadShows)
</script>

<template>
  <div class="dashboard">
    <header class="header">
      <div class="header-inner">
        <a href="/" class="home-link">
          <h1 class="logo">TV<span>Dash</span></h1>
        </a>
        <SearchBar v-model="query" />
      </div>
    </header>

    <main class="content">
      <template v-if="query.trim()">
        <p class="search-label">
          {{
            searchLoading
              ? 'Searching…'
              : `${searchResults.length} result${searchResults.length === 1 ? '' : 's'} for "${query}"`
          }}
        </p>

        <ErrorState
          v-if="searchError"
          message="Search failed"
          :detail="searchError"
          @retry="query = query.trim()"
        />

        <div v-else-if="searchLoading" class="search-grid">
          <div v-for="i in 8" :key="i" class="skeleton-card">
            <Skeleton width="140" height="196" :border-radius="8" />
            <Skeleton width="110" height="11" style="margin-top: 8px" />
          </div>
        </div>

        <div v-else-if="searchResults.length === 0" class="empty-state">
          <span class="empty-icon" aria-hidden="true"><ClapperBoardIcon /></span>
          <p class="empty-main">No shows found for <strong>"{{ query }}"</strong></p>
          <p class="empty-hint">Try a different title or check the spelling.</p>
        </div>

        <div v-else class="search-grid">
          <ShowCard
            v-for="show in searchResults"
            :key="show.id"
            :show="show"
            @click="router.push({ name: 'show', params: { id: show.id } })"
          />
        </div>
      </template>

      <template v-else>
        <ErrorState
          v-if="error"
          message="Could not load shows"
          detail="TVMaze may be temporarily unavailable."
          @retry="loadShows"
        />

        <template v-else-if="loading">
          <div v-for="i in 4" :key="i" class="skeleton-section">
            <Skeleton :width="80 + i * 20" height="14" style="margin-bottom: 16px" />
            <div class="skeleton-row">
              <div v-for="j in 7" :key="j" class="skeleton-card">
                <Skeleton width="140" height="196" :border-radius="8" />
                <Skeleton width="110" height="11" style="margin-top: 8px" />
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <section v-if="favoriteShows.length" class="favorites-section">
            <h2 class="favorites-title">
              <HeartIcon filled /> My Favorites
            </h2>
            <HorizontalList :shows="favoriteShows" />
          </section>

          <GenreSection v-for="group in genreGroups" :key="group.genre" :group="group" />
        </template>
      </template>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: var(--color-bg);
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--color-bg-glass);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-surface);
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 14px var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.home-link {
  text-decoration: none;
}

.logo {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--color-text);
  white-space: nowrap;
  flex-shrink: 0;
  margin: 0;
}

.logo span {
  color: var(--color-accent);
}

.content {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

.search-label {
  color: var(--color-text-dim);
  font-size: var(--font-size-md);
  margin: 0 0 var(--space-5);
}

.search-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
}

.skeleton-section {
  margin-bottom: var(--space-10);
}

.skeleton-row {
  display: flex;
  gap: var(--space-4);
  overflow: hidden;
}

.skeleton-card {
  flex: 0 0 auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-10) 0;
  text-align: center;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-2);
}

.empty-main {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
}

.empty-hint {
  font-size: var(--font-size-md);
  color: var(--color-text-dim);
}

.favorites-section {
  margin-bottom: var(--space-10);
}

.favorites-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-heart);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 14px;
  padding-left: 2px;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
</style>
