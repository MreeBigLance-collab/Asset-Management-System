export const MAJOR_CATEGORY = {
	ASSET: 'OFFICE_ASSET',
	STOCK: 'OFFICE_STOCK'
};

export const CATEGORY_MASTERS = [
	{ id: 1, name: 'Office Technology & Infrastructure', key: 'OTI', majorCategory: MAJOR_CATEGORY.ASSET },
	{ id: 2, name: 'Furniture', key: 'FUR', majorCategory: MAJOR_CATEGORY.ASSET },
	{ id: 5, name: 'Pantry Stock', key: 'PAN', majorCategory: MAJOR_CATEGORY.STOCK },
	{ id: 6, name: 'Vehicles', key: 'VEH', majorCategory: MAJOR_CATEGORY.ASSET },
	{ id: 7, name: 'Office Stationery Stock', key: 'STA', majorCategory: MAJOR_CATEGORY.STOCK },
	{ id: 8, name: 'Merchandise Stock', key: 'MER', majorCategory: MAJOR_CATEGORY.STOCK },
	{ id: 9, name: 'Gift Stock', key: 'GIF', majorCategory: MAJOR_CATEGORY.STOCK }
];

export const SUBCATEGORY_MASTERS = [
	{ id: 1, categoryId: 6, name: 'Car' },
	{ id: 2, categoryId: 6, name: 'Van' },
	{ id: 3, categoryId: 6, name: 'Motorcycle' },
	{ id: 4, categoryId: 6, name: 'Lorry' },
	{ id: 5, categoryId: 6, name: 'Bus' },
	{ id: 6, categoryId: 1, name: 'Laptop' },
	{ id: 7, categoryId: 1, name: 'Desktop' },
	{ id: 8, categoryId: 1, name: 'Monitor' },
	{ id: 9, categoryId: 1, name: 'Printer' },
	{ id: 10, categoryId: 2, name: 'Fixed Furniture (Cabinet, Hanging Cabinet)' },
	{ id: 11, categoryId: 2, name: 'Movable Furniture (Chair, Table)' },
	{ id: 12, categoryId: 1, name: 'Air Conditioner' },
	{ id: 13, categoryId: 1, name: 'Appliances' },
	{ id: 14, categoryId: 1, name: 'Electrical Equipment (Bulb, Cable)' },
	{ id: 15, categoryId: 1, name: 'CCTV' },
	{ id: 16, categoryId: 1, name: 'Access Control' },
	{ id: 17, categoryId: 5, name: 'Snacks' },
	{ id: 18, categoryId: 5, name: 'Pantry Consumables' },
	{ id: 19, categoryId: 7, name: 'Stationery Stock' },
	{ id: 20, categoryId: 8, name: 'Merchandise (Pen, Speaker, Bag)' },
	{ id: 21, categoryId: 9, name: 'Gift Set / Hamper' }
];

// Legacy support: categories 3 and 4 are merged into category 1.
const LEGACY_MERGED_ASSET_CATEGORY_IDS = [3, 4];

export const normalizeMergedAssetCategoryId = categoryId => (
	LEGACY_MERGED_ASSET_CATEGORY_IDS.includes(Number(categoryId)) ? 1 : Number(categoryId)
);

export const ASSET_CATEGORY_IDS = CATEGORY_MASTERS
	.filter(category => category.majorCategory === MAJOR_CATEGORY.ASSET)
	.map(category => category.id);

export const STOCK_CATEGORY_IDS = CATEGORY_MASTERS
	.filter(category => category.majorCategory === MAJOR_CATEGORY.STOCK)
	.map(category => category.id);

export const isStockCategory = categoryId => STOCK_CATEGORY_IDS.includes(normalizeMergedAssetCategoryId(categoryId));

export const isAssetCategory = categoryId => ASSET_CATEGORY_IDS.includes(normalizeMergedAssetCategoryId(categoryId));

export const getCategoryScopeByPathname = pathname => {
	if (pathname.includes('/office-stock')) return MAJOR_CATEGORY.STOCK;
	return MAJOR_CATEGORY.ASSET;
};

export const getListRouteByCategory = categoryId => (
	isStockCategory(categoryId) ? '/assets?mode=stock' : '/assets?mode=asset'
);
