import { toast } from "sonner"
import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"
import { login as loginRequest, logout as logoutRequest } from "@/api/auth"

// The access & refresh tokens live in HTTP-only cookies that JavaScript cannot
// read. We keep only the non-sensitive username/role in localStorage so the UI
// can show who is logged in across reloads; the cookies are the real credential.
const USERNAME_KEY = "panchangam.username"
const ROLE_KEY = "panchangam.role"

type AuthContextValue = {
  username: string | null
  role: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem(USERNAME_KEY)
  )
  const [role, setRole] = useState<string | null>(() =>
    localStorage.getItem(ROLE_KEY)
  )

  async function login(loginUsername: string, password: string) {
    const user = await loginRequest(loginUsername, password)
    localStorage.setItem(USERNAME_KEY, user.username)
    localStorage.setItem(ROLE_KEY, user.role)
    setUsername(user.username)
    setRole(user.role)
    toast.success(`Logged in as ${user.username}`)
  }

  async function logout() {
    try {
      await logoutRequest()
    } finally {
      localStorage.removeItem(USERNAME_KEY)
      localStorage.removeItem(ROLE_KEY)
      setUsername(null)
      setRole(null)
      toast.success("Logged out")
    }
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
