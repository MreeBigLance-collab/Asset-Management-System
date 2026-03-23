import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import styles from './Forms.module.css';
import { useNavigate, useParams } from 'react-router-dom';

const formatDate = d => {
	if (!d) return '';
	if (d.includes('/')) return d;
	const parts = d.split('-');
	return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

export default function StationerySuppliesForm() {
	const { id } = useParams();
	const nav = useNavigate();
	const [model, setModel] = useState({
		categoryId: 7,
		subcategoryId: '',
		asset_name: '',
		description: '',
		opening_stock: 0,
		received_stock: 0,
		price_unit: 0,
		total_price: 0,
		issue_stock: 0,
		closing_stock: 0,
		issued_to: '',
		purchase_date: '',
		remarks: ''
	});

	useEffect(() => {
		api.getSubcategories(7).then(result => {
			if (result.length > 0) {
				setModel(prev => (prev.subcategoryId ? prev : {
					...prev,
					subcategoryId: result[0].id,
					asset_name: result[0].name
				}));
			}
		});
	}, []);

	useEffect(() => {
		if (id) {
			api.getAssetById(id).then(a => {
				if (a) {
					setModel({ ...a, categoryId: 7 });
				}
			});
		}
	}, [id]);

	const submit = async e => {
		e.preventDefault();
		const payload = { ...model };
		if (payload.purchase_date && payload.purchase_date.includes('-')) {
			payload.purchase_date = formatDate(payload.purchase_date);
		}
		payload.opening_stock = Number(payload.opening_stock || 0);
		payload.received_stock = Number(payload.received_stock || 0);
		payload.price_unit = Number(payload.price_unit || 0);
		payload.total_price = Number(((payload.received_stock || 0) * (payload.price_unit || 0)).toFixed(2));
		payload.issue_stock = Number(payload.issue_stock || 0);
		payload.closing_stock = Number(payload.opening_stock + payload.received_stock - payload.issue_stock);
		delete payload.registration_number;

		try {
			if (id) await api.updateAsset(id, payload);
			else await api.createAsset(payload);
			nav('/assets');
		} catch (err) {
			console.error('Error saving asset:', err);
			alert('Error saving asset. Please try again.');
		}
	};

	return (
		<form className={styles.form} onSubmit={submit}>
			<div className={styles.formHeader}>
				<h3>{id ? 'Edit Stationery & Supplies' : 'Add Stationery & Supplies'}</h3>
				<p className={styles.categoryTag}>📎 Stationery & Supplies</p>
			</div>

		<div className={styles.formGroup}>
				<label>Date *</label>
				<input
					type="date"
					value={model.purchase_date && model.purchase_date.includes('/') ? model.purchase_date.split('/').reverse().join('-') : model.purchase_date}
					onChange={e => setModel({ ...model, purchase_date: formatDate(e.target.value) })}
					required
				/>
			</div>

			<div className={styles.formGroup}>
				<label>Name *</label>
				<input type="text" value={model.asset_name} onChange={e => setModel({ ...model, asset_name: e.target.value })} required />
			</div>

			<div className={styles.formGroup}>
				<label>Description</label>
				<textarea placeholder="Description" value={model.description} onChange={e => setModel({ ...model, description: e.target.value })} />
			</div>

			<div className={styles.formGroup}>
				<label>Opening Stock (unit)</label>
				<input type="number" step="1" value={model.opening_stock} onChange={e => setModel({ ...model, opening_stock: Number(e.target.value) })} />
			</div>

			<div className={styles.formGroup}>
				<label>Received Stock (unit)</label>
				<input type="number" step="1" value={model.received_stock} onChange={e => setModel({ ...model, received_stock: Number(e.target.value) })} required />
			</div>

			<div className={styles.formGroup}>
				<label>Price per Unit (RM)</label>
				<input type="number" step="0.01" value={model.price_unit} onChange={e => setModel({ ...model, price_unit: e.target.value })} required />
			</div>

			<div className={styles.formGroup}>
				<label>Total Price (RM)</label>
				<input type="text" readOnly value={((Number(model.received_stock||0) * Number(model.price_unit||0))).toFixed(2)} />
			</div>

			<div className={styles.formGroup}>
				<label>Issue Stock (unit)</label>
				<input type="number" step="1" value={model.issue_stock} onChange={e => setModel({ ...model, issue_stock: Number(e.target.value) })} />
			</div>

			<div className={styles.formGroup}>
				<label>Closing Stock (unit)</label>
				<input type="text" readOnly value={(Number(model.opening_stock||0) + Number(model.received_stock||0) - Number(model.issue_stock||0))} />
			</div>

			<div className={styles.formGroup}>
				<label>Issued To</label>
				<input type="text" value={model.issued_to} onChange={e => setModel({ ...model, issued_to: e.target.value })} />
			</div>

			<div className={styles.formGroup}>
				<label>Remarks</label>
				<textarea placeholder="Remarks" value={model.remarks} onChange={e => setModel({ ...model, remarks: e.target.value })} />
			</div>

			<div className={styles.buttonGroup}>
				<button type="submit" className={styles.submitBtn}>{id ? 'Update Item' : 'Add Item'}</button>
				<button type="button" onClick={() => nav('/assets')} className={styles.cancelBtn}>Cancel</button>
			</div>
		</form>
	);
}

