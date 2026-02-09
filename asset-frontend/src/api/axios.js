const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

const categories = [
	{ id: 1, name: 'IT & Electronic Equipment', key: 'ITE' },
	{ id: 2, name: 'Office Furniture', key: 'OFF' },
	{ id: 3, name: 'Office Equipment', key: 'OFE' },
	{ id: 4, name: 'Security & Facilities', key: 'SEC' },
	{ id: 5, name: 'Pantry Equipment', key: 'PAN' },
	{ id: 6, name: 'Vehicle', key: 'VEH' },
	{ id: 7, name: 'Stationery & Supplies', key: 'STA' },
	{ id: 8, name: 'Miscellaneous', key: 'MIS' }
];

const subcategories = [
	{ id: 1, categoryId: 6, name: 'Car' },
	{ id: 2, categoryId: 6, name: 'Van' },
	{ id: 3, categoryId: 6, name: 'Motorcycle' },
	{ id: 4, categoryId: 6, name: 'Lorry' },
	{ id: 5, categoryId: 6, name: 'Bus' },
	{ id: 6, categoryId: 1, name: 'Laptop' },
	{ id: 7, categoryId: 1, name: 'Desktop' },
	{ id: 8, categoryId: 7, name: 'Staples' },
	{ id: 9, categoryId: 7, name: 'Paper Shredder' },
	{ id: 10, categoryId: 8, name: 'Company Mobile Phone' }
];

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
		return subcategories.filter(s => s.categoryId === Number(categoryId));
	},

	async getAssets({ q = '', categoryId = '', assignedTo = '' } = {}) {
		await delay();
		let res = assets.slice();
		if (categoryId) res = res.filter(a => String(a.categoryId) === String(categoryId));
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
		return assets.find(a => a.id === id);
	},

	async createAsset(payload) {
		await delay();
		const idx = assets.length + 1;
		const prefix = (categories.find(c => c.id === Number(payload.categoryId))?.key || 'GEN') + '-' +
			(subcategories.find(s => s.id === Number(payload.subcategoryId))?.name.toUpperCase().slice(0,3) || 'XXX');
		const id = `${prefix}-${String(idx).padStart(3, '0')}`;
		const item = { id, ...payload };
		assets.push(item);
		return item;
	},

	async updateAsset(id, payload) {
		await delay();
		const i = assets.findIndex(a => a.id === id);
		if (i === -1) throw new Error('Not found');
		assets[i] = { ...assets[i], ...payload };
		return assets[i];
	},

	async getSummary() {
		await delay();
		const byCat = {};
		for (const a of assets) {
			const cat = categories.find(c => c.id === a.categoryId)?.name || 'Unknown';
			const key = `${cat}||${a.asset_name}`;
			byCat[key] = byCat[key] || { category: cat, asset_name: a.asset_name, total: 0, assigned: 0 };
			byCat[key].total += 1;
			if ((a.condition_status || '').toLowerCase().includes('in use')) byCat[key].assigned += 1;
		}
		return Object.values(byCat);
	}
};

export default api;
