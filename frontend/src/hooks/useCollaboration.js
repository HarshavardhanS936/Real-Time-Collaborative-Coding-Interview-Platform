import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useCollaboration = (roomId, username) => {
    const [connected, setConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [code, setCode] = useState('');
    const stompClientRef = useRef(null);
    const isLocalChange = useRef(false);

    useEffect(() => {
        if (!roomId || !username) return;

        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
        const socketUrl = apiBase.replace('/api/v1', '/ws-coding');
        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            reconnectDelay: 5000,
            onConnect: () => {
                setConnected(true);
                console.log('Connected to WS!');

                // Subscribe to users joining/leaving
                client.subscribe(`/topic/room/${roomId}/users`, (message) => {
                    const payload = JSON.parse(message.body);
                    console.log('User event received:', payload);
                    
                    if (payload.type === 'JOIN') {
                        setParticipants((prev) => {
                            if (prev.includes(payload.username)) return prev;
                            return [...prev, payload.username];
                        });
                    } else if (payload.type === 'LEAVE') {
                        setParticipants((prev) => prev.filter(u => u !== payload.username));
                    }
                });

                // Subscribe to code sync events
                client.subscribe(`/topic/room/${roomId}/code`, (message) => {
                    const payload = JSON.parse(message.body);
                    if (payload.username !== username) {
                        isLocalChange.current = true;
                        setCode(payload.codeContent);
                    }
                });

                // Send JOIN message
                client.publish({
                    destination: `/app/room/${roomId}/join`,
                    body: JSON.stringify({ roomId, username, type: 'JOIN' })
                });
            },
            onDisconnect: () => {
                setConnected(false);
                console.log('Disconnected from WS!');
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame);
            }
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                if (stompClientRef.current.connected) {
                    // Send LEAVE message
                    stompClientRef.current.publish({
                        destination: `/app/room/${roomId}/join`,
                        body: JSON.stringify({ roomId, username, type: 'LEAVE' })
                    });
                }
                stompClientRef.current.deactivate();
            }
        };
    }, [roomId, username]);

    const syncCode = (newCode) => {
        if (isLocalChange.current) {
            isLocalChange.current = false;
            return;
        }
        setCode(newCode);
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.publish({
                destination: `/app/room/${roomId}/sync`,
                body: JSON.stringify({ roomId, codeContent: newCode, username })
            });
        }
    };

    return { connected, participants, code, syncCode };
};
