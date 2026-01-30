import React from 'react';
import AddEditAsset from '../components/AddEditAsset';
import styles from './AddEditAssetPage.module.css';

export default function AddEditAssetPage() {
	return (
		<div className={styles.container}>
			<AddEditAsset />
		</div>
	);
}
