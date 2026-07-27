import { tokenResponse } from "./schemas/auth"

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
  })

  if (response.status === 401) {
    throw new InvalidCredentialsError()
  }

  if (!response.ok) {
    throw new Error("Failed to log in")
  }

  const json = await response.json()
  return tokenResponse.parseAsync(json)
}
