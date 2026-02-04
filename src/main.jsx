import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { SettingsProvider } from './contexts/SettingsContext.jsx'
import { FriendsProvider } from './contexts/FriendsContext.jsx'
import { AchievementProvider } from './contexts/AchievementContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <FriendsProvider>
          <AchievementProvider>
            <App />
          </AchievementProvider>
        </FriendsProvider>
      </SettingsProvider>
    </AuthProvider>
  </StrictMode>,
)