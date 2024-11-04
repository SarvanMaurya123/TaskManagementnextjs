// MainLayout.js
'use client'
import { ReactNode } from 'react';
import TeamLeaderSidebar from './Siderbar';

interface LayoutProps {
    children: ReactNode;
}
export default function TeamLeaderAdminMainLayout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <TeamLeaderSidebar />

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">

                {children}

            </div>
        </div>
    )
}
