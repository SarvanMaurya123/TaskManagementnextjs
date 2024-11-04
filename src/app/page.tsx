// app/page.jsx
"use client";
import Layout from '@/app/components/layout';
import { useUser } from '@/app/context/store';
import Image from 'next/image';
import TaskImage from '@/app/task.jpg'
//import UserProfile from './profile/user/page';

export default function Home() {
  const { user } = useUser();

  return (
    <Layout>
      <div className="md:flex md:justify-between items-center mx-6 mt-8">
        <div className="text-center md:text-left md:w-1/2 mr-10 ">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.username || 'Guest'}!
          </h1>
          <p className="mt-4 text-lg text-gray-600 text-justify">
            Organize your tasks, set priorities, and achieve your goals more effectively.
            Here, you can keep track of your progress, set deadlines, and stay on top of
            your assignments with ease.
          </p>
          <p className="mt-4 text-md text-gray-500 text-justify">
            Ready to take control of your day? Explore your tasks, update their status,
            and start planning for success!
          </p>

        </div>
        <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center relative h-[400px] w-full md:w-[50%] md:h-[600px]">
          <Image
            src={TaskImage} // Use the path relative to the /public folder
            alt="Organize your tasks"
            layout="fill" // Make the image responsive within the relative container
            objectFit="cover"
          />
        </div>
      </div>
      {/* <div>
        <UserProfile />
      </div> */}
    </Layout>
  );
}
