# 🎨 Aura AI Dashboard - Frontend

A beautiful React + TypeScript + TailwindCSS dashboard for monitoring and managing the Aura AI autonomous agent system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (check with `node --version`)
- npm or yarn

### 1️⃣ Install Dependencies

```bash
cd frontend
npm install
```

### 2️⃣ Start Development Server

```bash
npm run dev
```

The dashboard will open at `http://localhost:5173` and automatically proxy API requests to the backend at `http://localhost:8000`.

### 3️⃣ Access the Dashboard

- **Dashboard**: http://localhost:5173 (main monitoring view)
- **Events**: http://localhost:5173/events (event log)
- **Analytics**: http://localhost:5173/analytics (charts and metrics)
- **Settings**: http://localhost:5173/settings (configuration)

## 📋 Features

### Dashboard Page
- **Real-time Agent Status** - See all agents and their activity
- **Recent Pipeline Failures** - Latest failures with diagnosis
- **Quick Stats** - Key metrics at a glance
- **Latest Decision** - Most recent agent decision with confidence score

### Events Log
- **Searchable Table** - Browse all events with filtering
- **Status Indicators** - Visual status badges
- **Timestamps** - Relative time display (e.g., "5 minutes ago")

### Analytics
- **Failures Over Time** - Line chart showing failure trends
- **Error Distribution** - Pie chart of error types
- **MTTR Trend** - Mean Time To Recovery improvement over time

### Architecture

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.ts        # Axios HTTP client
│   │   └── hooks.ts         # React Query hooks
│   ├── components/
│   │   ├── layout/          # Header, Sidebar, Layout
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── shared/          # Reusable UI components
│   │   └── ui/              # Base UI components
│   ├── pages/              # Full page components
│   ├── types/              # TypeScript interfaces
│   ├── lib/                # Utilities
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # React entry point
│   └── index.css           # TailwindCSS styles
├── index.html              # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool (ultra-fast dev server) |
| **TailwindCSS** | Styling |
| **React Router v6** | Navigation |
| **@tanstack/react-query** | Data fetching & caching |
| **Axios** | HTTP client |
| **Recharts** | Charts & visualizations |
| **Lucide React** | Icons |
| **date-fns** | Date formatting |

## 🔌 API Integration

The dashboard connects to the backend at `http://localhost:8000` (configurable via `VITE_API_URL`).

### Key Endpoints Used:
- `GET /health` - Server health check
- `POST /api/agents/status` - Agent status
- `POST /api/test/trigger-pipeline-failure` - Simulate test event

**Note:** Backend must have CORS enabled (added in backend `src/main.py`)

## 🎨 Design System

### Color Scheme
- **Primary**: Indigo (main actions and branding)
- **Success**: Green (successful operations)
- **Warning**: Amber (pending/processing states)
- **Danger**: Red (failures and errors)
- **Background**: Light mode and dark mode support

### Components
All components use TailwindCSS utilities for consistency:
- Card components for content grouping
- Status badges with color coding
- Confidence score bars for reliability indication
- Loading spinners for async states
- Responsive grid layouts for mobile/desktop

## 📱 Responsive Design

- Mobile-first approach
- Desktop-optimized for wide monitoring dashboards
- Collapsible sidebar on mobile devices
- Adaptive grid layouts

## 🔄 Real-time Updates

The dashboard polls the backend every 3-5 seconds for:
- Agent status
- Recent pipeline failures
- Latest metrics

**Future Enhancement:** WebSocket support for true push updates (currently using polling for simplicity).

## 🐛 Development

### Scripts

```bash
# Development server with fast refresh
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint TypeScript
npm run lint
```

### Adding New Features

1. **New Page**: Create file in `src/pages/`, add route to `App.tsx`
2. **New Component**: Create in `src/components/`, import and use
3. **New API Hook**: Add to `src/api/hooks.ts`, use `useQuery` pattern
4. **Styling**: Use TailwindCSS classes with responsive prefixes (`md:`, `lg:`)

### Example: Adding a New Page

```tsx
// src/pages/NewPage.tsx
export const NewPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">New Page</h1>
      {/* Content here */}
    </div>
  )
}

// Add to App.tsx routes
<Route path="/newpage" element={<NewPage />} />

// Add to Sidebar.tsx navigation
{ label: 'New Page', href: '/newpage', icon: SomeIcon }
```

## 🚀 Deployment

### Development
```bash
npm run dev  # Runs on http://localhost:5173
```

### Production Build
```bash
npm run build  # Creates 'dist' folder
npm run preview  # Test production build locally
```

Deploy the `dist` folder to any static host:
- Vercel
- Netlify
- GitHub Pages
- Docker container
- AWS S3 + CloudFront
- Any web server (nginx, Apache)

### Docker Deployment (Example)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔗 Environment Variables

Create `.env` file (copy from `.env.example`):

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Polling interval (milliseconds)
VITE_POLLING_INTERVAL=3000

# Environment
VITE_ENV=development
```

## 🐛 Troubleshooting

### Dashboard shows "Offline"
- Ensure backend is running on `http://localhost:8000`
- Check `VITE_API_URL` in `.env` file
- Verify CORS is enabled in backend

### Pages not loading
- Check browser console (F12) for errors
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server (`npm run dev`)

### Styles look broken
- Verify TailwindCSS is imported in `src/index.css`
- Check `tailwind.config.js` content paths
- Rebuild: stop and restart `npm run dev`

### API calls failing
- Verify backend is running and accessibility on `localhost:8000`
- Check backend logs for CORS errors
- Test backend with: `curl http://localhost:8000/health`

## 📚 Documentation

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org)
- [React Query Docs](https://tanstack.com/query/latest)

## 🎯 Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Dark/Light theme toggle
- [ ] Customizable dashboard widgets
- [ ] Export event logs to CSV
- [ ] User authentication
- [ ] Search and filtering in event logs
- [ ] Detailed event modal with full diagnosis
- [ ] Email/Slack notifications
- [ ] Agent configuration UI
- [ ] Custom dashboard layouts

## 📝 License

Same as Aura AI project (MIT).

---

**Made with ❤️ for DevOps Engineers**
Questions? Check the main [README.md](../README.md) or open an issue!
