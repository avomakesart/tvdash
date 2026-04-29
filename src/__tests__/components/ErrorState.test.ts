import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorState from '@/components/ErrorState.vue'

describe('ErrorState', () => {
  it('renders the default message when none is provided', () => {
    const wrapper = mount(ErrorState)
    expect(wrapper.find('.message').text()).toBe('Something went wrong')
  })

  it('renders a custom message', () => {
    const wrapper = mount(ErrorState, { props: { message: 'Could not load shows' } })
    expect(wrapper.find('.message').text()).toBe('Could not load shows')
  })

  it('renders the detail when provided', () => {
    const wrapper = mount(ErrorState, { props: { detail: 'TVMaze is down' } })
    expect(wrapper.find('.detail').text()).toBe('TVMaze is down')
  })

  it('does not render detail element when not provided', () => {
    const wrapper = mount(ErrorState)
    expect(wrapper.find('.detail').exists()).toBe(false)
  })

  it('emits retry when the button is clicked', async () => {
    const wrapper = mount(ErrorState)
    await wrapper.find('.retry-btn').trigger('click')
    expect(wrapper.emitted('retry')).toBeTruthy()
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('has role=alert for screen readers', () => {
    const wrapper = mount(ErrorState)
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })
})
