export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 border-t border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Copyright */}
          <div className="flex items-center gap-6">
            <p className="text-sm">
              © {new Date().getFullYear()} Bệnh Viện Chợ Rẫy. All rights reserved.
            </p>
            <span className="text-xs text-gray-500">Version 1.0.0</span>
          </div>

          {/* Right Section - Links */}
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-sm hover:text-white transition-colors"
            >
              Hỗ trợ
            </a>
            <a 
              href="#" 
              className="text-sm hover:text-white transition-colors"
            >
              Điều khoản sử dụng
            </a>
            <a 
              href="#" 
              className="text-sm hover:text-white transition-colors"
            >
              Chính sách bảo mật
            </a>
            <a 
              href="#" 
              className="text-sm hover:text-white transition-colors"
            >
              Liên hệ
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
