import React from 'react';
import Dashboard from '../components/Dashboard';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<Dashboard />
			</div>
		</div>
	);
}

