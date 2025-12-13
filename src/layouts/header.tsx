import { Search, Bell, HelpCircle, Globe, User, Grid3x3 } from "lucide-react"

export function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-sm">
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left Section - Logo & Hospital Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-md flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-bold text-base">CR</span>
          </div>
          <span className="font-semibold text-base whitespace-nowrap">Bệnh Viện Chợ Rẫy</span>
          <button className="p-1.5 hover:bg-blue-700 rounded transition-colors">
            <Grid3x3 className="w-5 h-5" />
          </button>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm tên màn hình"
              className="w-full bg-white text-gray-900 px-4 py-1.5 pr-24 rounded-md text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300">
                Ctrl + K
              </span>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <Search className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-3">
          <button className="p-1.5 hover:bg-blue-700 rounded transition-colors" title="Bệnh Viện Chợ Rẫy">
            <HelpCircle className="w-5 h-5" />
          </button>
          <span className="text-sm hidden lg:block">Bệnh Viện Chợ Rẫy</span>
          <button className="p-1.5 hover:bg-blue-700 rounded transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-1.5 hover:bg-blue-700 rounded transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-1.5 hover:bg-blue-700 rounded transition-colors">
            <Globe className="w-5 h-5" />
          </button>
          <button className="p-1.5 hover:bg-blue-700 rounded transition-colors">
            <User className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-blue-500">
            <span className="text-sm font-medium hidden sm:block">Võ Thiên Khoa</span>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-xs font-bold">VT</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
