import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { useStore } from "../store"
import { checkHealth } from "../lib/api"

interface Props {
  open: boolean
  onClose: () => void
}

export function SettingsDrawer({ open, onClose }: Props) {
  const { apiKey, setApiKey, mockMode, toggleMockMode } = useStore()
  const [draft, setDraft] = useState(apiKey)
  const [testResult, setTestResult] = useState<"ok" | "fail" | null>(null)
  const [testing, setTesting] = useState(false)

  async function handleTest() {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await checkHealth()
      setTestResult(res.status === "ok" ? "ok" : "fail")
    } catch {
      setTestResult("fail")
    } finally {
      setTesting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-80 h-full shadow-xl p-6 flex flex-col gap-6">
        <h2 className="text-base font-semibold text-gray-900">Settings</h2>

        <div>
          <label className="block text-sm text-gray-600 mb-1">API Key</label>
          <input
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Enter your X-API-Key"
          />
          <div className="flex gap-2 mt-2">
            <button
              className="flex-1 text-sm bg-indigo-600 text-white rounded px-3 py-1.5 hover:bg-indigo-700"
              onClick={() => { setApiKey(draft); setTestResult(null) }}
            >
              Save
            </button>
            <button
              className="flex-1 text-sm border border-gray-200 rounded px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              onClick={handleTest}
              disabled={testing || !draft}
            >
              {testing ? "Testing…" : "Test connection"}
            </button>
          </div>
          {testResult === "ok" && (
            <p className="flex items-center gap-1 text-sm text-green-600 mt-2"><CheckCircle size={14} /> Connected</p>
          )}
          {testResult === "fail" && (
            <p className="flex items-center gap-1 text-sm text-red-500 mt-2"><XCircle size={14} /> Invalid key or API unreachable</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Mock mode</p>
            <p className="text-xs text-gray-400">Use fixture data (no API needed)</p>
          </div>
          <button
            onClick={toggleMockMode}
            className={`w-11 h-6 rounded-full transition-colors ${mockMode ? "bg-yellow-400" : "bg-gray-200"}`}
          >
            <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${mockMode ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
