import { createContext, useState, useCallback } from 'react'

interface AuthState {
  token: string | null
  parentId: number | null
  phone: string | null
}

export const AuthContext = createContext<{
  auth: AuthState
  login: (token: string, parentId: number, phone: string) => void
  logout: () => void
  isAuthenticated: boolean
} | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem('token')
    const parentId = localStorage.getItem('parentId')
    const phone = localStorage.getItem('phone')
    return {
      token: token || null,
      parentId: parentId ? Number(parentId) : null,
      phone: phone || null,
    }
  })

  const login = useCallback((token: string, parentId: number, phone: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('parentId', String(parentId))
    localStorage.setItem('phone', phone)
    setAuth({ token, parentId, phone })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('parentId')
    localStorage.removeItem('phone')
    setAuth({ token: null, parentId: null, phone: null })
  }, [])

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, isAuthenticated: !!auth.token }}
    >
      {children}
    </AuthContext.Provider>
  )
}
