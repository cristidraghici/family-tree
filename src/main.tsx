import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import { PersonContextProvider } from './contexts/person/PersonContextProvider'

import './styles/global.scss'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PersonContextProvider>
        <App />
      </PersonContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
