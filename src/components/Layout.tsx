import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { Activity, Link, Settings, Zap } from "lucide-react"
import { useStore } from "../store"
import { SettingsDrawer } from "./SettingsDrawer"

const nav = [
  { to: "/", label: "Overview", icon: Activity },
  { to: "/endpoints", label: "Endpoints", icon: Link },
  { to: "/events", label: "Events", icon: Zap },
]

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { mockMode, apiKey } = useStore()

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-52 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-4 py-5 border-b border-gray-100">
          <p className="font-semibold text-gray-900 text-sm">Webhook API</p>
          {mockMode && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded mt-1 inline-block">MOCK MODE</span>
          )}
        </div>
        <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                  isActive ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-5 py-4 text-sm text-gray-500 hover:text-gray-700 border-t border-gray-100"
        >
          <Settings size={15} /> Settings
        </button>
      </aside>

      <main className="flex-1 overflow-auto">
        {!mockMode && !apiKey ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <Zap size={40} className="text-indigo-400 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Connect your API</h2>
            <p className="text-sm text-gray-500 mb-4 max-w-xs">
              Open Settings and enter your API key, or enable Mock Mode to explore with sample data.
            </p>
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Open Settings
            </button>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <SettingsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
