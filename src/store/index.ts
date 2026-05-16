import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthSlice {
  apiKey: string
  setApiKey: (key: string) => void
}

interface UiSlice {
  mockMode: boolean
  toggleMockMode: () => void
  setMockMode: (val: boolean) => void
}

type Store = AuthSlice & UiSlice

export const useStore = create<Store>()(
  persist(
    (set) => ({
      apiKey: "",
      setApiKey: (key) => set({ apiKey: key }),
      mockMode: import.meta.env.VITE_MOCK !== "false",
      toggleMockMode: () => set((s) => ({ mockMode: !s.mockMode })),
      setMockMode: (val) => set({ mockMode: val }),
    }),
    { name: "ms-webhook-ui", partialize: (s) => ({ apiKey: s.apiKey, mockMode: s.mockMode }) }
  )
)
