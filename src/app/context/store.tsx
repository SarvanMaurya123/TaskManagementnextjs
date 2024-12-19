'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    _id: string;
    username: string;
    email: string;
    isActive: boolean;
    // Add any other relevant fields from your user model
}

interface UserContextType {
    user: User | null;
    chatId: string | null; // Add chatId to the context
    loading: boolean;
    error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [chatId, setChatId] = useState<string | null>(null); // State for chatId
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Fetch user data from the backend
                const response = await fetch('/api/users/contextgetuserdata/');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUser(data);

                // Fetch the associated chat data for the user
                const chatResponse = await fetch(`/api/users/personalchat/getchatincontext/${data._id}`);
                if (!chatResponse.ok) {
                    throw new Error('Failed to fetch chat data');
                }
                const chatData = await chatResponse.json();
                setChatId(chatData); // Assuming the response includes chatId
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, chatId, loading, error }}>
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
