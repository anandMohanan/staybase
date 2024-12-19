import { betterFetch } from "@better-fetch/fetch";
import { Session } from "better-auth/types";
import { NextRequest, NextResponse } from "next/server";


const authMiddleware = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/sign-in/') ||
        pathname.startsWith('/sign-up/') ||
        pathname.startsWith('/api/auth/')) {
        return NextResponse.next();
    }
    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin,
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        },
    );
    const isAuthPage = pathname === '/sign-in' || 
                    pathname === '/sign-up' || 
                    pathname.startsWith('/sign-in/') || 
                    pathname.startsWith('/sign-up/');
    if (isAuthPage) {
        if (session) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
    }

    if (!session) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
}
export default authMiddleware;
export const config = {
    matcher: [
        "/dashboard",
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Match API routes except public auth endpoints
        '/(api|trpc)(.*)',



    ],
};
