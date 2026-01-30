import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import styles from './Dashboard.module.css';

export default function Dashboard() {
	const [summary, setSummary] = useState([]);
	const [assets, setAssets] = useState([]);
	const [totalCost, setTotalCost] = useState(0);

	useEffect(() => {
		api.getSummary().then(setSummary);
		api.getAssets().then(data => {
			setAssets(data);
			const total = data.reduce((sum, a) => sum + (a.cost_rm || 0), 0);
			setTotalCost(total);
		});
	}, []);

	const totalAssets = assets.length;
	const assignedAssets = assets.filter(a => a.condition_status === 'Asset in use').length;
	const availableAssets = assets.filter(a => a.condition_status === 'Assets in Storage').length;
	const underMaintenance = assets.filter(a => a.condition_status === 'Assets under repair').length;

	return (
		<div className={styles.container}>
			<h2>Dashboard Overview</h2>
			
			<div className={styles.mainStats}>
				<div className={styles.statCard + ' ' + styles.card1}>
					<div className={styles.statIcon}>📦</div>
					<div className={styles.statContent}>
						<div className={styles.statLabel}>Total Assets</div>
						<div className={styles.statValue}>{totalAssets}</div>
					</div>
				</div>
				<div className={styles.statCard + ' ' + styles.card2}>
					<div className={styles.statIcon}>✓</div>
					<div className={styles.statContent}>
						<div className={styles.statLabel}>Assets Assigned</div>
						<div className={styles.statValue}>{assignedAssets}</div>
					</div>
				</div>
				<div className={styles.statCard + ' ' + styles.card3}>
					<div className={styles.statIcon}>📍</div>
					<div className={styles.statContent}>
						<div className={styles.statLabel}>Assets Available</div>
						<div className={styles.statValue}>{availableAssets}</div>
					</div>
				</div>
				<div className={styles.statCard + ' ' + styles.card4}>
					<div className={styles.statIcon}>🔧</div>
					<div className={styles.statContent}>
						<div className={styles.statLabel}>Under Maintenance</div>
						<div className={styles.statValue}>{underMaintenance}</div>
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
							<th>Total Units</th>
							<th>Assigned Units</th>
							<th>Available Units</th>
							<th>Usage %</th>
						</tr>
					</thead>
					<tbody>
						{summary.length === 0 ? (
							<tr><td colSpan="7" style={{textAlign:'center', padding:'20px', color:'#999'}}>No assets available</td></tr>
						) : summary.map((s, i) => {
							const usage = s.total > 0 ? Math.round((s.assigned / s.total) * 100) : 0;
							return (
								<tr key={i}>
									<td>{i+1}</td>
									<td><strong>{s.category}</strong></td>
									<td>{s.asset_name}</td>
									<td className={styles.centerText}>{s.total}</td>
									<td className={styles.centerText}><span style={{color:'#107c10', fontWeight:600}}>{s.assigned}</span></td>
									<td className={styles.centerText}><span style={{color:'#ff8c00', fontWeight:600}}>{s.total - s.assigned}</span></td>
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
