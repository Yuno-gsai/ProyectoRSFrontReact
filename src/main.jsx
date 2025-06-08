import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './Contex/AuthProvaider'
import { App } from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)


//TODO:  Cambiar todos los metdos a post tanto en el fornt como en el back 