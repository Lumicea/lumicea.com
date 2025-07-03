import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CookieConsent } from './components/ui/cookie-consent.tsx'
import { AuthProvider } from './lib/auth.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <CookieConsent />
    </AuthProvider>
  </React.StrictMode>,
)