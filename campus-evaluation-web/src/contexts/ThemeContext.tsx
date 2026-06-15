import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export type Theme = 'scholarly' | 'vibrant' | 'journal'

const STORAGE_KEY = 'campus-eval-theme'

export const ThemeContext = createContext<{
  theme: Theme
  setTheme: (t: Theme) => void
} | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const t = (stored === 'scholarly' || stored === 'vibrant' || stored === 'journal') ? stored : 'scholarly'
    // 立刻设 data-theme，不在 useEffect 里等 — 避免首帧闪烁
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem(STORAGE_KEY, t)
    return t
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
