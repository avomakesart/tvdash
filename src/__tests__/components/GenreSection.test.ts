import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import GenreSection from '@/components/GenreSection.vue'
import { makeShow } from '../fixtures'

vi.mock('@/composables/useFavorites', () => ({
  useFavorites: () => ({
    favoriteIds: { value: [] },
    isFavorite: () => false,
    toggle: vi.fn(),
  }),
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

describe('GenreSection', () => {
  function mountSection(genre: string, count = 2) {
    return mount(GenreSection, {
      props: {
        group: {
          genre,
          shows: Array.from({ length: count }, (_, i) =>
            makeShow({ id: i + 1, name: `Show ${i + 1}` }),
          ),
        },
      },
      global: { plugins: [router] },
    })
  }

  it('renders the genre title', () => {
    const wrapper = mountSection('Drama')
    expect(wrapper.find('.genre-title').text()).toBe('Drama')
  })

  it('renders a ShowCard for each show in the group', () => {
    const wrapper = mountSection('Comedy', 4)
    expect(wrapper.findAll('.show-card')).toHaveLength(4)
  })

  it('renders with an empty shows array without error', () => {
    const wrapper = mount(GenreSection, {
      props: { group: { genre: 'Empty', shows: [] } },
      global: { plugins: [router] },
    })
    expect(wrapper.find('.genre-title').text()).toBe('Empty')
    expect(wrapper.findAll('.show-card')).toHaveLength(0)
  })
})
