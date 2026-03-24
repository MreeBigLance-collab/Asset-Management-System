import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AssetTable from '../components/AssetTable';
import styles from './AssetPage.module.css';


export default function AssetPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const modeFromQuery = searchParams.get('mode');
	const mode = modeFromQuery === 'stock' ? 'stock' : 'asset';

	const setMode = (nextMode) => {
		setSearchParams({ mode: nextMode });
	};

	return (
		<div className={styles.container}>
			<div className={styles.modeSwitch}>
				<button
					type="button"
					onClick={() => setMode('asset')}
					className={`${styles.modeButton} ${mode === 'asset' ? styles.modeButtonActive : ''}`}
				>
					Office Assets
				</button>
				<button
					type="button"
					onClick={() => setMode('stock')}
					className={`${styles.modeButton} ${mode === 'stock' ? styles.modeButtonActive : ''}`}
				>
					Office Stock
				</button>
			</div>
			<AssetTable mode={mode} />
		</div>
	);
}

