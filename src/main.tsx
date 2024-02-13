import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import { PersonProvider } from './contexts/PersonContext'

import './styles/global.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersonProvider>
      <App />
    </PersonProvider>
  </React.StrictMode>,
)
