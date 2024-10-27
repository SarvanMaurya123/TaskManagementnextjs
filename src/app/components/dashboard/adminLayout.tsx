// MainLayout.js

import AdminSidebar from './Siderbar'
import { ReactNode } from 'react';
interface LayoutProps {
    children: ReactNode;
}
export default function AdminMainLayout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                {children}
            </div>
        </div>
    )
}
