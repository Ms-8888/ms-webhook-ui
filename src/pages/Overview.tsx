import { useQuery } from "@tanstack/react-query"
import { StatCard } from "../components/StatCard"
import { DeliveryRateChart } from "../components/DeliveryRateChart"
import { getMetrics, getMetricsChart } from "../lib/api"
import { useStore } from "../store"

export function Overview() {
  const apiKey = useStore((s) => s.apiKey)
  const mockMode = useStore((s) => s.mockMode)

  const { data: metrics } = useQuery({
    queryKey: ["metrics", apiKey, mockMode],
    queryFn: getMetrics,
    refetchInterval: 5000,
  })

  const { data: chart = [] } = useQuery({
    queryKey: ["metrics-chart", apiKey, mockMode],
    queryFn: getMetricsChart,
    refetchInterval: 30000,
  })

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-5">Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Events today" value={metrics?.total_events_today ?? "—"} />
        <StatCard
          label="Success rate"
          value={metrics ? `${(metrics.delivery_success_rate * 100).toFixed(1)}%` : "—"}
          sub="last 24h"
        />
        <StatCard label="Queue depth" value={metrics?.queue_depth ?? "—"} sub="pending deliveries" />
        <StatCard label="Failed deliveries" value={metrics?.failed_deliveries_24h ?? "—"} sub="last 24h" />
      </div>
      <DeliveryRateChart data={chart} />
    </div>
  )
}
