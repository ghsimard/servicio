import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './locales/i18n'
import './index.css'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { LoggingProvider } from './contexts/LoggingContext'

const root = document.getElementById('root')

if (root) {
  createRoot(root).render(
    <StrictMode>
      <AuthProvider>
        <LoggingProvider>
          <App />
        </LoggingProvider>
      </AuthProvider>
    </StrictMode>,
  )
}
