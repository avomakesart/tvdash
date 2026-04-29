<script setup lang="ts">
import HorizontalList from './HorizontalList.vue'
import type { GenreGroup } from '@/types'

defineProps<{ group: GenreGroup }>()
</script>

<template>
  <section class="genre-section">
    <h2 class="genre-title">{{ group.genre }}</h2>
    <HorizontalList :shows="group.shows" />
  </section>
</template>

<style scoped>
.genre-section {
  margin-bottom: 40px;
}

.genre-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 14px;
  padding-left: 2px;
}
</style>
