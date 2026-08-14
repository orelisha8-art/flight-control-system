import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const CORRECT_PASSWORD = '12345'
const STORAGE_KEY = 'atc-authenticated'

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === 'true'
  )

  function login(password) {
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
