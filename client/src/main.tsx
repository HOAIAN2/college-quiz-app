import React from 'react'
import ReactDOM from 'react-dom/client'
import { UserProvider } from './contexts/UserContext.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx'
import App from './App.tsx'
import './index.css'
import { SideBarProvider } from './contexts/SideBarContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <UserProvider>
        <SideBarProvider>
          <App />
        </SideBarProvider>
      </UserProvider>
    </LanguageProvider>
  </React.StrictMode>,
)