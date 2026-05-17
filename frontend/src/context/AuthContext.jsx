import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../services/api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Token persistence strategy: load from localStorage on boot
        const storedToken = localStorage.getItem('jwt_token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const data = await authApi.login(credentials);
        localStorage.setItem('jwt_token', data.token);
        const userData = { username: data.username, email: data.email, role: data.role };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return data;
    };

    const register = async (userData) => {
        const data = await authApi.register(userData);
        localStorage.setItem('jwt_token', data.token);
        const newUser = { username: data.username, email: data.email, role: data.role };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
