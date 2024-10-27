"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useState } from "react";
import Link from "next/link";
import Layout from "../components/layout";

const ProfilePage = () => {
    const router = useRouter()
    const [data, setdata] = useState("nothing")
    const logout = async () => {

        try {
            await axios.get("/api/users/logout/");
            Swal.fire({
                icon: 'success',
                title: 'LogOut Succssfully!',
                text: 'You LogOut .',
                confirmButtonText: 'OK'
            });
            router.push("/login")
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const getData = async () => {
        const res = await axios.get("/api/users/me/")
        console.log(res.data);
        setdata(res.data.data._id);
    }
    return (<>
        <Layout>
            <div className="text-center mt-10">
                <h1>Profile Here</h1>
                <h2>{data === 'nothing' ? "Nothing" : <Link href={`/prfile/${data}`}>{data}</Link>}</h2>
                <button
                    onClick={logout}
                    className={`p-3 px-10 bg-orange-500 text-white py-3 rounded-md font-semibold $`}>
                    Sign Up Now
                </button>
                <button
                    onClick={getData}
                    className={`p-3 mx-3 mt-5 px-10 bg-orange-500 text-white py-3 rounded-md font-semibold $`}>
                    Get data
                </button>
            </div>
        </Layout>
    </>)
}
export default ProfilePage;