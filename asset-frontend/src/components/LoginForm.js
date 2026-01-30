import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './LoginForm.module.css';

export default function LoginForm() {
	const { login } = useContext(AuthContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const nav = useNavigate();

	const submit = async e => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			if (!username || !password) {
				setError('Please enter username and password');
				setLoading(false);
				return;
			}
			await login({ username, password });
			nav('/home');
		} catch (err) {
			setError(err.message || 'Invalid credentials');
			setLoading(false);
		}
	};

	return (
		<form className={styles.form} onSubmit={submit}>
			<h2>Asset Management System</h2>
			<p style={{ textAlign: 'center', color: '#999', marginBottom: '16px' }}>Login to your account</p>
			{error && <div className={styles.error}>{error}</div>}
			<div>
				<input 
					type="text"
					placeholder="Username" 
					value={username} 
					onChange={e => setUsername(e.target.value)}
					disabled={loading}
				/>
			</div>
			<div>
				<input 
					type="password"
					placeholder="Password" 
					value={password} 
					onChange={e => setPassword(e.target.value)}
					disabled={loading}
				/>
			</div>
			<button type="submit" disabled={loading}>
				{loading ? 'Logging in...' : 'Login'}
			</button>
			<div style={{ marginTop: '12px', fontSize: '12px', color: '#999', textAlign: 'center' }}>
				<p>Demo credentials:</p>
				<p>admin / admin123</p>
				<p>user1 / admin123</p>
			</div>
		</form>
	);
}
