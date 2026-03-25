import React from 'react';
import GenericView from './GenericView';
import VehicleView from './VehicleView';

/**
 * ViewFactory Component
 * 
 * Routes to the appropriate view based on category
 * Supports category-specific views or falls back to GenericView
 */

const viewConfigs = {
	1: { name: 'Office Technology & Infrastructure', icon: '💻', color: '#4CAF50', component: GenericView },
	2: { name: 'Furniture', icon: '🪑', color: '#FF9800', component: GenericView },
	5: { name: 'Pantry Stock', icon: '☕', color: '#9C27B0', component: GenericView },
	6: { name: 'Vehicles', icon: '🚗', color: '#FF5722', component: VehicleView }, // Custom view
	7: { name: 'Office Stationery Stock', icon: '📎', color: '#00BCD4', component: GenericView },
	8: { name: 'Merchandise Stock', icon: '📦', color: '#607D8B', component: GenericView },
	9: { name: 'Gift Stock', icon: '🎁', color: '#8E44AD', component: GenericView }
};

export default function ViewFactory({ categoryId }) {
	const config = viewConfigs[categoryId];

	if (!config) {
		return <div>Category not found</div>;
	}

	const SelectedView = config.component;

	// For VehicleView, it's self-contained
	if (categoryId === 6) {
		return <SelectedView />;
	}

	// For other categories, use GenericView with config
	return (
		<SelectedView
			categoryId={categoryId}
			categoryName={config.name}
			categoryIcon={config.icon}
			categoryColor={config.color}
		/>
	);
}

