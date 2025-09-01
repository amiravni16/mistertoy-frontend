import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './assets/style/main.css'
import { App } from './RootCmp.jsx'

// Global axios configuration for backend connection
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:3030'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
