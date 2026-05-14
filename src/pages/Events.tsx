import { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getEvents } from "../lib/api"
import { EventDetailModal } from "../components/EventDetailModal"

type EventRow = { id: number; event_type: string; payload: Record<string, unknown>; created_at: string }

const statusBadge = "bg-gray-100 text-gray-600"

export function Events() {
  const [page, setPage] = useState(1)
  const [allEvents, setAllEvents] = useState<EventRow[]>([])
  const [selected, setSelected] = useState<{ id: number; type: string } | null>(null)
  const loadedPages = useRef(new Set<number>())

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", page],
    queryFn: () => getEvents(page),
    refetchInterval: 10000,
  })

  useEffect(() => {
    if (events.length === 0) return
    if (loadedPages.current.has(page)) return
    loadedPages.current.add(page)
    setAllEvents((prev) => (page === 1 ? events : [...prev, ...events]))
  }, [events, page])

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-5">Events</h1>

      {isLoading && allEvents.length === 0 ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : allEvents.length === 0 ? (
        <p className="text-sm text-gray-400">No events fired yet. Use the API to send your first event.</p>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            <div className="grid grid-cols-4 px-4 py-2 text-xs text-gray-400 font-medium">
              <span>Type</span>
              <span>Payload preview</span>
              <span>Deliveries</span>
              <span>Time</span>
            </div>
            {allEvents.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setSelected({ id: ev.id, type: ev.event_type })}
                className="grid grid-cols-4 px-4 py-3 text-sm text-left w-full hover:bg-gray-50 transition-colors"
              >
                <span className="font-mono text-indigo-700 text-xs">{ev.event_type}</span>
                <span className="text-gray-500 text-xs truncate">{JSON.stringify(ev.payload).slice(0, 40)}…</span>
                <span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge}`}>
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
