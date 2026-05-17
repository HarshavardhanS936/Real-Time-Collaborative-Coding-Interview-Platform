import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login({ email, password });
            navigate('/dashboard'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Log in to your account</p>
                </div>
                
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input type="email" required 
                               className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 border focus:border-primary-500 focus:ring-2 focus:ring-primary-500 outline-none transition" 
                               value={email} onChange={(e) => setEmail(e.target.value)} 
                               placeholder="you@example.com"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input type="password" required 
                               className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 border focus:border-primary-500 focus:ring-2 focus:ring-primary-500 outline-none transition" 
                               value={password} onChange={(e) => setPassword(e.target.value)} 
                               placeholder="••••••••"/>
                    </div>
                    <button type="submit" 
                            className="w-full bg-primary-600 text-white font-medium py-3 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/50 transition-all shadow-md shadow-primary-500/20">
                        Log In
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account? <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 transition">Sign up</Link>
                </p>
            </div>
        </div>
    );
};
