import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import styles from './Forms.module.css';
import { useNavigate, useParams } from 'react-router-dom';

const formatDate = d => {
	if (!d) return '';
	if (d.includes('/')) return d;
	const parts = d.split('-');
	return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

export default function OfficeEquipmentForm() {
	const { id } = useParams();
	const nav = useNavigate();
	const [model, setModel] = useState({
		categoryId: 3,
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
		if (id) {
			api.getAssetById(id).then(a => {
				if (a) {
					setModel({ ...a, categoryId: 3 });
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
				<h3>{id ? 'Edit Office Equipment' : 'Add Office Equipment'}</h3>
				<p className={styles.categoryTag}>🖨️ Office Equipment</p>
			</div>

			<div className={styles.formGroup}>
				<label>Brand / Model *</label>
				<input
					type="text"
					placeholder="e.g., Canon imageRUNNER, Epson EB-2250U"
					value={model.brand_model}
					onChange={e => setModel({ ...model, brand_model: e.target.value })}
					required
				/>
			</div>

			<div className={styles.formGroup}>
				<label>Serial Number *</label>
				<input
					type="text"
					placeholder="e.g., SN123456"
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
					placeholder="e.g., Printing Room, Reception Area"
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
					placeholder="e.g., Maintenance contract expires 15/02/2027, Color ink cartridges needed"
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
