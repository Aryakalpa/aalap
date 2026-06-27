import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import LoadingState from './components/ui/LoadingState'
import { APP_VERSION } from './constants/app'


const Home = lazy(() => import('./pages/Home'))
const Trending = lazy(() => import('./pages/Trending'))
const Settings = lazy(() => import('./pages/Settings'))
const Write = lazy(() => import('./pages/Write'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Profile = lazy(() => import('./pages/Profile'))
const Reader = lazy(() => import('./pages/Reader'))
const Search = lazy(() => import('./pages/Search'))


export default function App() {
    // Force refresh for mobile users on new version
    useEffect(() => {
        if (localStorage.getItem('aalap_version') !== APP_VERSION) {
            localStorage.setItem('aalap_version', APP_VERSION)
            window.location.reload()
        }
    }, [])

    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Layout>
                        <Suspense fallback={<LoadingState padding="10rem" />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/trending" element={<Trending />} />
                            <Route path="/write" element={<Write />} />
                            <Route path="/write/:id" element={<Write />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/profile/:id" element={<Profile />} />
                            <Route path="/post/:id" element={<Reader />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/login" element={<Home />} />
                        </Routes>
                        </Suspense>
                    </Layout>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    )
}
