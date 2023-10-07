import React from 'react'
import ReactDOM from 'react-dom/client'
import { UserProvider } from './contexts/UserContext.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx'
import App from './App.tsx'
import './index.css'
import { DOMProvider } from './contexts/DOMContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <UserProvider>
        <DOMProvider>
          <App />
        </DOMProvider>
      </UserProvider>
    </LanguageProvider>
  </React.StrictMode>,
)