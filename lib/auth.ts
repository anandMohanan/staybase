import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, UserSchema } from "../db";
import { organization, username } from "better-auth/plugins";
import { user } from "@/db/schema/user";

export const auth = betterAuth({
    plugins: [
        username(),
        organization()
    ],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: UserSchema 

    }),
    emailAndPassword: {
        enabled: true,
    }
});
