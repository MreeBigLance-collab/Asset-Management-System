import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import styles from './AddEditAsset.module.css';
import { useNavigate, useParams } from 'react-router-dom';

const formatDate = d => {
	if (!d) return '';
	if (d.includes('/')) return d;
	const parts = d.split('-');
	return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

export default function AddEditAsset() {
	const { id } = useParams();
	const nav = useNavigate();
	const [cats, setCats] = useState([]);
	const [subs, setSubs] = useState([]);
	const [model, setModel] = useState({
		categoryId: '', subcategoryId: '', asset_name:'', brand_model:'', 
		serial_number:'', purchase_date:'', cost_rm:'', location_department:'', 
		assigned_to:'', condition_status:'Asset in use', remarks:''
	});

	useEffect(() => { api.getCategories().then(setCats); }, []);
	useEffect(() => {
		if (model.categoryId) api.getSubcategories(model.categoryId).then(setSubs);
		else setSubs([]);
	}, [model.categoryId]);

	useEffect(() => {
		if (id) api.getAssetById(id).then(a => {
			if (a) {
				// Handle both old serial_number/registration_number format
				const serialNum = a.serial_number || a.registration_number || '';
				setModel({ 
					...a, 
					serial_number: serialNum,
					registration_number: undefined // Remove old field
				});
			}
		});
	}, [id]);

	const submit = async e => {
		e.preventDefault();
		const payload = { ...model };
		if (payload.purchase_date && payload.purchase_date.includes('-')) payload.purchase_date = formatDate(payload.purchase_date);
		payload.cost_rm = Number(payload.cost_rm || 0);
		// Remove old registration_number field
		delete payload.registration_number;
		if (id) await api.updateAsset(id, payload);
		else await api.createAsset(payload);
		nav('/assets');
	};

	return (
		<form className={styles.form} onSubmit={submit}>
			<h3>{id ? 'Edit Asset' : 'Add Asset'}</h3>
			
			<div className={styles.formGroup}>
				<label>Category *</label>
				<select value={model.categoryId} onChange={e => { setModel({...model, categoryId: e.target.value}); }} required>
					<option value="">Select Category</option>
					{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
				</select>
			</div>

			<div className={styles.formGroup}>
				<label>Asset Name *</label>
				<select value={model.subcategoryId} onChange={e => { setModel({...model, subcategoryId: e.target.value, asset_name: e.target.selectedOptions[0]?.text}); }} required>
					<option value="">Select Asset Name</option>
					{subs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
				</select>
			</div>

			<div className={styles.formGroup}>
				<label>Brand / Model *</label>
				<input value={model.brand_model} onChange={e=>setModel({...model, brand_model:e.target.value})} required />
			</div>

			<div className={styles.formGroup}>
				<label>Serial / Registration No. *</label>
				<input value={model.serial_number} onChange={e=>setModel({...model, serial_number:e.target.value})} required />
			</div>

			<div className={styles.formGroup}>
				<label>Purchase Date *</label>
				<input 
					type="date" 
					value={model.purchase_date && model.purchase_date.includes('/') ? model.purchase_date.split('/').reverse().join('-') : model.purchase_date} 
					onChange={e=>setModel({...model, purchase_date: formatDate(e.target.value)})} 
					required
				/>
			</div>

			<div className={styles.formGroup}>
				<label>Cost (RM) *</label>
				<input type="number" step="0.01" value={model.cost_rm} onChange={e=>setModel({...model, cost_rm: e.target.value})} required />
			</div>

			<div className={styles.formGroup}>
				<label>Location / Department *</label>
				<input value={model.location_department} onChange={e=>setModel({...model, location_department:e.target.value})} required />
			</div>

			<div className={styles.formGroup}>
				<label>Assign To *</label>
				<input value={model.assigned_to} onChange={e=>setModel({...model, assigned_to:e.target.value})} required />
			</div>

			<div className={styles.formGroup}>
				<label>Condition Status *</label>
				<select value={model.condition_status} onChange={e=>setModel({...model, condition_status:e.target.value})} required>
					<option>Asset in use</option>
					<option>Assets in Storage</option>
					<option>Assets under repair</option>
					<option>Assets disposed</option>
				</select>
			</div>

			<div className={styles.formGroup}>
				<label>Remarks / Additional Info</label>
				<textarea value={model.remarks} onChange={e=>setModel({...model, remarks:e.target.value})} />
			</div>

			<div className={styles.buttonGroup}>
				<button type="submit">{id ? 'Save Changes' : 'Add Asset'}</button>
				<button type="button" onClick={()=>nav('/assets')} className={styles.cancelBtn}>Cancel</button>
			</div>
		</form>
	);
}
