import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Admin from './Admin.jsx'
import Splash from './Splash.jsx'

const esPanelAdmin = new URLSearchParams(window.location.search).has('admin')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Splash>{esPanelAdmin ? <Admin /> : <App />}</Splash>
  </StrictMode>,
)
