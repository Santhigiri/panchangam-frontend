import { loginResponse } from "./schemas/auth"
import type { LoginResponse } from "./schemas/auth"

const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Incorrect username or password")
    this.name = "InvalidCredentialsError"
  }
}

export async function login(username: string, password: string) {
  const response = await fetch(`${APP_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({ username, password }),
    // Needed so the browser stores the HTTP-only auth cookies the server sets.
    credentials: "include",
  })

  if (response.status === 401) {
    throw new InvalidCredentialsError()
  }

  if (!response.ok) {
    throw new Error("Failed to log in")
  }

  const json = await response.json()
  return loginResponse.parseAsync(json)
}

export async function logout() {
  // Clears the HTTP-only auth cookies server-side.
  await fetch(`${APP_BASE_URL}/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
  })
}

// A 401 here is an expected outcome (no/expired access token), not an error
// condition, so it's reported via a null return rather than a throw.
export async function getCurrentUser(): Promise<LoginResponse | null> {
  const response = await fetch(`${APP_BASE_URL}/api/v1/auth/me`, {
    headers: { Accept: "application/json" },
    credentials: "include",
  })

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    throw new Error("Failed to fetch current user")
  }

  const json = await response.json()
  return loginResponse.parseAsync(json)
}

// Exchanges the refresh-token cookie for a fresh access + refresh pair.
export async function refreshSession(): Promise<boolean> {
  const response = await fetch(`${APP_BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
  return response.status === 204
}
