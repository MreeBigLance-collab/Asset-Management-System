import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './HomePage.module.css';

export default function HomePage({ children }) {
	const { user, logout } = useContext(AuthContext);
	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1>Asset Management System</h1>
				<div className={styles.userInfo}>
					<span>{user?.username} ({user?.role})</span>
					<button onClick={logout} className={styles.logoutBtn}>Logout</button>
				</div>
			</header>
			
			<nav className={styles.nav}>
				<Link to="/home" className={styles.navLink}>🏠 Home</Link>
				<Link to="/dashboard" className={styles.navLink}>📊 Dashboard</Link>
				<Link to="/assets" className={styles.navLink}>📋 Assets</Link>
				<Link to="/assets/new" className={styles.navLink}>➕ Add Asset</Link>
			</nav>

			<main className={styles.main}>
				<div className={styles.contentContainer}>
					{children ? (
						children
					) : (
						<div className={styles.welcomeSection}>
							<h2>Welcome, {user?.username}!</h2>
							<p>Select an option from the navigation to get started.</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
