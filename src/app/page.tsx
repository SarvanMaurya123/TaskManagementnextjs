// app/page.jsx
"use client";
import Layout from '@/app/components/layout';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';

export default function Home() {
  // const [username, setUsername] = useState('');
  const cookies = parseCookies();
  const { token, id, username, email } = cookies;
  // useEffect(() => {
  //   const cookies = parseCookies();
  //   const { username } = cookies;
  //   const usernameFromCookie = cookies.username || 'Guest';
  //   setUsername(usernameFromCookie);
  // }, []);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-center justify-between min-h-screen bg-gray-100 p-8">
        {/* Left side - Greeting */}
        <div className="flex flex-col items-start justify-center md:w-1/2">
          <h1 className="text-4xl font-bold mb-4 text-orange-500">Hello, {username}!!</h1>
          <p className="text-lg mb-6 max-w-md text-gray-700">
            Welcome to our website. Explore our features and services to discover more!
          </p>
          <button
            onClick={() => alert('Button clicked!')}
            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
          >
            Click Me
          </button>
        </div>

        {/* Right side - Image */}
        <div className="flex justify-center md:w-1/2 mt-8 md:mt-0">
          <Image
            src="" // Replace with the actual path to your image
            alt="Welcome"
            width={500}
            height={400}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </Layout>
  );
}
