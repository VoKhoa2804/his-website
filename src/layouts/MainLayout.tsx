import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Header } from './header'

/**
 * Main layout component with sidebar and header
 * Wraps all authenticated routes
 */
export function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
