import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import { PersonContextProvider } from './contexts/person/PersonContextProvider'

import './styles/global.scss'
import { BrowserRouter } from 'react-router-dom'
import GitHubPages from '@/utils/GitHubPages'

GitHubPages.restore()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <PersonContextProvider>
        <App />
      </PersonContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
