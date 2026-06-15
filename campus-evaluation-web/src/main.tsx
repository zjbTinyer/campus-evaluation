import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { StudentProvider } from './contexts/StudentContext'
import { NotificationProvider } from './contexts/NotificationContext'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StudentProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </StudentProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
