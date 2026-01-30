import React from 'react';
import LoginForm from '../components/LoginForm';
import styles from './LoginPage.module.css';

export default function LoginPage() {
	return (
		<div className={styles.container}>
			<div className={styles.background}></div>
			<div style={{ position: 'relative', zIndex: 10 }}>
				<LoginForm />
			</div>
		</div>
	);
}
