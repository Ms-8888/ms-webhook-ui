# ms-webhook-ui

Real-time dashboard for monitoring webhook delivery status and failures. Connects to [ms-webhook-api](https://github.com/Ms-8888/ms-webhook-api) — works standalone in mock mode with no backend required.

**[Live demo →](https://ms-8888.github.io/ms-webhook-ui/)**  
To connect your own backend, run ms-webhook-api locally and paste the API key it prints into Settings.

---

## Quick Start

```bash
git clone https://github.com/Ms-8888/ms-webhook-ui
cd ms-webhook-ui
npm install
npm run dev
```

Opens at `http://localhost:5173` in **mock mode** by default — no backend needed. Realistic sample data loads immediately.

---

## Pages

| Page | What it shows |
|------|--------------|
| **Overview** | 4 stat cards (events today, success rate, queue depth, failures) + 24h delivery rate chart |
| **Endpoints** | Register and manage webhook URLs, inline delete confirmation |
| **Events** | Paginated event log — click any row to see per-endpoint delivery breakdown with retry history |

---

## Connect to the real API

1. Run `ms-webhook-api` (see its README Quick Start) and seed a tenant to get an API key
2. Click the **Settings** gear → enter your API key → **Test connection**
3. Toggle **Mock Mode** off in Settings

Or set in `.env`:
```
VITE_API_URL=http://localhost:8000
VITE_MOCK=false
```

---

## Stack

React 18 · Vite · TypeScript · Tailwind CSS · TanStack Query · Zustand · Recharts · React Router v6
