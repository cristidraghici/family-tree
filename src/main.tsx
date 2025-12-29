import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import { PersonProvider } from './contexts/PersonContext'

import './styles/global.scss'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PersonProvider>
        <App />
      </PersonProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
