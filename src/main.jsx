import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import Patients from './pages/Patients.jsx'
import { PatientStoreProvider } from './store/PatientStore.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <PatientStoreProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/patients" element={<Patients />} />
          </Routes>
        </HashRouter>
      </PatientStoreProvider>
    </ErrorBoundary>
  </StrictMode>,
)
