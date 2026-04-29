<script setup lang="ts">
import { computed } from 'vue'

export interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  variant?: 'rectangular' | 'circle' | 'text'
}

const props = withDefaults(defineProps<SkeletonProps>(), {
  width: '100%',
  height: 16,
  borderRadius: 4,
  variant: 'rectangular',
})

function toCssValue(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value
}

const variantRadius = {
  circle: '50%',
  text: '2px',
  rectangular: null,
} as const

const borderRadius = computed(
  () => variantRadius[props.variant] ?? toCssValue(props.borderRadius),
)

const skeletonStyle = computed(() => ({
  width: toCssValue(props.width),
  height: toCssValue(props.height),
  borderRadius: borderRadius.value,
}))
</script>

<template>
  <div class="skeleton" :style="skeletonStyle" :class="{ 'skeleton--circle': variant === 'circle' }" />
</template>

<style scoped>
.skeleton {
  background-color: var(--color-skeleton);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  display: block;
}

.skeleton--circle {
  flex-shrink: 0;
}

@keyframes skeleton-pulse {
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
}
</style>
