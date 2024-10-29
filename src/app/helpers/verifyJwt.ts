// File: utils/verifyJwt.ts
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: string;
    role: string;
    // add other properties as needed, e.g., username, email
}

export function verifyJwt(token: string): JwtPayload | null {
    try {
        const secret = process.env.SECRET_KEY as string;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        return decoded;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}
