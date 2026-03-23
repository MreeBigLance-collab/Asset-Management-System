import React from 'react';
import AssetTable from '../components/AssetTable';
import styles from './AssetPage.module.css';

export default function AssetPage() {
	return (
		<div className={styles.container}>
			<AssetTable />
		</div>
	);
}

