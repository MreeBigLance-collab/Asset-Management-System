import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import styles from './AssetTable.module.css';

export default function AssetTable() {
	const [assets, setAssets] = useState([]);
	const [cats, setCats] = useState([]);
	const [q, setQ] = useState('');
	const [categoryId, setCategoryId] = useState('');
	const [assignedTo, setAssignedTo] = useState('');
	const [selectedAsset, setSelectedAsset] = useState(null);

	const load = () => api.getAssets({ q, categoryId, assignedTo }).then(setAssets);
	useEffect(() => { api.getCategories().then(setCats); load(); }, []);
	useEffect(() => { load(); }, [q, categoryId, assignedTo]);

	const getCategoryName = (id) => (cats.find(c => c.id === id) || {}).name || 'N/A';
	const getConditionColor = (status) => {
		if (status === 'Asset in use') return '#107c10';
		if (status === 'Assets in Storage') return '#ff8c00';
		if (status === 'Assets under repair') return '#ff7630';
		return '#666';
	};

	return (
		<div className={styles.container}>
			<h2>Asset Inventory</h2>
			<div className={styles.controls}>
				<input placeholder="🔍 Search assets..." value={q} onChange={e => setQ(e.target.value)} style={{flex:1, minWidth:'150px'}} />
				<select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
					<option value="">All Categories</option>
					{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
				</select>
				<input placeholder="Assigned To" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} style={{minWidth:'120px'}} />
				<Link to="/assets/new" className={styles.addBtn}>+ Add Asset</Link>
			</div>

			{selectedAsset && (
				<div className={styles.detailPanel}>
					<div className={styles.detailHeader}>
						<h3>{selectedAsset.asset_name} - {selectedAsset.id}</h3>
						<button onClick={() => setSelectedAsset(null)} className={styles.closeBtn}>✕</button>
					</div>
					<div className={styles.detailGrid}>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Category:</span>
							<span>{getCategoryName(selectedAsset.categoryId)}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Brand/Model:</span>
							<span>{selectedAsset.brand_model}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Serial/Reg No.:</span>
							<span>{selectedAsset.serial_number || selectedAsset.registration_number}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Purchase Date:</span>
							<span>{selectedAsset.purchase_date}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Cost (RM):</span>
							<span>RM {selectedAsset.cost_rm?.toLocaleString('en-MY', { minimumFractionDigits:2 })}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Location:</span>
							<span>{selectedAsset.location_department}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Assigned To:</span>
							<span>{selectedAsset.assigned_to}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Condition:</span>
							<span style={{ color: getConditionColor(selectedAsset.condition_status), fontWeight: 600 }}>{selectedAsset.condition_status}</span>
						</div>
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Remarks:</span>
							<span>{selectedAsset.remarks || 'N/A'}</span>
						</div>
					</div>
					<div style={{marginTop:12, display:'flex', gap:8}}>
						<Link to={`/assets/${selectedAsset.id}/edit`} className={styles.editBtnSmall}>Edit</Link>
						<button onClick={() => setSelectedAsset(null)} className={styles.cancelBtn}>Close</button>
					</div>
				</div>
			)}

			<div className={styles.tableWrapper}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>No</th>
							<th>Asset Name</th>
							<th>Category</th>
							<th>Brand/Model</th>
							<th>Serial/Reg No.</th>
							<th>Purchase Date</th>
							<th>Cost (RM)</th>
							<th>Location</th>
							<th>Assign To</th>
							<th>Condition</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{assets.length === 0 ? (
							<tr><td colSpan="11" style={{textAlign:'center', padding:'20px', color:'#999'}}>No assets found</td></tr>
						) : assets.map((a, i) => (
							<tr key={a.id}>
								<td>{i+1}</td>
								<td>{a.asset_name}</td>
								<td>{getCategoryName(a.categoryId)}</td>
								<td>{a.brand_model}</td>
								<td>{a.serial_number || a.registration_number}</td>
								<td>{a.purchase_date}</td>
								<td>RM {a.cost_rm?.toLocaleString('en-MY', { minimumFractionDigits:2 })}</td>
								<td>{a.location_department}</td>
								<td>{a.assigned_to}</td>
								<td><span style={{ color: getConditionColor(a.condition_status), fontWeight: 600 }}>{a.condition_status}</span></td>
								<td>
									<button onClick={() => setSelectedAsset(a)} className={styles.viewBtn}>View</button>
									<Link to={`/assets/${a.id}/edit`} className={styles.editLink}>Edit</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
