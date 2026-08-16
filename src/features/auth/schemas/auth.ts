import { z } from "zod"

// Tokens now live in HTTP-only cookies set by the server, so the login response
// carries only the (non-sensitive) current user instead of the tokens.
export const loginResponse = z.object({
  username: z.string(),
  role: z.string(),
  is_active: z.boolean(),
})

export type LoginResponse = z.infer<typeof loginResponse>
