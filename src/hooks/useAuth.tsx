import { toast } from "sonner"
import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"
import { login as loginRequest } from "@/api/auth"

const ACCESS_TOKEN_KEY = "panchangam.access_token"
const REFRESH_TOKEN_KEY = "panchangam.refresh_token"
const USERNAME_KEY = "panchangam.username"
const ROLE_KEY = "panchangam.role"

type AuthContextValue = {
  username: string | null
  role: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function decodeRole(accessToken: string): string | null {
  try {
    const payload = accessToken.split(".")[1]
    const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
    return typeof claims.role === "string" ? claims.role : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem(USERNAME_KEY)
  )
  const [role, setRole] = useState<string | null>(() =>
    localStorage.getItem(ROLE_KEY)
  )

  async function login(loginUsername: string, password: string) {
    const tokens = await loginRequest(loginUsername, password)
    const loginRole = decodeRole(tokens.access_token)
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token)
    localStorage.setItem(USERNAME_KEY, loginUsername)
    if (loginRole) {
      localStorage.setItem(ROLE_KEY, loginRole)
    } else {
      localStorage.removeItem(ROLE_KEY)
    }
    setUsername(loginUsername)
    setRole(loginRole)
    toast.success(`Logged in as ${loginUsername}`)
  }

  function logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USERNAME_KEY)
    localStorage.removeItem(ROLE_KEY)
    setUsername(null)
    setRole(null)
    toast.success("Logged out")
  }

  return (
    <AuthContext.Provider
      value={{ username, role, isAuthenticated: username !== null, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}
