// app/components/Footer.jsx
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white p-6">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-bold">My Application</h2>
                    <p className="text-sm">Connecting you with the world.</p>
                </div>
                <div className="flex space-x-6 mb-4 md:mb-0">
                    <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
                    <Link href="/about" className="text-gray-400 hover:text-white">About Us</Link>
                    <Link href="/services" className="text-gray-400 hover:text-white">Services</Link>
                    <Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link>
                </div>
                <div className="flex space-x-4">
                    <Link href="https://facebook.com" target="_blank" className="text-gray-400 hover:text-white">
                        <FaFacebookF />
                    </Link>
                    <Link href="https://twitter.com" target="_blank" className="text-gray-400 hover:text-white">
                        <FaTwitter />
                    </Link>
                    <Link href="https://instagram.com" target="_blank" className="text-gray-400 hover:text-white">
                        <FaInstagram />
                    </Link>
                    <Link href="https://linkedin.com" target="_blank" className="text-gray-400 hover:text-white">
                        <FaLinkedinIn />
                    </Link>
                </div>
            </div>
            <div className="text-center mt-4 border-t border-gray-700 pt-4">
                <p className="text-sm">&copy; 2024 My Application. All rights reserved.</p>
            </div>
        </footer>
    );
}
