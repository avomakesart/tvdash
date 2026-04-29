<script setup lang="ts">
import CrossIcon from './icons/CrossIcon.vue'
import SearchIcon from './icons/SearchIcon.vue'

defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="search-bar">
    <span class="icon" aria-hidden="true">
      <SearchIcon />
    </span>
    <input
      type="search"
      placeholder="Search shows…"
      aria-label="Search TV shows"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button
      v-if="modelValue"
      class="clear-btn"
      aria-label="Clear search"
      @click="$emit('update:modelValue', '')"
    >
      <CrossIcon />
    </button>
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
  max-width: 480px;
  width: 100%;
}

.icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-dim);
  pointer-events: none;
  display: flex;
}

input {
  width: 100%;
  padding: 10px 36px 10px 42px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-base);
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

input::placeholder {
  color: var(--color-text-dim);
}

input:focus {
  border-color: var(--color-accent);
}

input[type='search']::-webkit-search-cancel-button {
  display: none;
}

.clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  transition: color 0.15s ease;
}

.clear-btn:hover {
  color: var(--color-text);
}
</style>
