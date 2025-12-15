import { Outlet } from 'react-router-dom'
import { Header } from './header'
import { Footer } from './footer'

/**
 * Main layout component with sidebar and header
 * Wraps all authenticated routes
 */
export function MainLayout() {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 bg-background p-6 overflow-hidden">
          <Outlet />
        </main>
        <Footer/>
      </div>
    </div>
  )
}
