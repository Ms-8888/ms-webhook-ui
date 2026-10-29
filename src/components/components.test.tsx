import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatCard } from './StatCard'
import { SettingsDrawer } from './SettingsDrawer'
import { Overview } from '../pages/Overview'
import { useStore } from '../store'

describe('StatCard', () => {
  it('renders label, value and optional sub text', () => {
    render(<StatCard label="Queue depth" value={3} sub="pending deliveries" />)
    expect(screen.getByText('Queue depth')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('pending deliveries')).toBeInTheDocument()
  })
})

describe('Overview page', () => {
  it('shows the fixture metrics in mock mode', async () => {
    useStore.setState({ mockMode: true, apiKey: '' })
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <Overview />
      </QueryClientProvider>,
    )
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument()
    expect(await screen.findByText('847')).toBeInTheDocument()
    expect(screen.getByText('94.0%')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })
})

describe('SettingsDrawer', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<SettingsDrawer open={false} onClose={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('saves the typed API key to the store', async () => {
    useStore.setState({ apiKey: '', mockMode: true })
    const user = userEvent.setup()
    render(<SettingsDrawer open onClose={vi.fn()} />)
    await user.type(screen.getByPlaceholderText('Enter your X-API-Key'), 'my-key')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(useStore.getState().apiKey).toBe('my-key')
  })

  it('disables Test connection until a key is entered', () => {
    useStore.setState({ apiKey: '', mockMode: true })
    render(<SettingsDrawer open onClose={() => {}} />)
    expect(screen.getByRole('button', { name: 'Test connection' })).toBeDisabled()
  })
})
