import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'CANDIDATE' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            // Read standard Spring Validation errors or custom exceptions
            if (err.response?.data && typeof err.response.data === 'object' && !err.response.data.message) {
                 const firstError = Object.values(err.response.data)[0];
                 setError(firstError || 'Validation failed');
            } else {
                 setError(err.response?.data?.message || 'Failed to create account.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create an account</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Start collaborating today</p>
                </div>
                
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                        <input type="text" name="username" required 
                               className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 border focus:border-primary-500 focus:ring-2 focus:ring-primary-500 outline-none transition" 
                               value={formData.username} onChange={handleChange} placeholder="johndoe"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input type="email" name="email" required 
                               className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 border focus:border-primary-500 focus:ring-2 focus:ring-primary-500 outline-none transition" 
                               value={formData.email} onChange={handleChange} placeholder="you@example.com"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input type="password" name="password" required 
                               className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 border focus:border-primary-500 focus:ring-2 focus:ring-primary-500 outline-none transition" 
                               value={formData.password} onChange={handleChange} placeholder="Min 8 characters"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                        <select name="role" 
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 border focus:border-primary-500 focus:ring-2 focus:ring-primary-500 outline-none transition" 
                                value={formData.role} onChange={handleChange}>
                            <option value="CANDIDATE">Candidate</option>
                            <option value="INTERVIEWER">Interviewer</option>
                        </select>
                    </div>
                    <button type="submit" 
                            className="w-full bg-primary-600 text-white font-medium py-3 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/50 transition-all shadow-md shadow-primary-500/20 mt-4">
                        Sign Up
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition">Log in</Link>
                </p>
            </div>
        </div>
    );
};
