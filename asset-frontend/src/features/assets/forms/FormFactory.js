import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Forms.module.css';

// Import all category forms
import VehicleForm from './VehicleForm';
import ITEquipmentForm from './ITEquipmentForm';
import OfficeFurnitureForm from './OfficeFurnitureForm';
import OfficeEquipmentForm from './OfficeEquipmentForm';
import SecurityFacilitiesForm from './SecurityFacilitiesForm';
import PantryEquipmentForm from './PantryEquipmentForm';
import StationerySuppliesForm from './StationerySuppliesForm';
import MiscellaneousForm from './MiscellaneousForm';
import GiftForm from './GiftForm';
import api from '../../../api/axios';

// Form component mapping
const formComponents = {
	1: { name: 'IT & Electronic Equipment', component: ITEquipmentForm, icon: '💻' },
	2: { name: 'Office Furniture', component: OfficeFurnitureForm, icon: '🪑' },
	3: { name: 'Office Equipment', component: OfficeEquipmentForm, icon: '🖨️' },
	4: { name: 'Security & Facilities', component: SecurityFacilitiesForm, icon: '🔒' },
	5: { name: 'Pantry Equipment', component: PantryEquipmentForm, icon: '☕' },
	6: { name: 'Vehicle', component: VehicleForm, icon: '🚗' },
	7: { name: 'Stationery & Supplies', component: StationerySuppliesForm, icon: '📎' },
	8: { name: 'Miscellaneous', component: MiscellaneousForm, icon: '📦' }
	,9: { name: 'Gift', component: GiftForm, icon: '🎁' }
};

/**
 * FormFactory Component
 * 
 * Routes to the appropriate form based on:
 * - URL parameter: /assets/new?category=6 (for new assets)
 * - Existing asset category: loads from database when editing
 * 
 * Usage:
 * - New asset with category: /assets/new?category=6
 * - New asset without category: Shows category selection
 * - Edit asset: /assets/edit/123 (loads asset and uses its category)
 */
export default function FormFactory() {
	const { id } = useParams();
	const nav = useNavigate();
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [loading, setLoading] = useState(false);

	// Get category from URL params or props
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const categoryParam = params.get('category');
		
		if (categoryParam) {
			setSelectedCategory(parseInt(categoryParam));
		}

		// If editing, load asset to get its category
		if (id) {
			setLoading(true);
			api.getAssetById(id).then(asset => {
				if (asset) {
					setSelectedCategory(asset.categoryId);
				}
				setLoading(false);
			}).catch(err => {
				console.error('Error loading asset:', err);
				setLoading(false);
			});
		}
	}, [id]);

	// Show loading state
	if (loading) {
		return (
			<div className={styles.container}>
				<div className={styles.loadingMessage}>Loading asset...</div>
			</div>
		);
	}

	// Show category selection if no category selected and not editing
	if (!selectedCategory && !id) {
		return (
			<div className={styles.container}>
				<div className={styles.categorySelector}>
					<h2>Select Asset Category</h2>
					<p className={styles.selectorSubtitle}>Choose the type of asset you want to add</p>
					
					<div className={styles.categoryGrid}>
						{Object.entries(formComponents).map(([categoryId, { name, icon }]) => (
							<button
								key={categoryId}
								className={styles.categoryButton}
								onClick={() => setSelectedCategory(parseInt(categoryId))}
								type="button"
							>
								<div className={styles.categoryIcon}>{icon}</div>
								<div className={styles.categoryButtonName}>{name}</div>
							</button>
						))}
					</div>

					<button 
						type="button"
						onClick={() => nav('/assets')} 
						className={styles.backButton}
					>
						← Back to Assets
					</button>
				</div>
			</div>
		);
	}

	// Render the appropriate form component
	if (selectedCategory && formComponents[selectedCategory]) {
		const FormComponent = formComponents[selectedCategory].component;
		return <FormComponent />;
	}

	// Fallback: show category selector
	return (
		<div className={styles.container}>
			<div className={styles.errorMessage}>
				<h3>Asset category not found</h3>
				<p>The asset category could not be determined.</p>
				<button 
					onClick={() => nav('/assets')}
					className={styles.submitBtn}
				>
					Back to Assets
				</button>
			</div>
		</div>
	);
}

