# 🚀 Quick Reference Guide

## Frontend Quick Start (Windows)

```powershell
cd d:\my project\aura-ai\frontend
npm install
npm run dev
```

Visit: http://localhost:5173

## Backend Quick Start (Windows)

```powershell
cd d:\my project\aura-ai
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m src.main
```

Visit: http://localhost:8000/health

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dashboard (frontend) |
| `npm run build` | Build for production |
| `npm run lint` | Check code quality |
| `python -m src.main` | Start backend |
| `pytest tests/` | Run backend tests |
| `npm run type-check` | Check TypeScript errors |

## File Locations

| What | Where |
|------|-------|
| Frontend Config | `frontend/.env` |
| Backend Config | `.env` |
| Frontend Source | `frontend/src/` |
| Backend Services | `src/agents/` |
| API Types | `frontend/src/types/api.ts` |
| API Client | `frontend/src/lib/api.ts` |
| Dashboard | `frontend/src/pages/Dashboard.tsx` |

## Debugging

### Frontend (Browser Console)
```javascript
// Check API client
console.log(apiClient)

// Check app state (Zustand)
import { useAppStore } from '@/store/appStore'
const state = useAppStore.getState()
```

### Backend (Terminal Logs)
```
Set LOG_LEVEL=DEBUG in .env
python -m src.main
```

## Integration Checklist

- [ ] Backend running on http://localhost:8000
- [ ] `npm install` completed in frontend/
- [ ] `.env` file configured with VITE_API_URL
- [ ] `npm run dev` started successfully
- [ ] Dashboard loads on http://localhost:5173
- [ ] Can reach Configuration page
- [ ] Verify Connection button works
- [ ] Dashboard shows health status

## API Quick Test

```bash
# Health check
curl http://localhost:8000/health

# Dashboard data
curl http://localhost:8000/api/dashboard

# Trigger test failure
curl -X POST http://localhost:8000/api/test/trigger-pipeline-failure
```

## Browser DevTools Tips

**Check API calls:**
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by Fetch/XHR
4. Look for `/api/` requests

**Check State:**
1. Open Console
2. Type: `import { useAppStore } from '@/store/appStore'`
3. Type: `useAppStore.getState()`

## Folder Guide

```
aura-ai/
├── src/                    # Backend Python code
│   ├── main.py            # FastAPI app
│   ├── agents/            # Agent implementations
│   └── integrations/      # GitLab API client
├── frontend/              # React frontend
│   ├── src/               # Frontend source
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Frontend build config
├── tests/                 # Backend tests
├── requirements.txt       # Python dependencies
├── .env                   # Backend config
└── README.md             # Main project docs
```

## Port Assignments

| Service | Port | URL |
|---------|------|-----|
| Backend (FastAPI) | 8000 | http://localhost:8000 |
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Optional: PostgreSQL | 5432 | (if enabled) |

## Environment Setup

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_ENABLE_AUTO_REFRESH=true
VITE_REFRESH_INTERVAL=5000
```

### Backend (.env)
```env
GITLAB_URL=https://gitlab.com
GITLAB_TOKEN=glpat-xxx
GITLAB_WEBHOOK_SECRET=secret
OPENAI_API_KEY=sk-xxx
LOG_LEVEL=INFO
```

## Useful Links

- **Frontend README:** `frontend/README.md`
- **Integration Guide:** `frontend/INTEGRATION.md`
- **Backend README:** `README.md`
- **Setup Guide:** `SETUP.md`

## Troubleshooting Checklist

| Issue | Fix |
|-------|-----|
| Port 5173 in use | `npm run dev -- --port 3000` |
| Port 8000 in use | Change in backend config or kill process |
| API not responding | Check backend is running |
| CORS errors | Check VITE_API_URL matches backend |
| npm install fails | `rm -rf node_modules` then `npm install` |
| TypeScript errors | `npm run type-check` |
| Page won't load | Check browser DevTools > Console tab |

---

**Save this guide for quick reference!**
