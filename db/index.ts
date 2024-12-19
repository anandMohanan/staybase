import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { user, organization, session, account, verification, member, invitation } from './schema/user';


const client = postgres(process.env.DATABASE_URL!);
export const UserSchema = {
    user,organization,session,account,verification,member,invitation
}
export const db = drizzle({ client });

