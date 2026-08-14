import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'

export default function ControlPanelLayout() {
  return (
    <div className="flex min-h-screen flex-col min-[501px]:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  )
}
