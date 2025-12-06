import { useState } from 'react'
import { Toaster } from '@/shared/ui/sonner'
import { LoginPage } from '@/features/auth/login'
import { HomeScreen } from '@/features/home/home'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  return (
    <>
      {isLoggedIn ? (
        <>
          <HomeScreen />
          <Toaster />
        </>
      ) : (
        <>
          <div className="flex items-center justify-center min-h-screen bg-muted/50">
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          </div>
          <Toaster />
          <button
            onClick={() => setIsLoggedIn(true)}
            className="hidden"
            id="login-btn"
          />
        </>
      )}
    </>
  )
}

export default App
