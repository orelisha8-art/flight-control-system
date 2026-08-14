import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const links = [
  { to: '/controlpanel', label: 'כל הטיסות', end: true },
  { to: '/controlpanel/sort', label: 'מיון טיסות' },
  { to: '/controlpanel/add', label: 'הוסף טיסה' },
  { to: '/controlpanel/delete', label: 'מחק טיסה' },
]

export default function Sidebar() {
  return (
    <nav
      className="flex w-full shrink-0 flex-row gap-2 overflow-x-auto border-b bg-card p-3
        max-[500px]:flex-row
        min-[501px]:w-56 min-[501px]:flex-col min-[501px]:border-b-0 min-[501px]:border-l min-[501px]:h-screen min-[501px]:sticky min-[501px]:top-0"
    >
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            cn(
              'shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground/80 hover:bg-accent hover:text-accent-foreground'
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
