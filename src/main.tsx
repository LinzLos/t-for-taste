import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@fontsource/literata/400.css'
import '@fontsource/literata/400-italic.css'
import '@fontsource/literata/700.css'
import '@fontsource/abril-fatface/400.css' // display candidates, behind ?display=
import '@fontsource/bevan/400.css'
import '@fontsource/courier-prime/400.css'
import '@fontsource/courier-prime/700.css'
import '@fontsource/fredoka/400.css'
import '@fontsource/fredoka/600.css'
import '@fontsource/fredoka/700.css'
import '@fontsource/monofett/400.css'
import './chassis/chassis.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
