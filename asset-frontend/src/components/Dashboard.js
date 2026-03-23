import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import styles from './Dashboard.module.css';

export default function Dashboard() {
	const [summary, setSummary] = useState([]);
	const [assets, setAssets] = useState([]);

	useEffect(() => {
		api.getSummary().then(setSummary);
		api.getAssets().then(setAssets);
	}, []);

	// Helper to check if category is stock-based
	const isStockCategory = (catId) => [5, 7, 8, 9].includes(catId);

	// Calculate metrics combining both traditional and stock assets
	const calculateMetrics = () => {
		let total = 0, assigned = 0, available = 0, maintenance = 0, disposal = 0;
		
		assets.forEach(a => {
			if (isStockCategory(a.categoryId)) {
				// Stock-based: count units
				total += (a.closing_stock || 0);
				assigned += (a.issue_stock || 0);
				available += Math.max(0, (a.closing_stock || 0) - (a.issue_stock || 0));
			} else {
				// Traditional: count items
				total += 1;
				if (a.condition_status === 'Asset in use') assigned += 1;
				else if (a.condition_status === 'Assets in Storage') available += 1;
				else if (a.condition_status === 'Assets under repair') maintenance += 1;
				else if (a.condition_status === 'Assets disposed') disposal += 1;
			}
		});
		
		return { total, assigned, available, maintenance, disposal };
	};

	const metrics = calculateMetrics();

	return (
		<div className={styles.container}>
			<h2>Dashboard Overview</h2>
			
			<div className={styles.mainStats}>
				<div className={styles.statCard + ' ' + styles.card1}>
					<div className={styles.statIcon}>📦</div>
					<div className={styles.statContent}>
						<div className={styles.statLabel}>Total Assets</div>
						<div className={styles.statValue}>{metrics.total}</div>
					</div>
				</div>
				<div className={styles.statCard + ' ' + styles.card2}>
					<div className={styles.statIcon}>✓</div>
					<div className={styles.statContent}>
						<div className={styles.statLabel}>Assigned</div>
						<div className={styles.statValue}>{metrics.assigned}</div>
					</div>
				</div>
				<div className={styles.statCard + ' ' + styles.card3}>
					<div className={styles.statIcon}>📍</div>
					<div className={styles.statContent}>
						<div className={styles.statLabel}>Available</div>
						<div className={styles.statValue}>{metrics.available}</div>
					</div>
				</div>
				<div className={styles.statCard + ' ' + styles.card4}>
					<div className={styles.statIcon}>🔧</div>
					<div className={styles.statContent}>
						<div className={styles.statLabel}>Maintenance</div>
						<div className={styles.statValue}>{metrics.maintenance}</div>
					</div>
				</div>
				<div className={styles.statCard + ' ' + styles.card5}>
					<div className={styles.statIcon}>🗑️</div>
					<div className={styles.statContent}>
						<div className={styles.statLabel}>Disposal</div>
						<div className={styles.statValue}>{metrics.disposal}</div>
					</div>
				</div>
			</div>

			<h3>Asset Summary by Category</h3>
			<div className={styles.tableWrapper}>
				<table className={styles.summaryTable}>
					<thead>
						<tr>
							<th>No</th>
							<th>Category</th>
							<th>Asset Name</th>
							<th>Total</th>
							<th>Assigned</th>
							<th>Available</th>
							<th>Maintenance</th>
							<th>Disposal</th>
							<th>Usage %</th>
						</tr>
					</thead>
					<tbody>
						{summary.length === 0 ? (
							<tr><td colSpan="9" style={{textAlign:'center', padding:'20px', color:'#999'}}>No assets available</td></tr>
						) : summary.map((s, i) => {
							const usage = s.total > 0 ? Math.round((s.assigned / s.total) * 100) : 0;
							return (
								<tr key={i}>
									<td>{i+1}</td>
									<td><strong>{s.category}</strong></td>
									<td>{s.asset_name}</td>
									<td className={styles.centerText}>{s.total}</td>
									<td className={styles.centerText}><span style={{color:'#107c10', fontWeight:600}}>{s.assigned}</span></td>
									<td className={styles.centerText}><span style={{color:'#0078d4', fontWeight:600}}>{s.available}</span></td>
									<td className={styles.centerText}><span style={{color:'#ff8c00', fontWeight:600}}>{s.maintenance || 0}</span></td>
									<td className={styles.centerText}><span style={{color:'#a4262c', fontWeight:600}}>{s.disposal || 0}</span></td>
									<td className={styles.centerText}>
										<div className={styles.progressContainer}>
											<div className={styles.progressBar} style={{width:`${usage}%`}}></div>
											<span className={styles.progressText}>{usage}%</span>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
