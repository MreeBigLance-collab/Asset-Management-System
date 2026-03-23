import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import styles from './Views.module.css';

/**
 * VehicleView Component
 * Displays vehicles in a specialized table view with vehicle-specific columns
 */
export default function VehicleView() {
	const [assets, setAssets] = useState([]);
	const [selectedAsset, setSelectedAsset] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const load = useCallback(() => {
		api.getAssets({ q: searchTerm, categoryId: 6 }).then(setAssets);
	}, [searchTerm]);

	useEffect(() => {
		load();
	}, [load]);

	const getConditionColor = (status) => {
		if (status === 'Asset in use') return '#107c10';
		if (status === 'Assets in Storage') return '#ff8c00';
		if (status === 'Assets under repair') return '#ff7630';
		return '#666';
	};

	const getConditionBgColor = (status) => {
		if (status === 'Asset in use') return '#f0f8f5';
		if (status === 'Assets in Storage') return '#fff8f0';
		if (status === 'Assets under repair') return '#fff5f0';
		return '#f5f5f5';
	};

	return (
		<div className={styles.container}>
			<div className={styles.viewHeader}>
				<h2>🚗 Vehicles</h2>
				<p className={styles.viewDesc}>Manage company vehicles and transportation assets</p>
			</div>

			<div className={styles.controls}>
				<input
					type="text"
					placeholder="🔍 Search by vehicle name, plate, or driver..."
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className={styles.searchInput}
				/>
				<Link to="/assets/new?category=6" className={styles.addBtn}>+ Add Vehicle</Link>
			</div>

			{selectedAsset && (
				<div className={styles.detailPanel}>
					<div className={styles.detailHeader}>
						<h3>🚗 {selectedAsset.asset_name}</h3>
						<button onClick={() => setSelectedAsset(null)} className={styles.closeBtn}>✕</button>
					</div>
					<div className={styles.detailGrid}>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Reg. Plate:</span>
							<span className={styles.detailValue}>{selectedAsset.serial_number}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Make/Model:</span>
							<span className={styles.detailValue}>{selectedAsset.brand_model}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Reg. Date:</span>
							<span className={styles.detailValue}>{selectedAsset.purchase_date}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Cost:</span>
							<span className={styles.detailValue}>RM {selectedAsset.cost_rm?.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Current Location:</span>
							<span className={styles.detailValue}>{selectedAsset.location_department}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Assigned Driver:</span>
							<span className={styles.detailValue}>{selectedAsset.assigned_to}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Status:</span>
							<span style={{ color: getConditionColor(selectedAsset.condition_status), fontWeight: 600 }}>
								{selectedAsset.condition_status}
							</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Notes:</span>
							<span className={styles.detailValue}>{selectedAsset.remarks || 'No notes'}</span>
						</div>
					</div>
					<div className={styles.detailActions}>
						<Link to={`/assets/edit/${selectedAsset.id}`} className={styles.editBtn}>Edit</Link>
						<button onClick={() => setSelectedAsset(null)} className={styles.closeDetailBtn}>Close</button>
					</div>
				</div>
			)}

			<div className={styles.tableWrapper}>
				{assets.length === 0 ? (
					<div className={styles.noData}>
						<p>📦 No vehicles found</p>
						<Link to="/assets/new?category=6" className={styles.addBtnSmall}>Add First Vehicle</Link>
					</div>
				) : (
					<table className={styles.table}>
						<thead>
							<tr>
								<th>No.</th>
								<th>Vehicle</th>
								<th>Plate</th>
								<th>Make/Model</th>
								<th>Reg. Date</th>
								<th>Cost (RM)</th>
								<th>Location</th>
								<th>Driver</th>
								<th>Status</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{assets.map((a, i) => (
								<tr key={a.id} style={{ backgroundColor: getConditionBgColor(a.condition_status) }}>
									<td>{i + 1}</td>
									<td style={{ fontWeight: 600 }}>{a.asset_name}</td>
									<td style={{ fontWeight: 700, color: '#d32f2f' }}>{a.serial_number}</td>
									<td>{a.brand_model}</td>
									<td>{a.purchase_date}</td>
									<td style={{ textAlign: 'right' }}>RM {a.cost_rm?.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
									<td>{a.location_department}</td>
									<td style={{ fontSize: '0.9em' }}>{a.assigned_to}</td>
									<td>
										<span style={{
											color: getConditionColor(a.condition_status),
											fontWeight: 600,
											fontSize: '0.85em',
											padding: '4px 8px',
											borderRadius: '4px',
											backgroundColor: 'rgba(255,255,255,0.6)'
										}}>
											{a.condition_status}
										</span>
									</td>
									<td>
										<button onClick={() => setSelectedAsset(a)} className={styles.viewBtn}>View</button>
										<Link to={`/assets/edit/${a.id}`} className={styles.editLink}>Edit</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}

