import { Button } from "@/shared/ui/button"
import { Home, Settings, Users, BarChart3, LogOut, Hospital } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-64 border-r bg-muted/50">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-xl font-bold">HIS System</h2>
        </div>
        <nav className="flex-1 space-y-2 px-3">
          <Button 
            variant={isActive('/') ? "secondary" : "ghost"} 
            className="w-full justify-start gap-3"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            Ca làm việc
          </Button>
          <Button 
            variant={isActive('/phong-kham') ? "secondary" : "ghost"} 
            className="w-full justify-start gap-3"
            onClick={() => navigate('/phong-kham')}
          >
            <Hospital className="h-4 w-4" />
            Phòng khám
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Users className="h-4 w-4" />
            Users
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </nav>
        <div className="p-3">
          <Button variant="outline" className="w-full justify-start gap-3">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  )
}
