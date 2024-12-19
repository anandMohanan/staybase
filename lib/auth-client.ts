import { createAuthClient } from "better-auth/react"
import { usernameClient, organizationClient } from "better-auth/client/plugins"

export const authClient   = createAuthClient({
    plugins: [
        usernameClient(),
        organizationClient()
    ],
    baseURL: process.env.BETTER_AUTH_URL,
})
