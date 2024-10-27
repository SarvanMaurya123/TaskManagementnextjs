'use client'; // Ensures this component is a Client Component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Using the App Router's 'useRouter'
import axios from 'axios';
const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null); // Handle token state
    const router = useRouter();
    const currentUrl = typeof window !== 'undefined' ? new URL(window.location.href) : null;

    useEffect(() => {
        if (currentUrl) {
            const tokenFromUrl = currentUrl.searchParams.get('token'); // Get the token from URL query params
            if (tokenFromUrl) {
                setToken(tokenFromUrl); // Set the token when available
            } else {
                setError('Invalid or missing token');
            }
        }
    }, [currentUrl]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!token) {
            setError('Invalid token. Please check your link.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('/api/users/resetPassword/', {
                token,          // Send the token from URL
                newPassword,    // Send the new password entered by the user
            });

            if (response.data.message === 'Password has been reset successfully') {
                setSuccess('Password reset successfully. Redirecting to login...');
                setError('');
                setLoading(false);

                // Redirect to login after success
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error resetting password');
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>
                    {error && <div className="bg-red-200 text-red-700 p-2 mb-4 rounded">{error}</div>}
                    <div className="text-gray-700 text-center">Loading token information...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Reset Your Password</h2>

                {error && <div className="bg-red-200 text-red-700 p-2 mb-4 rounded">{error}</div>}
                {success && <div className="bg-green-200 text-green-700 p-2 mb-4 rounded">{success}</div>}
                {loading && <div className="text-center mb-4">Processing...</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-gray-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
