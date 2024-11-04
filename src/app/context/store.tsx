// src/context/UserContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    _id: string;
    username: string;
    email: string;
    isActive: boolean;
    // Include any other relevant fields from your user model
}

interface UserContextType {
    user: User | any;
    loading: boolean;
    error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/users/contextgetuserdata/');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                // console.log('Fetched User Data:', data); // Log fetched user data
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
