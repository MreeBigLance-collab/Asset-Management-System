// Category-specific field configuration
// Defines which fields should be visible/required for each asset category

export const categoryFieldConfig = {
	// Office Technology & Infrastructure
	1: {
		name: 'Office Technology & Infrastructure',
		identifierLabel: 'Serial Number',
		identifierField: 'serial_number',
		fields: {
			brand_model: { required: true, label: 'Brand / Model' },
			serial_number: { required: true, label: 'Serial Number' },
			purchase_date: { required: true, label: 'Purchase Date' },
			cost_rm: { required: true, label: 'Cost (RM)' },
			location_department: { required: true, label: 'Location / Department' },
			assigned_to: { required: true, label: 'Assign To' },
			condition_status: { required: true, label: 'Condition Status' },
			remarks: { required: false, label: 'Remarks / Additional Info' }
		}
	},
	// Furniture
	2: {
		name: 'Furniture',
		identifierLabel: 'Serial/Reference Number',
		identifierField: 'serial_number',
		fields: {
			brand_model: { required: true, label: 'Brand / Model' },
			serial_number: { required: false, label: 'Serial/Reference Number' },
			purchase_date: { required: true, label: 'Purchase Date' },
			cost_rm: { required: true, label: 'Cost (RM)' },
			location_department: { required: true, label: 'Location / Department' },
			assigned_to: { required: false, label: 'Assign To' },
			condition_status: { required: true, label: 'Condition Status' },
			remarks: { required: false, label: 'Condition / Remarks' }
		}
	},
	// Legacy alias: Electronics & Electrical (merged into category 1)
	3: {
		name: 'Office Technology & Infrastructure',
		identifierLabel: 'Serial Number',
		identifierField: 'serial_number',
		fields: {
			brand_model: { required: true, label: 'Brand / Model' },
			serial_number: { required: true, label: 'Serial Number' },
			purchase_date: { required: true, label: 'Purchase Date' },
			cost_rm: { required: true, label: 'Cost (RM)' },
			location_department: { required: true, label: 'Location / Department' },
			assigned_to: { required: true, label: 'Assign To' },
			condition_status: { required: true, label: 'Condition Status' },
			remarks: { required: false, label: 'Remarks / Additional Info' }
		}
	},
	// Legacy alias: Security & Facilities (merged into category 1)
	4: {
		name: 'Office Technology & Infrastructure',
		identifierLabel: 'Serial Number',
		identifierField: 'serial_number',
		fields: {
			brand_model: { required: true, label: 'Brand / Model' },
			serial_number: { required: true, label: 'Serial Number' },
			purchase_date: { required: true, label: 'Purchase Date' },
			cost_rm: { required: true, label: 'Cost (RM)' },
			location_department: { required: true, label: 'Location / Department' },
			assigned_to: { required: true, label: 'Assign To' },
			condition_status: { required: true, label: 'Condition Status' },
			remarks: { required: false, label: 'Remarks / Additional Info' }
		}
	},
	// Pantry Stock
	5: {
		name: 'Pantry Stock',
		identifierLabel: 'Model/Serial Number',
		identifierField: 'serial_number',
		fields: {
			asset_name: { required: true, label: 'Name' },
			description: { required: false, label: 'Description' },
			opening_stock: { required: false, label: 'Opening Stock (unit)' },
			received_stock: { required: true, label: 'Received Stock (unit)' },
			price_unit: { required: true, label: 'Price per Unit (RM)' },
			total_price: { required: false, label: 'Total Price (RM)' },
			issue_stock: { required: false, label: 'Issue Stock (unit)' },
			closing_stock: { required: false, label: 'Closing Stock (unit)' },
			issued_to: { required: false, label: 'Issued To' },
			purchase_date: { required: true, label: 'Date' },
			remarks: { required: false, label: 'Remarks' }
		}
	},
	// Vehicles
	6: {
		name: 'Vehicles',
		identifierLabel: 'Registration Number (Plate)',
		identifierField: 'serial_number', // Use serial_number field to store registration
		fields: {
			brand_model: { required: true, label: 'Make / Model / Year' },
			serial_number: { required: true, label: 'Registration Number (Plate)' },
			purchase_date: { required: true, label: 'Registration Date' },
			cost_rm: { required: true, label: 'Cost (RM)' },
			location_department: { required: true, label: 'Current Location' },
			assigned_to: { required: true, label: 'Assigned Driver' },
			condition_status: { required: true, label: 'Condition Status' },
			remarks: { required: false, label: 'Mileage / Maintenance Notes' }
		}
	},
	// Office Stationery Stock
	7: {
		name: 'Office Stationery Stock',
		identifierLabel: 'Item Code',
		identifierField: 'serial_number',
		fields: {
			asset_name: { required: true, label: 'Name' },
			description: { required: false, label: 'Description' },
			opening_stock: { required: false, label: 'Opening Stock (unit)' },
			received_stock: { required: true, label: 'Received Stock (unit)' },
			price_unit: { required: true, label: 'Price per Unit (RM)' },
			total_price: { required: false, label: 'Total Price (RM)' },
			issue_stock: { required: false, label: 'Issue Stock (unit)' },
			closing_stock: { required: false, label: 'Closing Stock (unit)' },
			issued_to: { required: false, label: 'Issued To' },
			purchase_date: { required: true, label: 'Date' },
			remarks: { required: false, label: 'Remarks' }
		}
	},
	// Merchandise Stock
	8: {
		name: 'Merchandise Stock',
		identifierLabel: 'Serial / Reference Number',
		identifierField: 'serial_number',
		fields: {
			asset_name: { required: true, label: 'Name' },
			description: { required: false, label: 'Description' },
			opening_stock: { required: false, label: 'Opening Stock (unit)' },
			received_stock: { required: true, label: 'Received Stock (unit)' },
			price_unit: { required: true, label: 'Price per Unit (RM)' },
			total_price: { required: false, label: 'Total Price (RM)' },
			issue_stock: { required: false, label: 'Issue Stock (unit)' },
			closing_stock: { required: false, label: 'Closing Stock (unit)' },
			issued_to: { required: false, label: 'Issued To' },
			purchase_date: { required: true, label: 'Date' },
			remarks: { required: false, label: 'Remarks / Additional Info' }
		}
	},
	// Gift Stock
	9: {
		name: 'Gift Stock',
		identifierLabel: 'Reference',
		identifierField: 'serial_number',
		fields: {
			asset_name: { required: true, label: 'Name' },
			description: { required: false, label: 'Description' },
			opening_stock: { required: false, label: 'Opening Stock (unit)' },
			received_stock: { required: true, label: 'Received Stock (unit)' },
			price_unit: { required: true, label: 'Price per Unit (RM)' },
			total_price: { required: false, label: 'Total Price (RM)' },
			issue_stock: { required: false, label: 'Issue Stock (unit)' },
			closing_stock: { required: false, label: 'Closing Stock (unit)' },
			issued_to: { required: false, label: 'Issued To' },
			purchase_date: { required: true, label: 'Date' },
			remarks: { required: false, label: 'Remarks' }
		}
	}
};

// Get field config for a category
export const getFieldConfig = (categoryId) => {
	return categoryFieldConfig[categoryId] || categoryFieldConfig[8]; // Default to Miscellaneous
};

// Get field visibility based on category
export const getVisibleFields = (categoryId) => {
	const config = getFieldConfig(categoryId);
	return Object.keys(config.fields);
};

// Check if a field is required
export const isFieldRequired = (categoryId, fieldName) => {
	const config = getFieldConfig(categoryId);
	return config.fields[fieldName]?.required || false;
};

// Get field label
export const getFieldLabel = (categoryId, fieldName) => {
	const config = getFieldConfig(categoryId);
	return config.fields[fieldName]?.label || fieldName;
};

