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
    // Force refresh for users on new version and recover from stale lazy chunks after deploys.
    useEffect(() => {
        if (localStorage.getItem('aalap_version') !== APP_VERSION) {
            localStorage.setItem('aalap_version', APP_VERSION)
            window.location.reload()
            return
        }

        const recoverFromChunkError = (message = '') => {
            const text = String(message)
            const isChunkError = text.includes('Failed to fetch dynamically imported module')
                || text.includes('Importing a module script failed')
                || text.includes('ChunkLoadError')
            if (!isChunkError || sessionStorage.getItem('aalap_chunk_recovered') === APP_VERSION) return
            sessionStorage.setItem('aalap_chunk_recovered', APP_VERSION)
            window.location.reload()
        }

        const onError = (event) => recoverFromChunkError(event?.message || event?.error?.message)
        const onUnhandledRejection = (event) => recoverFromChunkError(event?.reason?.message || event?.reason)
        window.addEventListener('error', onError)
        window.addEventListener('unhandledrejection', onUnhandledRejection)
        return () => {
            window.removeEventListener('error', onError)
            window.removeEventListener('unhandledrejection', onUnhandledRejection)
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
                            <Route path="/post/:id/:slug" element={<Reader />} />
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
