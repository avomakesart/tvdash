import { describe, it, expect, vi } from 'vitest'
import { computed } from 'vue'
import { mount } from '@vue/test-utils'
import ShowCard from '@/components/ShowCard.vue'
import { makeShow } from '../fixtures'

vi.mock('@/composables/useFavorites', () => ({
  useFavorites: () => ({
    favoriteIds: computed(() => [] as number[]),
    isFavorite: () => false,
    toggle: vi.fn(),
  }),
}))

describe('ShowCard', () => {
  it('renders the show name', () => {
    const wrapper = mount(ShowCard, { props: { show: makeShow({ name: 'Breaking Bad' }) } })
    expect(wrapper.find('.title').text()).toBe('Breaking Bad')
  })

  it('renders a formatted rating', () => {
    const wrapper = mount(ShowCard, { props: { show: makeShow({ rating: { average: 9.5 } }) } })
    expect(wrapper.find('.rating').text()).toContain('9.5')
  })

  it('shows N/A when rating is null', () => {
    const wrapper = mount(ShowCard, { props: { show: makeShow({ rating: { average: null } }) } })
    expect(wrapper.find('.rating').text()).toContain('N/A')
  })

  it('renders the poster image when available', () => {
    const show = makeShow({ image: { medium: 'http://img.example.com/m.jpg', original: null } })
    const wrapper = mount(ShowCard, { props: { show } })
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('http://img.example.com/m.jpg')
  })

  it('renders initials placeholder when there is no image', () => {
    const wrapper = mount(ShowCard, { props: { show: makeShow({ name: 'Breaking Bad', image: null }) } })
    expect(wrapper.find('.placeholder').exists()).toBe(true)
    expect(wrapper.find('.placeholder').text()).toBe('BB')
  })

  it('uses first two words for initials', () => {
    const wrapper = mount(ShowCard, { props: { show: makeShow({ name: 'Game Of Thrones', image: null }) } })
    expect(wrapper.find('.placeholder').text()).toBe('GO')
  })

  it('applies rating--high class when rating is 8 or above', () => {
    const wrapper = mount(ShowCard, { props: { show: makeShow({ rating: { average: 8.0 } }) } })
    expect(wrapper.find('.rating').classes()).toContain('rating--high')
  })

  it('does not apply rating--high class when rating is below 8', () => {
    const wrapper = mount(ShowCard, { props: { show: makeShow({ rating: { average: 7.9 } }) } })
    expect(wrapper.find('.rating').classes()).not.toContain('rating--high')
  })

  it('does not apply rating--high class when rating is null', () => {
    const wrapper = mount(ShowCard, { props: { show: makeShow({ rating: { average: null } }) } })
    expect(wrapper.find('.rating').classes()).not.toContain('rating--high')
  })

  it('renders the favorite button', () => {
    const wrapper = mount(ShowCard, { props: { show: makeShow() } })
    expect(wrapper.find('.favorite-btn').exists()).toBe(true)
  })

  it('favorite button has correct aria-label when not favorited', () => {
    const wrapper = mount(ShowCard, { props: { show: makeShow({ name: 'Breaking Bad' }) } })
    expect(wrapper.find('.favorite-btn').attributes('aria-label')).toContain('Add Breaking Bad')
  })

  it('card has role=button and tabindex for keyboard navigation', () => {
    const wrapper = mount(ShowCard, { props: { show: makeShow() } })
    expect(wrapper.find('.show-card').attributes('role')).toBe('button')
    expect(wrapper.find('.show-card').attributes('tabindex')).toBe('0')
  })
})
