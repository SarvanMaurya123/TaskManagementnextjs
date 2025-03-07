

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Middleware function to protect routes
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define public routes
    const isPublicPath = [
        '/login',
        '/signup',
        '/forgetpassemail',
        '/admin/signup',
        '/admin/login',
    ].includes(path) || path.startsWith('/reset-password');

    // Get the token from cookies
    const token = request.cookies.get('token')?.value;

    // Allow access to public routes
    if (isPublicPath) {
        return NextResponse.next();
    }

    // Redirect to login if no token is found
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    let decodedToken: any;
    try {
        // Verify the token using jose
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) throw new Error("SECRET_KEY is not defined");

        const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey));
        decodedToken = payload;
    } catch (error) {
        console.error("Token verification failed:", error);
        // Redirect to login if token is invalid
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Role-based access control
    const isAdminPath = path.startsWith('/admin') && !isPublicPath;
    const isTeamLeaderPath = path.startsWith('/admin/teamleader');

    // Check access based on user role
    if (isAdminPath) {
        if (decodedToken?.role === 'admin') {
            return NextResponse.next(); // Allow access to admin paths
        }

        if (decodedToken?.role === 'TeamLeader') {
            if (isTeamLeaderPath) {
                return NextResponse.next(); // Allow access to TeamLeader paths
            } else {
                // Redirect TeamLeader if trying to access non-TeamLeader admin paths
                return NextResponse.redirect(new URL('/admin/teamleader/pages/dashboard', request.nextUrl));
            }
        }

        // Redirect unauthorized roles trying to access admin paths
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    // If no specific rules matched, allow the request to proceed
    return NextResponse.next();
}

// Matcher to define which routes are protected
export const config = {
    matcher: [
        '/((?!api|_next/static|favicon.ico).*)',
    ],
};