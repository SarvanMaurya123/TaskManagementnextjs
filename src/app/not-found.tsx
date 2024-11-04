// src/app/404.js
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-cover bg-center animate-backgroundZoom" >
            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-6xl font-extrabold text-red-600 animate-pulse mb-2">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800">Oops! Page Not Found</h2>
                <p className="mt-4 text-lg text-gray-700">
                    Sorry, the page you're looking for does not exist or has been moved.
                </p>

                <p className="mt-6 inline-block px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-blue-600 rounded-full hover:bg-gradient-to-l hover:from-blue-600 hover:to-red-600 transition-transform duration-500 ease-in-out transform hover:scale-110 animate-bounce">
                    Go Back
                </p>

            </div>
        </div>
    );
}
