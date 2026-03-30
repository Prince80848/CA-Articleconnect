import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import { store } from './redux/store'
import ScrollToTop from './components/ScrollToTop'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <BrowserRouter>
                    <ScrollToTop />
                    <App />
                    <Toaster position="top-right" toastOptions={{
                    style: { background: '#fff', color: '#374151', border: '1px solid #e5e7eb', fontSize: '14px' },
                    success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
                }} />
                </BrowserRouter>
            </GoogleOAuthProvider>
        </Provider>
    </React.StrictMode>
)
