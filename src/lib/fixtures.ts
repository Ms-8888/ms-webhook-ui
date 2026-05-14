export const mockMetrics = {
  total_events_today: 847,
  delivery_success_rate: 0.94,
  queue_depth: 3,
  failed_deliveries_24h: 12,
}

export const mockEndpoints = [
  { id: 1, url: "https://api.acme.com/webhooks", description: "ACME production", is_active: true, created_at: "2025-01-14T09:00:00Z" },
  { id: 2, url: "https://hooks.slack.com/services/T00/B00/xxx", description: "Slack alerts", is_active: true, created_at: "2025-01-13T14:30:00Z" },
  { id: 3, url: "https://staging.acme.com/webhooks", description: "ACME staging", is_active: false, created_at: "2025-01-10T11:00:00Z" },
]

export const mockEvents = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  event_type: ["order.created", "payment.failed", "user.signup"][i % 3],
  payload: { id: 1000 + i, amount: i % 3 === 0 ? 99.99 : undefined },
  created_at: new Date(Date.now() - i * 3600000).toISOString(),
}))

export const mockDeliveries = [
  { id: 1, endpoint_id: 1, endpoint_url: "https://api.acme.com/webhooks", status: "delivered", attempt_count: 1, last_error: null, delivered_at: "2025-01-15T10:23:45Z", created_at: "2025-01-15T10:23:40Z" },
  { id: 2, endpoint_id: 2, endpoint_url: "https://hooks.slack.com/services/T00/B00/xxx", status: "failed", attempt_count: 4, last_error: "Connection timeout after 10000ms — attempt 4 of 4", delivered_at: null, created_at: "2025-01-15T10:23:40Z" },
  { id: 3, endpoint_id: 3, endpoint_url: "https://staging.acme.com/webhooks", status: "pending", attempt_count: 2, last_error: "HTTP 503 Service Unavailable — attempt 2 of 4", delivered_at: null, created_at: "2025-01-15T10:23:40Z" },
]

export const mockMetricsChart = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  rate: +(0.85 + Math.random() * 0.15).toFixed(2),
}))
