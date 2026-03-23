# ⚡ Quick Commands Reference

Copy & paste these commands to get Aura AI running!

## 🔧 Terminal 1: Backend

```bash
python -m src.main
```

Expected: `INFO:     Uvicorn running on http://0.0.0.0:8000`

## 🎨 Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev
```

Expected: `➜  Local:   http://localhost:5173/`

## 🌐 Open Dashboard

http://localhost:5173

## 🧪 Test Event (Terminal 3)

```bash
curl -X POST http://localhost:8000/api/test/trigger-pipeline-failure
```

Watch the dashboard update in real-time!

## 📚 Documentation Files

- `SETUP_FRONTEND.md` - Detailed frontend setup guide (READ THIS FIRST!)
- `FRONTEND_GUIDE.md` - Complete feature breakdown
- `frontend/README.md` - Frontend development guide
- `README.md` - Main project documentation
- `SETUP.md` - Backend configuration guide

## 🎯 Common Tasks

### Start Everything
```bash
# Terminal 1
python -m src.main

# Terminal 2
cd frontend && npm install && npm run dev

# Open http://localhost:5173
```

### Check Backend Health
```bash
curl http://localhost:8000/health
```

### Build Frontend for Production
```bash
cd frontend
npm run build
# Output in: frontend/dist/
```

### View Agent Status
```bash
curl -X POST http://localhost:8000/api/agents/status
```

### Lint Frontend Code
```bash
cd frontend
npm run lint
```

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8000 in use | `lsof -i :8000` (Mac/Linux) or `netstat -ano \| grep :8000` (Windows) |
| Port 5173 in use | `npm run dev -- --port 3000` |
| npm not found | Install Node.js from https://nodejs.org |
| Backend won't start | Check `.env` file and verify Python 3.9+ |
| Dashboard shows "Offline" | Ensure backend is running on :8000 |

---

**That's all you need to know!** 🚀

For more details, see `SETUP_FRONTEND.md`
