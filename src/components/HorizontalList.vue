<script setup lang="ts">
import { useRouter } from 'vue-router'
import ShowCard from './ShowCard.vue'
import type { Show } from '@/types'

defineProps<{ shows: readonly Show[] }>()

const router = useRouter()

function openShow(id: number) {
  router.push({ name: 'show', params: { id } })
}
</script>

<template>
  <div class="list-wrapper">
    <div class="list">
      <ShowCard
        v-for="show in shows"
        :key="show.id"
        :show="show"
        @click="openShow(show.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.list-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--color-scrollbar) transparent;
  padding-bottom: var(--space-2);
}

.list-wrapper::-webkit-scrollbar {
  height: 4px;
}

.list-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.list-wrapper::-webkit-scrollbar-thumb {
  background: var(--color-scrollbar);
  border-radius: var(--radius-sm);
}

.list {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-1) 2px var(--space-1);
  width: max-content;
}
</style>
