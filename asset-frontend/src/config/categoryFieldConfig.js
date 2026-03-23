// Category-specific field configuration
// Defines which fields should be visible/required for each asset category

export const categoryFieldConfig = {
	// IT & Electronic Equipment
	1: {
		name: 'IT & Electronic Equipment',
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
	// Office Furniture
	2: {
		name: 'Office Furniture',
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
	// Office Equipment
	3: {
		name: 'Office Equipment',
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
	// Security & Facilities
	4: {
		name: 'Security & Facilities',
		identifierLabel: 'Serial/Model Number',
		identifierField: 'serial_number',
		fields: {
			brand_model: { required: true, label: 'Brand / Model' },
			serial_number: { required: false, label: 'Serial/Model Number' },
			purchase_date: { required: true, label: 'Installation Date' },
			cost_rm: { required: true, label: 'Cost (RM)' },
			location_department: { required: true, label: 'Installation Location' },
			assigned_to: { required: false, label: 'Responsible Person' },
			condition_status: { required: true, label: 'Condition Status' },
			remarks: { required: false, label: 'Maintenance Notes' }
		}
	},
	// Pantry Equipment
	5: {
		name: 'Pantry Equipment',
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
	// Vehicle
	6: {
		name: 'Vehicle',
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
	// Stationery & Supplies
	7: {
		name: 'Stationery & Supplies',
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
	// Miscellaneous
	8: {
		name: 'Miscellaneous',
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
	// Gift
	9: {
		name: 'Gift',
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
