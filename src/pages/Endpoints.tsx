import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2 } from "lucide-react"
import { createEndpoint, deleteEndpoint, getEndpoints } from "../lib/api"
import { useStore } from "../store"

export function Endpoints() {
  const qc = useQueryClient()
  const apiKey = useStore((s) => s.apiKey)
  const mockMode = useStore((s) => s.mockMode)
  const [url, setUrl] = useState("")
  const [desc, setDesc] = useState("")
  const [urlError, setUrlError] = useState("")
  const [confirmId, setConfirmId] = useState<number | null>(null)

  const { data: endpoints = [], isLoading } = useQuery({
    queryKey: ["endpoints", apiKey, mockMode],
    queryFn: getEndpoints,
    refetchInterval: 30000,
  })

  const addMutation = useMutation({
    mutationFn: () => createEndpoint(url, desc || undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["endpoints"] }); setUrl(""); setDesc("") },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteEndpoint(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["endpoints"] }); setConfirmId(null) },
  })

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setUrlError("")
    try { new URL(url) } catch { setUrlError("Enter a valid URL"); return }
    addMutation.mutate()
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-5">Endpoints</h1>

      <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-700">Add endpoint</p>
        <input
          className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="https://your-server.com/webhook"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        {urlError && <p className="text-xs text-red-500">{urlError}</p>}
        <input
          className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Description (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button
          type="submit"
          disabled={addMutation.isPending}
          className="self-start flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          <Plus size={14} /> Add endpoint
        </button>
      </form>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : endpoints.filter((e) => e.is_active).length === 0 ? (
        <p className="text-sm text-gray-400">No endpoints yet. Add your first webhook URL above.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {endpoints.filter((e) => e.is_active).map((ep) => (
            <div key={ep.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-mono text-gray-800">{ep.url}</p>
                {ep.description && <p className="text-xs text-gray-400 mt-0.5">{ep.description}</p>}
              </div>
              {confirmId === ep.id ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Remove?</span>
                  <button onClick={() => deleteMutation.mutate(ep.id)} className="text-red-600 font-medium hover:underline">Yes</button>
                  <button onClick={() => setConfirmId(null)} className="text-gray-400 hover:underline">No</button>
                </div>
              ) : (
                <button onClick={() => setConfirmId(ep.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
