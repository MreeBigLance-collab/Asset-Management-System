import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styles from './Forms.module.css';

// Import all category forms
import VehicleForm from './VehicleForm';
import ITEquipmentForm from './ITEquipmentForm';
import OfficeFurnitureForm from './OfficeFurnitureForm';
import PantryEquipmentForm from './PantryEquipmentForm';
import StationerySuppliesForm from './StationerySuppliesForm';
import MiscellaneousForm from './MiscellaneousForm';
import GiftForm from './GiftForm';
import api from '../../../api/axios';
import {
	MAJOR_CATEGORY,
	CATEGORY_MASTERS,
	normalizeMergedAssetCategoryId
} from '../config/categoryMasters';

// Form component mapping
const formComponents = {
	1: { name: 'Office Technology & Infrastructure', component: ITEquipmentForm, icon: '💻' },
	2: { name: 'Furniture', component: OfficeFurnitureForm, icon: '🪑' },
	5: { name: 'Pantry Stock', component: PantryEquipmentForm, icon: '☕' },
	6: { name: 'Vehicles', component: VehicleForm, icon: '🚗' },
	7: { name: 'Office Stationery Stock', component: StationerySuppliesForm, icon: '📎' },
	8: { name: 'Merchandise Stock', component: MiscellaneousForm, icon: '📦' },
	9: { name: 'Gift Stock', component: GiftForm, icon: '🎁' }
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
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [loading, setLoading] = useState(false);
	const mode = searchParams.get('mode');
	const [scope, setScope] = useState(mode === 'stock' ? MAJOR_CATEGORY.STOCK : MAJOR_CATEGORY.ASSET);
	const filteredCategoryEntries = Object.entries(formComponents).filter(([categoryId]) => {
		const categoryMaster = CATEGORY_MASTERS.find(category => Number(category.id) === Number(categoryId));
		if (!categoryMaster) return false;
		return categoryMaster.majorCategory === scope;
	});
	const backRoute = `/assets?mode=${scope === MAJOR_CATEGORY.STOCK ? 'stock' : 'asset'}`;
	const selectorTitle = scope === MAJOR_CATEGORY.STOCK ? 'Select Inventory Stock Category' : 'Select Office Asset Category';
	const selectorSubtitle = scope === MAJOR_CATEGORY.STOCK
		? 'Choose the stock or inventory type you want to add'
		: 'Choose the asset type you want to add';

	const updateScope = (nextScope) => {
		setScope(nextScope);
		setSelectedCategory(null);
		setSearchParams({ mode: nextScope === MAJOR_CATEGORY.STOCK ? 'stock' : 'asset' });
	};

	useEffect(() => {
		setScope(mode === 'stock' ? MAJOR_CATEGORY.STOCK : MAJOR_CATEGORY.ASSET);
	}, [mode]);

	// Get category from URL params or props
	useEffect(() => {
		const categoryParam = searchParams.get('category');
		
		if (categoryParam) {
			const parsedCategory = normalizeMergedAssetCategoryId(parseInt(categoryParam, 10));
			const categoryMaster = CATEGORY_MASTERS.find(category => category.id === parsedCategory);
			if (categoryMaster && categoryMaster.majorCategory === scope) {
				setSelectedCategory(parsedCategory);
			}
		}

		// If editing, load asset to get its category
		if (id) {
			setLoading(true);
			api.getAssetById(id).then(asset => {
				if (asset) {
					const normalizedCategoryId = normalizeMergedAssetCategoryId(asset.categoryId);
					const categoryMaster = CATEGORY_MASTERS.find(category => category.id === normalizedCategoryId);
					if (categoryMaster) setScope(categoryMaster.majorCategory);
					setSelectedCategory(normalizedCategoryId);
				}
				setLoading(false);
			}).catch(err => {
				console.error('Error loading asset:', err);
				setLoading(false);
			});
		}
	}, [id, nav, scope, searchParams]);

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
					<h2>{selectorTitle}</h2>
					<p className={styles.selectorSubtitle}>{selectorSubtitle}</p>

					<div className={styles.scopeSwitch}>
						<button
							type="button"
							onClick={() => updateScope(MAJOR_CATEGORY.ASSET)}
							className={`${styles.scopeButton} ${scope === MAJOR_CATEGORY.ASSET ? styles.scopeButtonActive : ''}`}
						>
							Office Assets
						</button>
						<button
							type="button"
							onClick={() => updateScope(MAJOR_CATEGORY.STOCK)}
							className={`${styles.scopeButton} ${scope === MAJOR_CATEGORY.STOCK ? styles.scopeButtonActive : ''}`}
						>
							Office Stock
						</button>
					</div>
					
					<div className={styles.categoryGrid}>
						{filteredCategoryEntries.map(([categoryId, { name, icon }]) => (
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
						onClick={() => nav(backRoute)} 
						className={styles.backButton}
					>
						← Back
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
					onClick={() => nav(backRoute)}
					className={styles.submitBtn}
				>
					Back
				</button>
			</div>
		</div>
	);
}

