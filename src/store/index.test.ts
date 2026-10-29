import { beforeEach, describe, expect, it } from 'vitest'
import { useStore } from './index'

describe('store', () => {
  beforeEach(() => {
    localStorage.clear()
    useStore.setState({ apiKey: '', mockMode: true })
  })

  it('starts with an empty API key', () => {
    expect(useStore.getState().apiKey).toBe('')
  })

  it('setApiKey, toggleMockMode and setMockMode update state', () => {
    useStore.getState().setApiKey('abc')
    expect(useStore.getState().apiKey).toBe('abc')
    useStore.getState().toggleMockMode()
    expect(useStore.getState().mockMode).toBe(false)
    useStore.getState().setMockMode(true)
    expect(useStore.getState().mockMode).toBe(true)
  })

  it('persists only apiKey and mockMode, not the action functions', () => {
    useStore.getState().setApiKey('persist-me')
    const raw = localStorage.getItem('ms-webhook-ui')
    expect(raw).not.toBeNull()
    const state = JSON.parse(raw as string).state
    expect(Object.keys(state).sort()).toEqual(['apiKey', 'mockMode'])
    expect(state.apiKey).toBe('persist-me')
  })
})
