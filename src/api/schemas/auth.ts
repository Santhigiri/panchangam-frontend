import { z } from "zod"

export const tokenResponse = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
})

export type TokenResponse = z.infer<typeof tokenResponse>
