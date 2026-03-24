import React, { useEffect, useState, useCallback } from 'react';
import api from '../../../api/axios';
import { Link } from 'react-router-dom';
import styles from './AssetTable.module.css';
import {
	ASSET_CATEGORY_IDS,
	STOCK_CATEGORY_IDS,
	isStockCategory
} from '../config/categoryMasters';

export default function AssetTable({ mode = 'asset' }) {
	const [assets, setAssets] = useState([]);
	const [cats, setCats] = useState([]);
	const [q, setQ] = useState('');
	const [categoryId, setCategoryId] = useState('');
	const [assignedTo, setAssignedTo] = useState('');
	const [selectedAsset, setSelectedAsset] = useState(null);
	const [collapsedCategories, setCollapsedCategories] = useState({});
	const isStockMode = mode === 'stock';
	const allowedCategoryIds = isStockMode ? STOCK_CATEGORY_IDS : ASSET_CATEGORY_IDS;
	const addRoute = `/assets/new?mode=${isStockMode ? 'stock' : 'asset'}`;
	const pageTitle = isStockMode ? 'Office Stock Inventory' : 'Office Assets Register';

	const load = useCallback(async () => {
		const result = await api.getAssets({ q, categoryId, assignedTo });
		setAssets(result.filter(asset => allowedCategoryIds.includes(Number(asset.categoryId))));
	}, [q, categoryId, assignedTo, allowedCategoryIds]);

	useEffect(() => {
		api.getCategories().then(result => {
			setCats(result.filter(category => allowedCategoryIds.includes(Number(category.id))));
		});
		load();
	}, [load, allowedCategoryIds]);

	const getCategoryName = (id) => {
		const found = cats.find(c => Number(c.id) === Number(id));
		return found ? found.name : 'Unknown';
	};
	const getConditionColor = (status) => {
		if (status === 'Asset in use') return '#107c10';
		if (status === 'Assets in Storage') return '#ff8c00';
		if (status === 'Assets under repair') return '#ff7630';
		return '#666';
	};

	// Group assets by category
	const groupedAssets = assets.reduce((acc, asset) => {
		const catId = asset.categoryId;
		if (!acc[catId]) acc[catId] = [];
		acc[catId].push(asset);
		return acc;
	}, {});

	const toggleCategory = (catId) => {
		setCollapsedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
	};

	const renderStockTable = (categoryAssets) => (
		<div className={styles.tableWrapper}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>No</th>
						<th>Date</th>
						<th>Name</th>
						<th>Description</th>
						<th>Opening Stock</th>
						<th>Received Stock</th>
						<th>Price/Unit (RM)</th>
						<th>Total Price (RM)</th>
						<th>Issue Stock</th>
						<th>Closing Stock</th>
						<th>Issued To</th>
						<th>Remarks</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{categoryAssets.map((a, i) => (
						<tr key={a.id}>
							<td>{i+1}</td>
							<td>{a.purchase_date}</td>
							<td>{a.asset_name}</td>
							<td>{a.description || '-'}</td>
							<td>{a.opening_stock || 0}</td>
							<td>{a.received_stock || 0}</td>
							<td>RM {(a.price_unit || 0).toFixed(2)}</td>
							<td>RM {(a.total_price || 0).toFixed(2)}</td>
							<td>{a.issue_stock || 0}</td>
							<td>{a.closing_stock || 0}</td>
							<td>{a.issued_to || '-'}</td>
							<td>{a.remarks || '-'}</td>
							<td>
								<button onClick={() => setSelectedAsset(a)} className={styles.viewBtn}>View</button>
								<Link to={`/assets/${a.id}/edit?mode=stock`} className={styles.editLink}>Edit</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);

	const renderAssetTable = (categoryAssets) => (
		<div className={styles.tableWrapper}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>No</th>
						<th>Asset Name</th>
						<th>Brand/Model</th>
						<th>Serial/Reg No.</th>
						<th>Purchase Date</th>
						<th>Cost (RM)</th>
						<th>Location</th>
						<th>Assigned To</th>
						<th>Condition</th>
						<th>Remarks</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{categoryAssets.map((a, i) => (
						<tr key={a.id}>
							<td>{i+1}</td>
							<td>{a.asset_name}</td>
							<td>{a.brand_model || '-'}</td>
							<td>{a.serial_number || '-'}</td>
							<td>{a.purchase_date}</td>
							<td>RM {(a.cost_rm || 0).toLocaleString('en-MY', { minimumFractionDigits:2 })}</td>
							<td>{a.location_department || '-'}</td>
							<td>{a.assigned_to || '-'}</td>
							<td><span style={{ color: getConditionColor(a.condition_status), fontWeight: 600 }}>{a.condition_status}</span></td>
							<td>{a.remarks || '-'}</td>
							<td>
								<button onClick={() => setSelectedAsset(a)} className={styles.viewBtn}>View</button>
								<Link to={`/assets/${a.id}/edit?mode=asset`} className={styles.editLink}>Edit</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);

	return (
		<div className={styles.container}>
			<h2>{pageTitle}</h2>
			<div className={styles.controls}>
				<input
					placeholder={isStockMode ? '🔍 Search stock items...' : '🔍 Search assets...'}
					value={q}
					onChange={e => setQ(e.target.value)}
					style={{flex:1, minWidth:'150px'}}
				/>
				<select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
					<option value="">All Categories</option>
					{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
				</select>
				<input placeholder="Assigned To" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} style={{minWidth:'120px'}} />
				<Link to={addRoute} className={styles.addBtn}>{isStockMode ? '+ Add Stock Item' : '+ Add Asset'}</Link>
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
						{isStockCategory(selectedAsset.categoryId) ? (
							<>
								<div className={styles.detailRow}>
									<span className={styles.detailLabel}>Date:</span>
									<span>{selectedAsset.purchase_date}</span>
								</div>
								<div className={styles.detailRow}>
									<span className={styles.detailLabel}>Description:</span>
									<span>{selectedAsset.description || 'N/A'}</span>
								</div>
								<div className={styles.detailRow}>
									<span className={styles.detailLabel}>Opening Stock:</span>
									<span>{selectedAsset.opening_stock || 0} units</span>
								</div>
								<div className={styles.detailRow}>
									<span className={styles.detailLabel}>Received Stock:</span>
									<span>{selectedAsset.received_stock || 0} units</span>
								</div>
								<div className={styles.detailRow}>
									<span className={styles.detailLabel}>Price per Unit:</span>
									<span>RM {(selectedAsset.price_unit || 0).toFixed(2)}</span>
								</div>
								<div className={styles.detailRow}>
									<span className={styles.detailLabel}>Total Price:</span>
									<span>RM {(selectedAsset.total_price || 0).toFixed(2)}</span>
								</div>
								<div className={styles.detailRow}>
									<span className={styles.detailLabel}>Issue Stock:</span>
									<span>{selectedAsset.issue_stock || 0} units</span>
								</div>
								<div className={styles.detailRow}>
									<span className={styles.detailLabel}>Closing Stock:</span>
									<span>{selectedAsset.closing_stock || 0} units</span>
								</div>
								<div className={styles.detailRow}>
									<span className={styles.detailLabel}>Issued To:</span>
									<span>{selectedAsset.issued_to || 'N/A'}</span>
								</div>
							</>
						) : (
							<>
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
							</>
						)}
						<div className={styles.detailRow}>
							<span className={styles.detailLabel}>Remarks:</span>
							<span>{selectedAsset.remarks || 'N/A'}</span>
						</div>
					</div>
					<div style={{marginTop:12, display:'flex', gap:8}}>
						<Link to={`/assets/${selectedAsset.id}/edit?mode=${isStockCategory(selectedAsset.categoryId) ? 'stock' : 'asset'}`} className={styles.editBtnSmall}>Edit</Link>
						<button onClick={() => setSelectedAsset(null)} className={styles.cancelBtn}>Close</button>
					</div>
				</div>
			)}

			{assets.length === 0 ? (
				<div style={{textAlign:'center', padding:'40px', color:'#999', background:'#f9f9f9', borderRadius:'8px', marginTop:'20px'}}>
					<p style={{fontSize:'1.1em', marginBottom:'8px'}}>No assets found</p>
					<p style={{fontSize:'0.9em'}}>Try adjusting your search or filters</p>
				</div>
			) : (
				<div>
					{Object.keys(groupedAssets).sort((a, b) => parseInt(a) - parseInt(b)).map(catId => {
						const categoryAssets = groupedAssets[catId];
						const catName = getCategoryName(parseInt(catId));
						const isCollapsed = collapsedCategories[catId];
						const isStock = isStockCategory(parseInt(catId));

						return (
							<div key={catId} style={{marginBottom: '30px'}}>
								<div 
									style={{
										background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										color: 'white',
										padding: '14px 20px',
										borderRadius: '8px',
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										cursor: 'pointer',
										boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
										border: '1px solid rgba(255, 255, 255, 0.15)',
										transition: 'all 0.3s ease',
										userSelect: 'none'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.35)';
										e.currentTarget.style.transform = 'translateY(-2px)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.25)';
										e.currentTarget.style.transform = 'translateY(0)';
									}}
									onClick={() => toggleCategory(catId)}
								>
									<h3 style={{margin: 0, fontSize: '1.1em', fontWeight: 600}}>
										{catName}
									</h3>
									<span style={{fontSize: '1.3em', transition: 'transform 0.2s', transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'}}>
										▼
									</span>
								</div>
								
								{!isCollapsed && (
									isStock ? renderStockTable(categoryAssets) : renderAssetTable(categoryAssets)
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

