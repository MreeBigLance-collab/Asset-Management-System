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

export default function ITEquipmentForm() {
	const { id } = useParams();
	const nav = useNavigate();
	const [subs, setSubs] = useState([]);
	const [model, setModel] = useState({
		categoryId: 1,
		subcategoryId: '',
		asset_name: '',
		brand_model: '',
		serial_number: '',
		purchase_date: '',
		cost_rm: '',
		location_department: '',
		assigned_to: '',
		condition_status: 'Asset in use',
		remarks: ''
	});

	useEffect(() => {
		api.getSubcategories(1).then(result => {
			setSubs(result);
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
					setModel({
						...a,
						serial_number: a.serial_number || '',
						categoryId: 1
					});
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
		payload.cost_rm = Number(payload.cost_rm || 0);
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
				<h3>{id ? 'Edit IT Equipment' : 'Add IT Equipment'}</h3>
				<p className={styles.categoryTag}>💻 IT & Electronic Equipment</p>
			</div>

			<div className={styles.formGroup}>
				<label>Equipment Type *</label>
				<select value={model.subcategoryId} onChange={e => {
					setModel({ ...model, subcategoryId: e.target.value, asset_name: e.target.selectedOptions[0]?.text });
				}} required>
					<option value="">Select Equipment Type</option>
					{subs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
				</select>
			</div>

			<div className={styles.formGroup}>
				<label>Brand / Model *</label>
				<input
					type="text"
					placeholder="e.g., Dell XPS 15, Apple MacBook Pro"
					value={model.brand_model}
					onChange={e => setModel({ ...model, brand_model: e.target.value })}
					required
				/>
			</div>

			<div className={styles.formGroup}>
				<label>Serial Number *</label>
				<input
					type="text"
					placeholder="e.g., ABC123456"
					value={model.serial_number}
					onChange={e => setModel({ ...model, serial_number: e.target.value })}
					required
				/>
			</div>

			<div className={styles.formGroup}>
				<label>Purchase Date *</label>
				<input
					type="date"
					value={model.purchase_date && model.purchase_date.includes('/') ? model.purchase_date.split('/').reverse().join('-') : model.purchase_date}
					onChange={e => setModel({ ...model, purchase_date: formatDate(e.target.value) })}
					required
				/>
			</div>

			<div className={styles.formGroup}>
				<label>Cost (RM) *</label>
				<input
					type="number"
					step="0.01"
					placeholder="0.00"
					value={model.cost_rm}
					onChange={e => setModel({ ...model, cost_rm: e.target.value })}
					required
				/>
			</div>

			<div className={styles.formGroup}>
				<label>Location / Department *</label>
				<input
					type="text"
					placeholder="e.g., IT Department, Office A Floor 3"
					value={model.location_department}
					onChange={e => setModel({ ...model, location_department: e.target.value })}
					required
				/>
			</div>

			<div className={styles.formGroup}>
				<label>Assigned To *</label>
				<input
					type="text"
					placeholder="User name or department"
					value={model.assigned_to}
					onChange={e => setModel({ ...model, assigned_to: e.target.value })}
					required
				/>
			</div>

			<div className={styles.formGroup}>
				<label>Condition Status *</label>
				<select value={model.condition_status} onChange={e => setModel({ ...model, condition_status: e.target.value })} required>
					<option>Asset in use</option>
					<option>Assets in Storage</option>
					<option>Assets under repair</option>
					<option>Assets disposed</option>
				</select>
			</div>

			<div className={styles.formGroup}>
				<label>Remarks / Additional Info</label>
				<textarea
					placeholder="e.g., Warranty expires 15/02/2027, Specs: 16GB RAM, 512GB SSD"
					value={model.remarks}
					onChange={e => setModel({ ...model, remarks: e.target.value })}
				/>
			</div>

			<div className={styles.buttonGroup}>
				<button type="submit" className={styles.submitBtn}>{id ? 'Update Equipment' : 'Add Equipment'}</button>
				<button type="button" onClick={() => nav('/assets')} className={styles.cancelBtn}>Cancel</button>
			</div>
		</form>
	);
}

