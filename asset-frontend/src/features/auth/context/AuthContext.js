import React, { createContext, useState, useEffect } from 'react';
import api from '../../../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const raw = localStorage.getItem('ams_user');
		return raw ? JSON.parse(raw) : null;
	});

	useEffect(() => {
		if (user) localStorage.setItem('ams_user', JSON.stringify(user));
		else localStorage.removeItem('ams_user');
	}, [user]);

	const login = async ({ username, password }) => {
		const resp = await api.login({ username, password });
		setUser(resp);
		return resp;
	};

	const logout = () => setUser(null);

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

