import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/shared/ui/sonner'
import { LoginPage } from '@/features/auth/login'
import { HomeScreen } from '@/features/home/home'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { checkAuthThunk } from '@/features/auth/authSlice'
import { Spinner } from '@/shared/ui/spinner'
import { WorkShiftListPage } from '@/features/caLamViec'

function App() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  // Check for existing auth session on mount
  useEffect(() => {
    dispatch(checkAuthThunk())
  }, [dispatch])

  const handleLoginSuccess = () => {
    // Auth state is already updated by Redux, no need for manual state management
    // This callback can be used for additional side effects if needed
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/50">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <>
          <Routes>
            <Route path="/" element={<WorkShiftListPage />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </>
      ) : (
        <>
          <Routes>
            <Route path="/login" element={
              <div className="flex items-center justify-center min-h-screen bg-muted/50">
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              </div>
            } />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster />
        </>
      )}
    </BrowserRouter>
  )
}

export default App
