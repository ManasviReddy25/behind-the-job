import { createRoot } from 'react-dom/client'
import './lib/log'
import './styles.css'
import App from './App.jsx'

// No StrictMode on purpose: in development it runs effects twice, which would double every entry in the run log.
createRoot(document.getElementById('root')).render(<App />)
