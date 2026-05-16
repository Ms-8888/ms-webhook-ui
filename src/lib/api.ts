import { useStore } from "../store"
import { mockDeliveries, mockEndpoints, mockEvents, mockMetrics, mockMetricsChart } from "./fixtures"

const BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "")

function isMock() {
  return useStore.getState().mockMode
}

function headers() {
  const key = useStore.getState().apiKey
  return { "Content-Type": "application/json", "X-API-Key": key }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: headers() })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export async function getMetrics() {
  if (isMock()) return mockMetrics
  return request<typeof mockMetrics>("/metrics")
}

export async function getMetricsChart() {
  if (isMock()) return mockMetricsChart
  return request<typeof mockMetricsChart>("/metrics/chart")
}

export async function getEndpoints() {
  if (isMock()) return mockEndpoints
  return request<typeof mockEndpoints>("/endpoints")
}

export async function createEndpoint(url: string, description?: string) {
  if (isMock()) return { ...mockEndpoints[0], id: Date.now(), url, description }
  return request("/endpoints", { method: "POST", body: JSON.stringify({ url, description }) })
}

export async function deleteEndpoint(id: number) {
  if (isMock()) return
  return request(`/endpoints/${id}`, { method: "DELETE" })
}

export async function getEvents(page = 1) {
  if (isMock()) return mockEvents
  return request<typeof mockEvents>(`/events?page=${page}`)
}

export async function getDeliveries(eventId: number) {
  if (isMock()) return mockDeliveries
  return request<typeof mockDeliveries>(`/events/${eventId}/deliveries`)
}

export async function checkHealth() {
  return request<{ status: string; db: string; redis: string }>("/health")
}
