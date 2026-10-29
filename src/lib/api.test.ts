import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { checkHealth, createEndpoint, getEndpoints, getMetrics } from './api'
import { mockEndpoints, mockMetrics } from './fixtures'
import { useStore } from '../store'

describe('api client', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('mock mode', () => {
    beforeEach(() => useStore.setState({ mockMode: true, apiKey: '' }))

    it('returns fixtures without calling fetch', async () => {
      expect(await getMetrics()).toEqual(mockMetrics)
      expect(await getEndpoints()).toEqual(mockEndpoints)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('creates an endpoint locally with the supplied url', async () => {
      const created = await createEndpoint('https://example.com/hook', 'demo')
      expect(created).toMatchObject({ url: 'https://example.com/hook', description: 'demo' })
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe('live mode', () => {
    beforeEach(() => useStore.setState({ mockMode: false, apiKey: 'secret-test-key' }))

    it('sends the X-API-Key header and returns parsed JSON', async () => {
      fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => mockMetrics })
      const result = await getMetrics()
      expect(result).toEqual(mockMetrics)
      const [url, init] = fetchMock.mock.calls[0]
      expect(String(url)).toMatch(/\/metrics$/)
      expect(init.headers['X-API-Key']).toBe('secret-test-key')
    })

    it('throws the API detail message on a non-OK response', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 401, json: async () => ({ detail: 'Invalid API key' }) })
      await expect(getMetrics()).rejects.toThrow('Invalid API key')
    })

    it('falls back to the HTTP status when the error body is not JSON', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('not json')
        },
      })
      await expect(getMetrics()).rejects.toThrow('HTTP 500')
    })

    it('checkHealth calls /health even when mock mode is on', async () => {
      useStore.setState({ mockMode: true })
      fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => ({ status: 'ok', db: 'ok', redis: 'ok' }) })
      expect((await checkHealth()).status).toBe('ok')
      expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/health$/)
    })
  })
})
