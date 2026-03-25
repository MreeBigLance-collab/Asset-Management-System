import {
	CATEGORY_MASTERS,
	SUBCATEGORY_MASTERS,
	isStockCategory,
	normalizeMergedAssetCategoryId
} from '../features/assets/config/categoryMasters';

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

const categories = CATEGORY_MASTERS;

const subcategories = SUBCATEGORY_MASTERS;

let assets = [
	{
		id: 'VEH-CAR-001',
		categoryId: 6,
		subcategoryId: 1,
		asset_name: 'Car',
		brand_model: 'MAZDA X8',
		serial_number: 'SAZ100',
		purchase_date: '15/02/2023',
		cost_rm: 300000.0,
		location_department: 'IT Dept',
		assigned_to: 'Pn Sazlina',
		condition_status: 'Asset in use',
		remarks: '9 years financial'
	},
	{
		id: 'VEH-CAR-002',
		categoryId: 6,
		subcategoryId: 1,
		asset_name: 'Car',
		brand_model: 'MAZDA X8',
		serial_number: 'ELI888',
		purchase_date: '15/02/2023',
		cost_rm: 300000.0,
		location_department: 'IT Dept',
		assigned_to: 'Pn Sazlina',
		condition_status: 'Asset in use',
		remarks: '9 years financial'
	}
];

const users = [
	{ username: 'admin', password: 'admin123', role: 'Admin' },
	{ username: 'user1', password: 'admin123', role: 'User' }
];

const api = {
	axiosInstance: { baseURL: 'http://localhost:8000' },

	async login({ username, password }) {
		await delay();
		const u = users.find(x => x.username === username && x.password === password);
		if (!u) throw new Error('Invalid credentials');
		return { username: u.username, role: u.role, token: btoa(u.username + ':' + u.role) };
	},

	async getCategories() {
		await delay();
		return categories;
	},

	async getSubcategories(categoryId) {
		await delay();
		const normalizedCategoryId = normalizeMergedAssetCategoryId(categoryId);
		return subcategories.filter(s => s.categoryId === normalizedCategoryId);
	},

	async getAssets({ q = '', categoryId = '', assignedTo = '' } = {}) {
		await delay();
		let res = assets.map(asset => ({
			...asset,
			categoryId: normalizeMergedAssetCategoryId(asset.categoryId)
		}));
		if (categoryId) {
			const normalizedCategoryId = normalizeMergedAssetCategoryId(categoryId);
			res = res.filter(a => Number(a.categoryId) === normalizedCategoryId);
		}
		if (assignedTo) res = res.filter(a => (a.assigned_to || '').toLowerCase().includes(assignedTo.toLowerCase()));
		if (q) {
			const qq = q.toLowerCase();
			res = res.filter(a =>
				(a.asset_name || '').toLowerCase().includes(qq) ||
				(a.brand_model || '').toLowerCase().includes(qq) ||
				(a.serial_number || '').toLowerCase().includes(qq)
			);
		}
		return res;
	},

	async getAssetById(id) {
		await delay();
		const item = assets.find(a => a.id === id);
		if (!item) return null;
		return {
			...item,
			categoryId: normalizeMergedAssetCategoryId(item.categoryId)
		};
	},

	async createAsset(payload) {
		await delay();
		const normalizedCategoryId = normalizeMergedAssetCategoryId(payload.categoryId);
		const normalizedPayload = {
			...payload,
			categoryId: normalizedCategoryId
		};
		const idx = assets.length + 1;
		const prefix = (categories.find(c => c.id === Number(normalizedPayload.categoryId))?.key || 'GEN') + '-' +
			(subcategories.find(s => s.id === Number(normalizedPayload.subcategoryId))?.name.toUpperCase().slice(0,3) || 'XXX');
		const id = `${prefix}-${String(idx).padStart(3, '0')}`;
		const item = { id, ...normalizedPayload };
		assets.push(item);
		return item;
	},

	async updateAsset(id, payload) {
		await delay();
		const i = assets.findIndex(a => a.id === id);
		if (i === -1) throw new Error('Not found');
		assets[i] = {
			...assets[i],
			...payload,
			categoryId: normalizeMergedAssetCategoryId(payload.categoryId ?? assets[i].categoryId)
		};
		return assets[i];
	},

	async getSummary() {
		await delay();
		const byCat = {};
		
		for (const a of assets) {
			const cat = categories.find(c => c.id === a.categoryId)?.name || 'Unknown';
			const key = `${cat}||${a.asset_name}`;
			
			if (!byCat[key]) {
				byCat[key] = { 
					category: cat, 
					asset_name: a.asset_name, 
					total: 0, 
					assigned: 0, 
					available: 0, 
					maintenance: 0, 
					disposal: 0 
				};
			}
			
			if (isStockCategory(a.categoryId)) {
				// Stock-based assets: count units
				byCat[key].total += (a.closing_stock || 0);
				byCat[key].assigned += (a.issue_stock || 0);
				byCat[key].available += Math.max(0, (a.closing_stock || 0) - (a.issue_stock || 0));
			} else {
				// Traditional assets: count items
				byCat[key].total += 1;
				if (a.condition_status === 'Asset in use') byCat[key].assigned += 1;
				else if (a.condition_status === 'Assets in Storage') byCat[key].available += 1;
				else if (a.condition_status === 'Assets under repair') byCat[key].maintenance += 1;
				else if (a.condition_status === 'Assets disposed') byCat[key].disposal += 1;
			}
		}
		return Object.values(byCat);
	}
};

export default api;
