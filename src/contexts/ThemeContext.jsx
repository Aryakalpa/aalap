import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext()
const STORAGE_KEY = 'theme'
const THEMES = ['system', 'light', 'dark']

const getSystemTheme = () => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const normalizeTheme = (value) => {
    if (THEMES.includes(value)) return value
    // Legacy cleanup: paper used to be a global app theme. Keep app UI intentional.
    return 'system'
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used within ThemeProvider')
    return context
}

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        if (typeof window === 'undefined') return 'system'
        return normalizeTheme(localStorage.getItem(STORAGE_KEY) || 'system')
    })
    const [systemTheme, setSystemTheme] = useState(getSystemTheme)

    const resolvedTheme = theme === 'system' ? systemTheme : theme

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => setSystemTheme(media.matches ? 'dark' : 'light')
        handleChange()
        media.addEventListener?.('change', handleChange)
        media.addListener?.(handleChange)
        return () => {
            media.removeEventListener?.('change', handleChange)
            media.removeListener?.(handleChange)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, theme)
        document.documentElement.setAttribute('data-theme', resolvedTheme)
        document.documentElement.style.colorScheme = resolvedTheme
    }, [theme, resolvedTheme])

    const setTheme = (nextTheme) => setThemeState(normalizeTheme(nextTheme))

    const toggleTheme = () => {
        setThemeState((prev) => {
            const current = normalizeTheme(prev)
            if (current === 'dark') return 'light'
            return 'dark'
        })
    }

    const value = useMemo(() => ({
        theme,
        themePreference: theme,
        resolvedTheme,
        systemTheme,
        setTheme,
        toggleTheme,
        themes: THEMES,
    }), [theme, resolvedTheme, systemTheme])

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}
