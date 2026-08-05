import { toast } from "sonner"
import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  refreshSession,
} from "@/api/auth"

// The access & refresh tokens live in HTTP-only cookies that JavaScript cannot
// read. We keep only the non-sensitive username/role in localStorage so the UI
// can show who is logged in across reloads; the cookies are the real credential.
const USERNAME_KEY = "panchangam.username"
const ROLE_KEY = "panchangam.role"

type AuthStatus = "verifying" | "authenticated" | "unauthenticated"

type AuthContextValue = {
  username: string | null
  role: string | null
  isAuthenticated: boolean
  isVerifying: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // A cached username only means we *might* still have a valid session — the
  // access token cookie it was set alongside may have expired since. So the
  // cache is used only to decide whether it's worth verifying, never to
  // render admin UI directly: username/role start null and are only trusted
  // once the server confirms them (see the effect below).
  const [status, setStatus] = useState<AuthStatus>(() =>
    localStorage.getItem(USERNAME_KEY) ? "verifying" : "unauthenticated"
  )
  const [username, setUsername] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    if (status !== "verifying") return

    let cancelled = false

    async function verify() {
      let user = await getCurrentUser()
      if (!user && (await refreshSession())) {
        user = await getCurrentUser()
      }
      if (cancelled) return

      if (user) {
        localStorage.setItem(USERNAME_KEY, user.username)
        localStorage.setItem(ROLE_KEY, user.role)
        setUsername(user.username)
        setRole(user.role)
        setStatus("authenticated")
      } else {
        localStorage.removeItem(USERNAME_KEY)
        localStorage.removeItem(ROLE_KEY)
        // Best-effort cookie cleanup; safe to call without a valid session.
        logoutRequest().catch(() => {})
        setStatus("unauthenticated")
      }
    }

    verify()
    return () => {
      cancelled = true
    }
  }, [status])

  async function login(loginUsername: string, password: string) {
    const user = await loginRequest(loginUsername, password)
    localStorage.setItem(USERNAME_KEY, user.username)
    localStorage.setItem(ROLE_KEY, user.role)
    setUsername(user.username)
    setRole(user.role)
    setStatus("authenticated")
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
      setStatus("unauthenticated")
      toast.success("Logged out")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        username,
        role,
        isAuthenticated: status === "authenticated",
        isVerifying: status === "verifying",
        login,
        logout,
      }}
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
