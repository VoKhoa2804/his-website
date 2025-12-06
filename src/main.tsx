import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from '@/app/routes/App'
import { store } from '@/app/store'
import { setupInterceptors } from '@/api'

// Setup API interceptors with Redux store
setupInterceptors(store.dispatch)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
