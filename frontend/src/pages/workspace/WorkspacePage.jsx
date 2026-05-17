import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useCollaboration } from '../../hooks/useCollaboration';
import { useAuth } from '../../context/AuthContext';
import { axiosClient } from '../../services/api/axiosClient';

export const WorkspacePage = () => {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [language, setLanguage] = useState('javascript');
    const [roomDetails, setRoomDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [consoleOutput, setConsoleOutput] = useState([
        '> Workspace initialized.',
        '> Ready for live coding collaboration...'
    ]);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');

    const { connected, participants, code, syncCode } = useCollaboration(roomCode, user?.username);

    // Track active participants list including yourself and live socket users
    const allParticipants = Array.from(new Set([user?.username, ...participants].filter(Boolean)));

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const res = await axiosClient.get(`/rooms/join/${roomCode}`);
                setLanguage(res.data.language.toLowerCase());
                setRoomDetails(res.data);
                if (res.data.codeContent) {
                    syncCode(res.data.codeContent);
                }
            } catch (err) {
                console.error("Failed to join room", err);
                setConsoleOutput(prev => [...prev, '> Error joining room. Room may not exist.']);
            } finally {
                setLoading(false);
            }
        };

        if (roomCode) {
            fetchRoomDetails();
        }
    }, [roomCode]);

    const handleCodeChange = (value) => {
        syncCode(value || '');
    };

    const handleSendMessage = (e) => {
        if (e.key === 'Enter' && chatInput.trim()) {
            // For MVP simplicity, we can append messages locally
            // A production version would broadcast over WebSockets
            setChatMessages(prev => [...prev, {
                username: user?.username || 'Me',
                text: chatInput.trim(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setChatInput('');
        }
    };

    const handleRunCode = async () => {
        setConsoleOutput(prev => [...prev, '> Initiating isolated Docker environment...']);
        try {
            const res = await axiosClient.post('/compiler/execute', {
                language: language,
                code: code
            });
            
            setConsoleOutput(prev => {
                const lines = [...prev];
                if (res.data.stdout) {
                    lines.push(res.data.stdout);
                }
                if (res.data.stderr) {
                    lines.push(`[STDERR] ${res.data.stderr}`);
                }
                lines.push(`> Process finished with exit code ${res.data.exitCode}`);
                return lines;
            });
        } catch (err) {
            setConsoleOutput(prev => [...prev, `> Execution failed: ${err.response?.data?.error || err.message}`]);
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="text-gray-400 font-medium">Entering Collaborative Workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col bg-[#121214] text-gray-300">
            {/* Top Workspace Header */}
            <header className="h-14 bg-[#1a191f] border-b border-gray-800 flex justify-between items-center px-6 shadow-md z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition font-medium text-sm flex items-center gap-1">
                        <span>←</span> Dashboard
                    </button>
                    <div className="h-6 w-px bg-gray-800"></div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm tracking-wide">ROOM: {roomCode}</span>
                        <span className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} 
                              title={connected ? "Websocket Sync Active" : "Disconnected"}></span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full uppercase font-mono tracking-wider">
                        Env: {language}
                    </span>
                    <button onClick={handleRunCode} className="px-5 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-all font-semibold text-sm flex items-center gap-2 shadow-lg shadow-green-600/10">
                        <span>▶</span> Run Code
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="px-4 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 active:scale-95 transition font-semibold text-sm">
                        Leave Room
                    </button>
                </div>
            </header>
            
            {/* Split Screen Workspace Area */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Panel: Problem Definition */}
                <aside className="w-1/4 bg-[#16151a] border-r border-gray-800 p-5 overflow-y-auto flex flex-col">
                    <h2 className="font-bold text-white mb-4 uppercase text-xs tracking-wider text-gray-400">Problem Description</h2>
                    <div className="p-5 bg-[#1a191f] rounded-xl border border-gray-800/80 flex-1 space-y-4">
                        <h3 className="font-bold text-lg text-white">1. Two Sum</h3>
                        <span className="inline-block text-xs bg-green-500/10 text-green-400 font-semibold px-2 py-0.5 rounded">Easy</span>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Given an array of integers <code className="bg-[#121214] px-1.5 py-0.5 rounded font-mono text-xs text-amber-500">nums</code> and an integer <code className="bg-[#121214] px-1.5 py-0.5 rounded font-mono text-xs text-amber-500">target</code>, return indices of the two numbers such that they add up to target.
                        </p>
                        <p className="text-sm leading-relaxed text-gray-400">
                            You may assume that each input would have exactly one solution, and you may not use the same element twice.
                        </p>
                    </div>
                </aside>
                
                {/* Center Panel: Monaco Editor & Output Terminal */}
                <section className="flex-1 flex flex-col">
                    <div className="flex-1 bg-[#1e1e1e] relative min-h-0 border-b border-gray-800">
                        <Editor
                            height="100%"
                            language={language}
                            theme="vs-dark"
                            value={code}
                            onChange={handleCodeChange}
                            options={{
                                selectOnLineNumbers: true,
                                renderWhitespace: 'all',
                                fontSize: 14,
                                fontFamily: 'Fira Code, Menlo, Monaco, monospace',
                                automaticLayout: true,
                                minimap: { enabled: false },
                                cursorBlinking: 'smooth',
                                smoothScrolling: true
                            }}
                        />
                    </div>
                    {/* Output Terminal Console */}
                    <div className="h-1/3 bg-[#0d0c0f] p-4 flex flex-col min-h-[150px]">
                        <h3 className="font-mono text-xs text-gray-500 uppercase mb-2 tracking-wider">Console Output</h3>
                        <div className="flex-1 bg-black/50 border border-gray-800/50 rounded-xl p-4 font-mono text-sm text-green-400 overflow-y-auto space-y-1 scrollbar-thin">
                            {consoleOutput.map((line, idx) => (
                                <div key={idx} className={line.startsWith('>') ? 'text-blue-400' : 'text-gray-200'}>
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Right Panel: Active Users & Chat Room */}
                <aside className="w-1/5 bg-[#16151a] border-l border-gray-800 flex flex-col">
                    {/* Participants List */}
                    <div className="p-4 border-b border-gray-800">
                        <h2 className="font-bold text-white uppercase text-xs tracking-wider text-gray-400 mb-3">Active Users ({allParticipants.length})</h2>
                        <div className="space-y-2">
                            {allParticipants.map((p, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium text-gray-300">{p}</span>
                                    {p === user?.username && <span className="text-[10px] text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded font-mono">You</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Collaborative Chat */}
                    <div className="p-4 bg-gray-900/10">
                        <h2 className="font-bold text-white uppercase text-xs tracking-wider text-gray-400">Room Chat</h2>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto bg-[#121214]/50 space-y-3 scrollbar-thin">
                        <div className="text-center">
                            <span className="text-[10px] text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full font-mono">You joined the coding room</span>
                        </div>
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.username === user?.username ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-xs text-gray-400 font-bold">{msg.username}</span>
                                    <span className="text-[9px] text-gray-500">{msg.time}</span>
                                </div>
                                <div className={`text-sm py-1.5 px-3 rounded-lg max-w-[85%] ${
                                    msg.username === user?.username 
                                        ? 'bg-primary-600 text-white rounded-tr-none' 
                                        : 'bg-[#1a191f] text-gray-300 border border-gray-800 rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Chat Input */}
                    <div className="p-4 border-t border-gray-800 bg-[#16151a]">
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            className="w-full bg-[#121214] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary-500/80 transition"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={handleSendMessage}
                        />
                    </div>
                </aside>
            </main>
        </div>
    );
};
