'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
    Search,
    Home,
    LayoutDashboard,
    FolderClosed,
    ListTodo,
    BarChart3,
    Bell,
    HelpCircle,
    Settings,
    ChevronDown,
    Menu,
    X,

} from 'lucide-react'
import Image from 'next/image'


export default function TeamLeaderSidebar() {
    const [activeItem, setActiveItem] = useState('Tasks')
    const [isOpen, setIsOpen] = useState(true)

    const toggleSidebar = () => setIsOpen(!isOpen)

    const menuItems = [
        { name: 'Home', icon: Home, href: '/admin/teamleader/pages/dashboard' },
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/teamleader/pages/profile' },
        { name: 'Projects', icon: FolderClosed, href: '/projects' },
        { name: 'Tasks', icon: ListTodo, href: '/tasks' },
        { name: 'Reporting', icon: BarChart3, href: '/reporting' },
    ]

    const secondaryItems = [
        { name: 'Notification', icon: Bell, badge: 12, href: '/notifications' },
        { name: 'Support', icon: HelpCircle, href: '/support' },
        { name: 'Settings', icon: Settings, href: '/settings' },
    ]



    return (
        <div className={`flex ${isOpen ? 'w-64' : 'w-20'} h-screen bg-gray-900 text-gray-100 transition-width duration-300`}>
            <div className="flex flex-col h-full w-full p-1">
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {isOpen && <span className="text-xl font-semibold">&#60;SM/&#62;</span>}
                    </div>
                    <button onClick={toggleSidebar} className="text-gray-100 focus:outline-none">
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
                                    <button
                                        onClick={() => setActiveItem(item.name)}
                                        className={`flex items-center w-full px-4 py-2 text-left transition-colors rounded-lg ${activeItem === item.name ? 'bg-purple-600 text-white' : 'hover:bg-gray-800 text-gray-300'
                                            }`}
                                    >
                                        <item.icon size={25} className="mr-4" />
                                        {isOpen && item.name}
                                    </button>
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
                                        <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-800 transition-colors rounded-lg">
                                            <item.icon size={20} className="mr-4" />
                                            {item.name}
                                            {item.badge && (
                                                <span className="ml-auto bg-purple-600 text-xs font-semibold px-2 py-1 rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {isOpen && (
                    <div className="p-4 border-t border-gray-800">
                        <button className="flex items-center w-full text-left">
                            <Image
                                src="/placeholder.svg?height=32&width=32"
                                alt="User avatar"
                                width={32}
                                height={32}
                                className="rounded-full mr-3"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-semibold">Brooklyn Simmons</p>
                                <p className="text-xs text-gray-400">brooklyn@simmons.com</p>
                            </div>
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
