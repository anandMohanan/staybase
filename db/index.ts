import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { user, session, account, verification } from "./schema/user";
import { invitation, member, organization } from "./schema/organization";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

const client = postgres(process.env.DATABASE_URL);

export const UserSchema = {
	user,
	organization,
	session,
	account,
	verification,
	member,
	invitation,
};

export const db = drizzle({ client });
