import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const links = [
  { to: '/controlpanel', label: 'כל הטיסות', icon: '🛫', end: true },
  { to: '/controlpanel/sort', label: 'מיון טיסות', icon: '🔍' },
  { to: '/controlpanel/add', label: 'הוסף טיסה', icon: '➕' },
  { to: '/controlpanel/delete', label: 'מחק טיסה', icon: '💀' },
]

export default function Sidebar() {
  return (
    <nav
      className="flex w-full shrink-0 flex-row gap-2 overflow-x-auto border-b-2 border-ink bg-sidebar p-3
        max-[500px]:flex-row
        min-[501px]:w-56 min-[501px]:flex-col min-[501px]:border-b-0 min-[501px]:border-r-2 min-[501px]:h-screen min-[501px]:sticky min-[501px]:top-0"
    >
      <p className="hidden px-2 pb-2 font-heading text-2xl text-primary min-[501px]:block">
        👻 בקרה
      </p>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            cn(
              'flex shrink-0 items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-bold whitespace-nowrap transition-all',
              isActive
                ? 'border-ink bg-primary text-primary-foreground shadow-[3px_3px_0_0_var(--ink)]'
                : 'border-transparent text-sidebar-foreground/80 hover:border-ink hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )
          }
        >
          <span aria-hidden>{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
