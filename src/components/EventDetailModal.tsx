import { useQuery } from "@tanstack/react-query"
import { X } from "lucide-react"
import { getDeliveries } from "../lib/api"

const statusColors: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
}

interface Props {
  eventId: number
  eventType: string
  onClose: () => void
}

export function EventDetailModal({ eventId, eventType, onClose }: Props) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["deliveries", eventId],
    queryFn: () => getDeliveries(eventId),
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="font-semibold text-gray-900">Event #{eventId}</p>
            <p className="text-sm text-gray-500">{eventType}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="overflow-auto p-6">
          {isLoading ? (
            <p className="text-sm text-gray-400">Loading deliveries…</p>
          ) : data.length === 0 ? (
            <p className="text-sm text-gray-400">No deliveries for this event.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">Endpoint</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Attempts</th>
                  <th className="pb-2 font-medium">Error</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 font-mono text-xs text-gray-600 max-w-[200px] truncate">{d.endpoint_url}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[d.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{d.attempt_count}</td>
                    <td className="py-3 text-red-500 text-xs max-w-[200px] truncate">{d.last_error ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
