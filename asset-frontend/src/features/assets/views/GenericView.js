import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import styles from './Views.module.css';

/**
 * Generic View Component
 * Displays assets for any category in an organized table format
 * Customize the columns and labels based on the category
 */
export default function GenericView({ categoryId, categoryName, categoryIcon, categoryColor }) {
	const [assets, setAssets] = useState([]);
	const [selectedAsset, setSelectedAsset] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const load = useCallback(() => {
		api.getAssets({ q: searchTerm, categoryId }).then(setAssets);
	}, [searchTerm, categoryId]);

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
				<h2>{categoryIcon} {categoryName}</h2>
				<p className={styles.viewDesc}>Total Assets: {assets.length}</p>
			</div>

			<div className={styles.controls}>
				<input
					type="text"
					placeholder="🔍 Search assets..."
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className={styles.searchInput}
				/>
				<Link to={`/office-assets/new?category=${categoryId}`} className={styles.addBtn}>+ Add Asset</Link>
			</div>

			{selectedAsset && (
				<div className={styles.detailPanel}>
					<div className={styles.detailHeader}>
						<h3>{categoryIcon} {selectedAsset.asset_name}</h3>
						<button onClick={() => setSelectedAsset(null)} className={styles.closeBtn}>✕</button>
					</div>
					<div className={styles.detailGrid}>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Asset Name:</span>
							<span className={styles.detailValue}>{selectedAsset.asset_name}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Brand/Model:</span>
							<span className={styles.detailValue}>{selectedAsset.brand_model}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Serial/Ref:</span>
							<span className={styles.detailValue}>{selectedAsset.serial_number || 'N/A'}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Purchase Date:</span>
							<span className={styles.detailValue}>{selectedAsset.purchase_date}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Cost:</span>
							<span className={styles.detailValue}>RM {selectedAsset.cost_rm?.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Location:</span>
							<span className={styles.detailValue}>{selectedAsset.location_department}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Assigned To:</span>
							<span className={styles.detailValue}>{selectedAsset.assigned_to || 'Unassigned'}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Status:</span>
							<span style={{ color: getConditionColor(selectedAsset.condition_status), fontWeight: 600 }}>
								{selectedAsset.condition_status}
							</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Remarks:</span>
							<span className={styles.detailValue}>{selectedAsset.remarks || 'No remarks'}</span>
						</div>
					</div>
					<div className={styles.detailActions}>
						<Link to={`/office-assets/${selectedAsset.id}/edit`} className={styles.editBtn}>Edit</Link>
						<button onClick={() => setSelectedAsset(null)} className={styles.closeDetailBtn}>Close</button>
					</div>
				</div>
			)}

			<div className={styles.tableWrapper}>
				{assets.length === 0 ? (
					<div className={styles.noData}>
						<p>📦 No assets found</p>
						<Link to={`/office-assets/new?category=${categoryId}`} className={styles.addBtnSmall}>Add First Asset</Link>
					</div>
				) : (
					<table className={styles.table}>
						<thead>
							<tr>
								<th>No.</th>
								<th>Asset Name</th>
								<th>Brand/Model</th>
								<th>Serial/Ref</th>
								<th>Date</th>
								<th>Cost (RM)</th>
								<th>Location</th>
								<th>Assigned To</th>
								<th>Status</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{assets.map((a, i) => (
								<tr key={a.id} style={{ backgroundColor: getConditionBgColor(a.condition_status) }}>
									<td>{i + 1}</td>
									<td style={{ fontWeight: 600 }}>{a.asset_name}</td>
									<td>{a.brand_model}</td>
									<td style={{ fontSize: '0.9em', color: '#666' }}>{a.serial_number || '-'}</td>
									<td style={{ fontSize: '0.9em' }}>{a.purchase_date}</td>
									<td style={{ textAlign: 'right' }}>RM {a.cost_rm?.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
									<td style={{ fontSize: '0.9em' }}>{a.location_department}</td>
									<td style={{ fontSize: '0.9em' }}>{a.assigned_to || '-'}</td>
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
										<Link to={`/office-assets/${a.id}/edit`} className={styles.editLink}>Edit</Link>
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

