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

export default function App() {
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
