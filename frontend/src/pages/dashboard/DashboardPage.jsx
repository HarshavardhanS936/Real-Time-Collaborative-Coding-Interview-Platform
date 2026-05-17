import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../../services/api/axiosClient';

export const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [joinCode, setJoinCode] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('JAVA');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateRoom = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await axiosClient.post('/rooms/create', {
                language: selectedLanguage
            });
            console.log('Room created successfully:', res.data);
            navigate(`/room/${res.data.roomId}`);
        } catch (err) {
            console.error('Room creation failed:', err);
            setError(err.response?.data?.error || 'Failed to create room. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = () => {
        if (!joinCode.trim()) {
            setError('Please enter a room code');
            return;
        }
        navigate(`/room/${joinCode.trim().toUpperCase()}`);
    };

    return (
        <div className="min-h-screen bg-[#121214] text-gray-300 p-8">
            <header className="flex justify-between items-center mb-8 bg-[#1a191f] p-5 rounded-2xl border border-gray-800 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary-600 flex items-center justify-center font-bold text-white shadow-lg shadow-primary-600/30">C</div>
                    <h1 className="text-xl font-bold text-white tracking-wide">Collaborative Workspace</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-300">{user?.username} <span className="text-xs bg-gray-800 px-2.5 py-1 rounded-full text-gray-400 font-mono ml-1.5">{user?.role}</span></span>
                    <button onClick={logout} className="px-4 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 active:scale-95 transition font-semibold text-sm">Logout</button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <div className="bg-[#1a191f] p-6 rounded-2xl border border-gray-800 shadow-xl space-y-4">
                        <h2 className="text-lg font-bold text-white mb-2">Workspace Rooms</h2>
                        {error && (
                            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium">
                                ⚠ {error}
                            </div>
                        )}
                        
                        <div className="flex flex-col gap-5">
                            {/* Create Room Section (Interviewer Only) */}
                            {user?.role === 'INTERVIEWER' && (
                                <div className="p-4 bg-[#121214] border border-gray-800/80 rounded-xl flex items-center justify-between gap-4 flex-wrap">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-bold text-white text-sm">Host a New Session</h3>
                                        <p className="text-xs text-gray-500">Select language and spin up a workspace room instantly</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <select 
                                            value={selectedLanguage}
                                            onChange={(e) => setSelectedLanguage(e.target.value)}
                                            className="bg-[#1a191f] border border-gray-800 text-sm text-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary-500 transition"
                                        >
                                            <option value="JAVA">Java (JDK 21)</option>
                                            <option value="JAVASCRIPT">JavaScript (Node.js)</option>
                                        </select>
                                        <button 
                                            onClick={handleCreateRoom} 
                                            disabled={loading}
                                            className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 active:scale-95 transition font-semibold text-sm shadow-lg shadow-primary-600/10"
                                        >
                                            {loading ? 'Creating...' : 'Create Room'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Join Room Section */}
                            <div className="p-4 bg-[#121214] border border-gray-800/80 rounded-xl flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-bold text-white text-sm">Enter Existing Session</h3>
                                    <p className="text-xs text-gray-500">Provide an 8-character code to join the live collaborative session</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="text" 
                                        placeholder="Room Code (e.g. A1B2C3D4)" 
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value)}
                                        className="bg-[#1a191f] border border-gray-800 text-sm text-gray-300 rounded-lg px-4 py-2 outline-none focus:border-primary-500 transition font-mono"
                                    />
                                    <button 
                                        onClick={handleJoinRoom}
                                        className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 active:scale-95 transition font-semibold text-sm"
                                    >
                                        Join Room
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1a191f] p-6 rounded-2xl border border-gray-800 shadow-xl">
                        <h2 className="text-lg font-bold text-white mb-4">Platform Stats</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-[#121214] border border-gray-800 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase font-mono tracking-wider">Total Interviews</p>
                                <p className="text-2xl font-bold text-primary-500 mt-1">12</p>
                            </div>
                            <div className="p-4 bg-[#121214] border border-gray-800 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase font-mono tracking-wider">Success Rate</p>
                                <p className="text-2xl font-bold text-green-500 mt-1">85%</p>
                            </div>
                            <div className="p-4 bg-[#121214] border border-gray-800 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase font-mono tracking-wider">Compiler Avg Speed</p>
                                <p className="text-2xl font-bold text-amber-500 mt-1">240ms</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1a191f] p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-white mb-4">Activity Logs</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">No recent activity logs recorded in this session. Spin up a room or join a candidate to begin logging compiler actions.</p>
                    </div>
                    <div className="mt-6 border-t border-gray-800/80 pt-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span>Compiler Sandbox Systems Normal</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
