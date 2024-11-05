'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    LayoutDashboard,
    FolderClosed,
    Bell,
    Settings,
    ChevronDown,
    Menu,
    X,
    LogOut // Import the LogOut icon
} from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function TeamLeaderSidebar() {
    const [activeItem, setActiveItem] = useState('Home');
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();

    const toggleSidebar = () => setIsOpen(prev => !prev);

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/teamleader/pages/dashboard' },
        { name: 'Team Members', icon: FolderClosed, href: '/admin/teamleader/pages/teammember' },
    ];

    const secondaryItems = [
        { name: 'Notification', icon: Bell, badge: 12, href: '/notifications' },
        { name: 'Settings', icon: Settings, href: '/settings' },
    ];

    const logout = async () => {
        try {
            await axios.get('/api/admin/logout/');
            Swal.fire({
                icon: 'success',
                title: 'Logged Out Successfully!',
                text: 'You have logged out.',
                confirmButtonText: 'OK',
            });
            router.push('/admin/login');
        } catch (error: any) {
            console.error("Error during logout:", error.message);
        }
    };

    return (
        <div className={`flex ${isOpen ? 'w-64' : 'w-20'} h-full bg-gray-900 text-gray-100 transition-all duration-300`}>
            <div className="flex flex-col h-full w-full p-2">
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {isOpen && <span className="text-xl font-semibold">&#60;SM/&#62;</span>}
                    </div>
                    <button
                        onClick={toggleSidebar}
                        aria-label="Toggle Sidebar"
                        aria-expanded={isOpen}
                        className="text-gray-100 focus:outline-none"
                    >
                        {isOpen ? <X size={30} /> : <Menu size={30} />}
                    </button>
                </div>

                {isOpen && (
                    <div className="px-4 mt-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300"
                            />
                        </div>
                    </div>
                )}

                <nav className="mt-8 flex-1">
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.name} className="mb-2">
                                <Link href={item.href} passHref>
                                    <p
                                        onClick={() => setActiveItem(item.name)}
                                        className={`flex items-center w-full px-4 py-2 rounded-lg transition duration-200 ${activeItem === item.name ? 'bg-purple-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
                                        aria-current={activeItem === item.name ? "page" : undefined}
                                    >
                                        <item.icon size={25} className="mr-4" />
                                        {isOpen && item.name}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {isOpen && (
                    <div className="mt-auto mb-4">
                        <ul>
                            {secondaryItems.map((item) => (
                                <li key={item.name} className="mb-2">
                                    <Link href={item.href} passHref>
                                        <p className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-800 transition-colors rounded-lg">
                                            <item.icon size={20} className="mr-4" />
                                            {item.name}
                                            {item.badge && (
                                                <span className="ml-auto bg-purple-600 text-xs font-semibold px-2 py-1 rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {isOpen && (
                    <div className="p-4 border-t border-gray-800">
                        <button className="flex items-center w-full text-left">
                            <div className="flex-1">
                                <p className="text-sm font-semibold">Brooklyn Simmons</p>
                                <p className="text-xs text-gray-400">brooklyn@simmons.com</p>
                            </div>
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>
                    </div>
                )}
                {isOpen && (
                    <div className="p-4">
                        <button
                            onClick={logout}
                            className="flex items-center w-full px-4 py-2 text-left transition duration-300 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >

                            <LogOut size={20} className="mr-2" /> {/* Add the LogOut icon here */}
                            LogOut Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
