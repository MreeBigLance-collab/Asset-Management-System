import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import styles from './AddEditAsset.module.css';
import { useNavigate, useParams } from 'react-router-dom';

const formatDate = d => {
	if (!d) return '';
	// expects dd/mm/yyyy already or yyyy-mm-dd from input -> convert to dd/mm/yyyy
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
		categoryId: '', subcategoryId: '', asset_name:'', brand_model:'', serial_number:'', registration_number:'',
		purchase_date:'', cost_rm:'', location_department:'', assigned_to:'', condition_status:'Asset in use', remarks:''
	});

	useEffect(() => { api.getCategories().then(setCats); }, []);
	useEffect(() => {
		if (model.categoryId) api.getSubcategories(model.categoryId).then(setSubs);
		else setSubs([]);
	}, [model.categoryId]);

	useEffect(() => {
		if (id) api.getAssetById(id).then(a => {
			if (a) setModel({ ...a });
		});
	}, [id]);

	const submit = async e => {
		e.preventDefault();
		const payload = { ...model };
		if (payload.purchase_date && payload.purchase_date.includes('-')) payload.purchase_date = formatDate(payload.purchase_date);
		payload.cost_rm = Number(payload.cost_rm || 0);
		if (id) await api.updateAsset(id, payload);
		else await api.createAsset(payload);
		nav('/assets');
	};

	return (
		<form className={styles.form} onSubmit={submit}>
			<h3>{id ? 'Edit Asset' : 'Add Asset'}</h3>
			<select value={model.categoryId} onChange={e => { setModel({...model, categoryId: e.target.value}); }}>
				<option value="">Select Category</option>
				{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
			</select>

			<select value={model.subcategoryId} onChange={e => { setModel({...model, subcategoryId: e.target.value, asset_name: e.target.selectedOptions[0]?.text}); }}>
				<option value="">Select Asset Name</option>
				{subs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
			</select>

			<input placeholder="Brand / Model" value={model.brand_model} onChange={e=>setModel({...model, brand_model:e.target.value})} />
			<input placeholder="Serial No." value={model.serial_number} onChange={e=>setModel({...model, serial_number:e.target.value})} />
			<input placeholder="Registration No." value={model.registration_number} onChange={e=>setModel({...model, registration_number:e.target.value})} />
			{/* date input uses yyyy-mm-dd for easy pick; we store/display dd/mm/yyyy */}
			<input type="date" value={model.purchase_date && model.purchase_date.includes('/') ? model.purchase_date.split('/').reverse().join('-') : model.purchase_date} onChange={e=>setModel({...model, purchase_date: formatDate(e.target.value)})} />
			<input placeholder="Cost (RM)" value={model.cost_rm} onChange={e=>setModel({...model, cost_rm: e.target.value})} />
			<input placeholder="Location / Department" value={model.location_department} onChange={e=>setModel({...model, location_department:e.target.value})} />
			<input placeholder="Assign To" value={model.assigned_to} onChange={e=>setModel({...model, assigned_to:e.target.value})} />
			<select value={model.condition_status} onChange={e=>setModel({...model, condition_status:e.target.value})}>
				<option>Asset in use</option>
				<option>Assets in Storage</option>
				<option>Assets under repair</option>
				<option>Assets disposed</option>
			</select>
			<textarea placeholder="Remarks / Additional Info" value={model.remarks} onChange={e=>setModel({...model, remarks:e.target.value})} />
			<div style={{display:'flex',gap:8}}>
				<button type="submit">{id ? 'Save' : 'Add'}</button>
				<button type="button" onClick={()=>nav('/assets')}>Cancel</button>
			</div>
		</form>
	);
}
