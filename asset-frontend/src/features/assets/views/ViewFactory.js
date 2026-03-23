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
	1: { name: 'IT & Electronic Equipment', icon: '💻', color: '#4CAF50', component: GenericView },
	2: { name: 'Office Furniture', icon: '🪑', color: '#FF9800', component: GenericView },
	3: { name: 'Office Equipment', icon: '🖨️', color: '#2196F3', component: GenericView },
	4: { name: 'Security & Facilities', icon: '🔒', color: '#F44336', component: GenericView },
	5: { name: 'Pantry Equipment', icon: '☕', color: '#9C27B0', component: GenericView },
	6: { name: 'Vehicle', icon: '🚗', color: '#FF5722', component: VehicleView }, // Custom view
	7: { name: 'Stationery & Supplies', icon: '📎', color: '#00BCD4', component: GenericView },
	8: { name: 'Miscellaneous', icon: '📦', color: '#607D8B', component: GenericView }
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

