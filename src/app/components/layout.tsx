// app/components/Layout.jsx
'use client';
import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Header />
            <div className="flex-1 flex flex-col overflow-x-auto">
                <main className="flex-1 p-6 bg-gray-100">{children}</main>
                <footer className="bg-blue-600 text-white text-center p-4">
                    &copy; {new Date().getFullYear()} My Application. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
