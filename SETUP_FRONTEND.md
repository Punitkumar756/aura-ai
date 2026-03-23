# 🚀 How to Run Your Beautiful Aura AI Dashboard

Everything is ready! Here's how to get it running in 3 minutes.

## ✅ Prerequisites Check

Before starting, make sure you have:
- **Node.js 18+** - Check with `node --version` (should show v18.0.0 or higher)
- **npm** - Check with `npm --version` (comes with Node.js)
- **Python 3.9+** - For the backend (should already be set up)

If you're missing Node.js, download from https://nodejs.org (LTS recommended)

## 🔧 Step 1: Install Frontend Dependencies (2 minutes)

Open a terminal and run:

```bash
cd frontend
npm install
```

This installs all the React, TypeScript, TailwindCSS, and other packages. Takes 1-2 minutes.

**Expected output:**
```
up to date, audited 150 packages in 2.5s
```

## 🖥️ Step 2: Start Backend (Terminal 1)

In one terminal window, start the backend:

```bash
python -m src.main
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

✅ Backend is running on `http://localhost:8000`

## 🎨 Step 3: Start Frontend (Terminal 2)

In a NEW terminal window, run:

```bash
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ Frontend is running on `http://localhost:5173`

## 🌐 Step 4: Open in Browser

Click this link: **http://localhost:5173**

or manually type it in your browser address bar.

You should see:
- 🎨 Beautiful Aura AI dashboard with the logo and "Agent Monitoring Dashboard"
- 📊 Quick stats showing failures, diagnosis time, success rate, active agents
- 📋 Recent pipeline failures section
- 🤖 Agent status cards on the right
- 📊 Analytics tab with charts
- 📋 Events tab with event log table

## 🧪 Step 5: Test Real-time Updates

In a 3rd terminal, trigger a test event:

```bash
curl -X POST http://localhost:8000/api/test/trigger-pipeline-failure
```

Watch the **Events** tab - a new event should appear within 2-3 seconds!

## 📍 Dashboard Navigation

The sidebar has 4 sections:

1. **Dashboard** (🏠) - Main monitoring view
   - Quick stats cards
   - Recent failures
   - Latest agent decision
   - Agent status overview

2. **Events** (📋) - Event log
   - Searchable table of all events
   - Status indicators
   - Timestamps

3. **Analytics** (📊) - Charts and metrics
   - Failures over time
   - Error type distribution
   - MTTR improvement trend

4. **Settings** (⚙️) - Configuration
   - Future settings area
   - About section

## 🎨 What You're Looking At

### Dashboard Breakdown:

**Quick Stats Top Bar** (4 metric cards):
- 🔴 Failures Today: 8
- ⏱️ Avg Diagnosis Time: 1.45s
- ✅ Success Rate: 87.5%
- 🤖 Active Agents: 1

**Recent Failures** (middle-left):
- Shows latest pipeline failures
- Color-coded by type (lint, test, import errors, etc.)
- Status badges (DIAGNOSING, MR_CREATED)
- Time since failure

**Latest Decision** (below failures):
- Most recent agent decision
- Confidence score bar
- Proposed fix

**Agent Status** (right side):
- Pipeline Guardian Agent: ACTIVE ✓
- Compliance Agent: IDLE ⏸️
- Test Orchestrator: IDLE ⏸️
- Success/error counts per agent

## 💡 Tips

### Keep terminal windows open
- You need **2 terminal windows** running continuously:
  1. Backend: `python -m src.main`
  2. Frontend: `npm run dev`

### Dashboard auto-refreshes
- Data updates every 3-5 seconds automatically
- No refresh button needed

### Mock data works offline
- If backend isn't running, dashboard shows mock data
- Great for testing UI without backend

### Fast Hot Reload
- Edit React components and see changes instantly
- No need to refresh browser

### Check for Errors
- Open browser DevTools (F12)
- Check Console tab for any errors
- Network tab shows API calls to backend

## 🐛 Troubleshooting

### "Can't connect to backend"
**Solution:** Make sure backend is running:
```bash
python -m src.main
```
Check that it shows "Uvicorn running on http://0.0.0.0:8000"

### "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org (LTS)

### "Port 8000 already in use"
**Solution:** Either:
- Kill the other process using port 8000
- Or start backend on different port: `PORT=8001 python -m src.main`

### "Port 5173 already in use"
**Solution:** Start frontend on different port: `npm run dev -- --port 3000`

### Dashboard shows "Offline" status
**Solution:** Backend isn't running. See "Can't connect to backend" above.

### Agent status cards are empty
**Solution:** Refresh page (Ctrl+R). If still empty, backend mock data should show.

## 📱 Mobile/Tablet Testing

The dashboard is fully responsive! Test on your phone:

1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 address like 192.168.x.x)
   - Mac/Linux: `ifconfig` (look for inet address)

2. Update `frontend/.env`:
   ```env
   VITE_API_URL=http://192.168.x.x:8000
   ```

3. Restart frontend: `npm run dev`

4. On phone, go to: `http://192.168.x.x:5173`

## 📝 Environment Variables

If you want to customize:

**Edit `frontend/.env`:**
```env
# Backend URL (default: localhost:8000)
VITE_API_URL=http://localhost:8000

# How often to refresh data (milliseconds)
VITE_POLLING_INTERVAL=3000

# Environment name
VITE_ENV=development
```

## 🚀 Ready to Deploy?

When you're done developing:

```bash
# Create optimized production build
npm run build

# Creates 'dist' folder with optimized files
# This can be deployed to any web server or hosting service
```

Then deploy the `dist` folder to:
- Vercel
- Netlify
- AWS S3
- Docker container
- Any web hosting

## 📚 Next Steps

1. ✅ Keep both terminal windows running
2. 🎨 Explore the dashboard
3. 🧪 Trigger test events to see real-time updates
4. 📖 Check `frontend/README.md` for detailed documentation
5. 🔧 Customize colors/layout in `frontend/tailwind.config.js` if desired

## ❓ Questions?

Check these files:
- `frontend/README.md` - Frontend detailed guide
- `FRONTEND_GUIDE.md` - Feature breakdown
- `README.md` - Main project documentation

---

### 🎉 That's it! Your dashboard is live!

You now have:
- ✅ Beautiful React dashboard
- ✅ Real-time updates
- ✅ Agent monitoring
- ✅ Event logs
- ✅ Analytics charts
- ✅ Type-safe TypeScript code
- ✅ Mobile responsive design

Enjoy your Aura AI monitoring system! 🚀
