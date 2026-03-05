import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(() => {
        const saved = localStorage.getItem('design-editor-theme');
        return saved || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('design-editor-theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    const setTheme = useCallback((t) => setThemeState(t), []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}
