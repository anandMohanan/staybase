import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, UserSchema } from "../db";
import { organization, username } from "better-auth/plugins";
import { member, user } from "@/db/schema/user";
import { eq } from "drizzle-orm";

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
    },
    databaseHooks: {
        session: {
            create: {
                before: async (session) => {
                    const organization = await db.select().from(member).where(eq(member.userId, session.userId))
                    if (organization.length === 0) {
                        return {
                            data: {
                                ...session,
                                activeOrganizationId: null
                            }
                        }
                    }
                    return {
                        data: {
                            ...session,
                            activeOrganizationId: organization[0].organizationId
                        }
                    }
                }
            }
        }
    }
});
