import { LayoutDashboard, History, LineChart, Settings } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

export const Sidebar = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(true)

  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Events', href: '/events', icon: History },
    { label: 'Analytics', href: '/analytics', icon: LineChart },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <aside
      className={cn(
        'border-r border-border bg-card transition-all duration-200',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      <nav className="space-y-2 p-4">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              title={!isOpen ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse button */}
      <div className="border-t border-border p-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full rounded-lg p-2 text-muted-foreground hover:bg-muted"
          title={isOpen ? 'Collapse' : 'Expand'}
        >
          {isOpen ? '←' : '→'}
        </button>
      </div>
    </aside>
  )
}
