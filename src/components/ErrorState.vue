<script setup lang="ts">
defineProps<{
  message?: string
  detail?: string
}>()

defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="error-state" role="alert">
    <span class="icon" aria-hidden="true">⚠</span>
    <p class="message">{{ message ?? 'Something went wrong' }}</p>
    <p v-if="detail" class="detail">{{ detail }}</p>
    <button class="retry-btn" @click="$emit('retry')">Try again</button>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-10) var(--space-6);
  text-align: center;
}

.icon {
  font-size: 2rem;
  color: var(--color-error);
}

.message {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text);
}

.detail {
  font-size: var(--font-size-md);
  color: var(--color-text-dim);
  max-width: 360px;
}

.retry-btn {
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-5);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.retry-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
</style>
