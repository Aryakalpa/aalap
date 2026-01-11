import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Trending from './pages/Trending'
import Write from './pages/Write'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import Reader from './pages/Reader'
import Search from './pages/Search'
import { useEffect } from 'react'

export default function App() {
    // Force refresh for mobile users on new version
    useEffect(() => {
        const APP_VERSION = 'v1.0.5'; // Increment this to force a mobile refresh
        if (localStorage.getItem('aalap_version') !== APP_VERSION) {
            localStorage.setItem('aalap_version', APP_VERSION);
            // Wait a tiny bit and reload
            window.location.reload(true);
        }
    }, [])

    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/trending" element={<Trending />} />
                            <Route path="/write" element={<Write />} />
                            <Route path="/write/:id" element={<Write />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/profile/:id" element={<Profile />} />
                            <Route path="/post/:id" element={<Reader />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/login" element={<Home />} />
                        </Routes>
                    </Layout>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    )
}
