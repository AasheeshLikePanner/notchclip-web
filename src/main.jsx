import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#ffffff',
          color: '#18181b',
          borderRadius: '14px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          fontSize: '14px',
        },
        error: {
          iconTheme: {
            primary: '#18181b',
            secondary: '#ffffff',
          },
        },
      }}
    />
  </React.StrictMode>,
)

