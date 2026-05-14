import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getEvents } from "../lib/api"
import { EventDetailModal } from "../components/EventDetailModal"

const statusColors: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
}

export function Events() {
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<{ id: number; type: string } | null>(null)

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", page],
    queryFn: () => getEvents(page),
    refetchInterval: 10000,
  })

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-5">Events</h1>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-gray-400">No events fired yet. Use the API to send your first event.</p>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            <div className="grid grid-cols-4 px-4 py-2 text-xs text-gray-400 font-medium">
              <span>Type</span>
              <span>Payload preview</span>
              <span>Status</span>
              <span>Time</span>
            </div>
            {events.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setSelected({ id: ev.id, type: ev.event_type })}
                className="grid grid-cols-4 px-4 py-3 text-sm text-left w-full hover:bg-gray-50 transition-colors"
              >
                <span className="font-mono text-indigo-700 text-xs">{ev.event_type}</span>
                <span className="text-gray-500 text-xs truncate">{JSON.stringify(ev.payload).slice(0, 40)}…</span>
                <span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600`}>
                    view
                  </span>
                </span>
                <span className="text-gray-400 text-xs">{new Date(ev.created_at).toLocaleTimeString()}</span>
              </button>
            ))}
          </div>
          {events.length === 20 && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="mt-4 text-sm text-indigo-600 hover:underline"
            >
              Load more
            </button>
          )}
        </>
      )}

      {selected && (
        <EventDetailModal
          eventId={selected.id}
          eventType={selected.type}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
