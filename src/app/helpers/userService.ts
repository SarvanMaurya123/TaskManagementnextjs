// src/app/api/admin/teamleader/userService.ts

import { ObjectId } from 'mongodb';
import Users from '../models/userModule';

export async function getUserById(userId: string) {
    try {
        // Ensure userId is valid before querying
        if (!ObjectId.isValid(userId)) {
            throw new Error(`Invalid userId: ${userId}`);
        }

        // Fetch the user using the provided userId
        const user = await Users.findById(new ObjectId(userId));

        // Return a detailed error if the user is not found
        if (!user) {
            console.warn(`User not found for userId: ${userId}`);
            return { success: false, message: `User not found for userId: ${userId}` };
        }

        return { success: true, user }; // Return user object if found
    } catch (error: any) {
        console.error("Error fetching user:", error);
        return { success: false, message: "User fetch failed", error: error.message };
    }
}
