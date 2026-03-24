-- Migration: Split mixed assets model into Office Assets and Office Stock (Inventory)
-- Target DB: MySQL 8+
-- Safe approach: Keep existing tables, create new normalized tables, then migrate data.

START TRANSACTION;

-- ============================================================
-- 1) Add major category on existing category master
-- ============================================================
ALTER TABLE asset_categories
    ADD COLUMN IF NOT EXISTS major_category ENUM('OFFICE_ASSET', 'OFFICE_STOCK') NOT NULL DEFAULT 'OFFICE_ASSET' AFTER category_name;

-- Mark current stock-like categories as OFFICE_STOCK
UPDATE asset_categories
SET major_category = 'OFFICE_STOCK'
WHERE category_name IN ('Pantry Equipment', 'Stationery & Supplies', 'Miscellaneous', 'Gift');

-- Keep all other categories as OFFICE_ASSET
UPDATE asset_categories
SET major_category = 'OFFICE_ASSET'
WHERE category_name IN ('IT & Electronic Equipment', 'Office Furniture', 'Office Equipment', 'Security & Facilities', 'Vehicle');

-- ============================================================
-- 2) New table for fixed assets (non-consumable)
-- ============================================================
CREATE TABLE IF NOT EXISTS office_assets (
    office_asset_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    legacy_asset_id INT NULL,
    asset_code VARCHAR(50) UNIQUE NOT NULL,
    category_id INT NOT NULL,
    subcategory_id INT NOT NULL,

    asset_name VARCHAR(150) NOT NULL,
    brand_model VARCHAR(150) NULL,
    serial_number VARCHAR(100) NULL,

    purchase_date DATE NOT NULL,
    acquisition_cost_rm DECIMAL(15, 2) NOT NULL DEFAULT 0,
    location_department VARCHAR(150) NULL,
    assigned_to VARCHAR(150) NULL,

    condition_status ENUM('Asset in use', 'Assets in Storage', 'Assets under repair', 'Assets disposed') NOT NULL DEFAULT 'Asset in use',
    remarks TEXT NULL,

    current_value_rm DECIMAL(15, 2) NULL,
    depreciation_rate DECIMAL(5, 2) NULL,
    last_depreciation_update DATE NULL,

    disposal_date DATE NULL,
    disposal_reason TEXT NULL,
    disposal_value_rm DECIMAL(15, 2) NULL,

    created_by INT NULL,
    updated_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES asset_categories(category_id),
    FOREIGN KEY (subcategory_id) REFERENCES asset_subcategories(subcategory_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL,

    INDEX idx_oa_asset_code (asset_code),
    INDEX idx_oa_category_id (category_id),
    INDEX idx_oa_subcategory_id (subcategory_id),
    INDEX idx_oa_condition_status (condition_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vehicle-specific details (one-to-one for vehicle asset rows)
CREATE TABLE IF NOT EXISTS office_asset_vehicle_details (
    office_asset_id BIGINT PRIMARY KEY,
    registration_number VARCHAR(100) NOT NULL,

    road_tax_start_date DATE NULL,
    road_tax_end_date DATE NULL,
    insurance_start_date DATE NULL,
    insurance_end_date DATE NULL,

    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (office_asset_id) REFERENCES office_assets(office_asset_id) ON DELETE CASCADE,
    INDEX idx_vehicle_registration_number (registration_number),
    INDEX idx_vehicle_road_tax_end_date (road_tax_end_date),
    INDEX idx_vehicle_insurance_end_date (insurance_end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3) New inventory model for office stock / consumables
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory_items (
    inventory_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    legacy_asset_id INT NULL,

    item_code VARCHAR(50) UNIQUE NOT NULL,
    category_id INT NOT NULL,
    subcategory_id INT NULL,

    item_name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    unit VARCHAR(30) NOT NULL DEFAULT 'unit',

    current_balance DECIMAL(14, 2) NOT NULL DEFAULT 0,
    reorder_level DECIMAL(14, 2) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_by INT NULL,
    updated_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES asset_categories(category_id),
    FOREIGN KEY (subcategory_id) REFERENCES asset_subcategories(subcategory_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL,

    INDEX idx_inv_category_id (category_id),
    INDEX idx_inv_subcategory_id (subcategory_id),
    INDEX idx_inv_item_name (item_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inventory_transactions (
    transaction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    inventory_item_id BIGINT NOT NULL,

    transaction_type ENUM('OPENING', 'IN', 'OUT', 'ADJUSTMENT') NOT NULL,
    quantity DECIMAL(14, 2) NOT NULL,

    unit_price_rm DECIMAL(15, 2) NULL,
    total_price_rm DECIMAL(15, 2) NULL,

    transaction_date DATE NOT NULL,
    issued_to VARCHAR(150) NULL,
    reference_no VARCHAR(100) NULL,
    remarks TEXT NULL,

    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(inventory_item_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,

    INDEX idx_itx_item_id (inventory_item_id),
    INDEX idx_itx_date (transaction_date),
    INDEX idx_itx_type (transaction_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4) Data migration from legacy assets table
-- ============================================================
-- 4A. Move fixed assets into office_assets
INSERT INTO office_assets (
    legacy_asset_id,
    asset_code,
    category_id,
    subcategory_id,
    asset_name,
    brand_model,
    serial_number,
    purchase_date,
    acquisition_cost_rm,
    location_department,
    assigned_to,
    condition_status,
    remarks,
    current_value_rm,
    depreciation_rate,
    last_depreciation_update,
    disposal_date,
    disposal_reason,
    disposal_value_rm,
    created_by,
    updated_by,
    created_at,
    updated_at
)
SELECT
    a.asset_id,
    a.asset_code,
    a.category_id,
    a.subcategory_id,
    COALESCE(ascat.subcategory_name, 'Unknown') AS asset_name,
    a.brand_model,
    COALESCE(NULLIF(a.serial_number, ''), a.registration_number),
    a.purchase_date,
    a.cost_rm,
    a.location_department,
    a.assigned_to,
    a.condition_status,
    a.remarks,
    a.current_value_rm,
    a.depreciation_rate,
    a.last_depreciation_update,
    a.disposal_date,
    a.disposal_reason,
    a.disposal_value_rm,
    a.created_by,
    a.updated_by,
    a.created_at,
    a.updated_at
FROM assets a
JOIN asset_categories ac ON ac.category_id = a.category_id
LEFT JOIN asset_subcategories ascat ON ascat.subcategory_id = a.subcategory_id
WHERE ac.major_category = 'OFFICE_ASSET';

-- 4B. Move stock-like rows into inventory_items
-- Note: legacy schema has no quantity columns. current_balance starts at 0 and should be corrected by opening transactions.
INSERT INTO inventory_items (
    legacy_asset_id,
    item_code,
    category_id,
    subcategory_id,
    item_name,
    description,
    unit,
    current_balance,
    created_by,
    updated_by,
    created_at,
    updated_at
)
SELECT
    a.asset_id,
    CONCAT('INV-', LPAD(a.asset_id, 6, '0')),
    a.category_id,
    a.subcategory_id,
    COALESCE(ascat.subcategory_name, 'Inventory Item') AS item_name,
    a.remarks,
    'unit',
    0,
    a.created_by,
    a.updated_by,
    a.created_at,
    a.updated_at
FROM assets a
JOIN asset_categories ac ON ac.category_id = a.category_id
LEFT JOIN asset_subcategories ascat ON ascat.subcategory_id = a.subcategory_id
WHERE ac.major_category = 'OFFICE_STOCK';

-- ============================================================
-- 5) Suggested compatibility views for reporting and phased rollout
-- ============================================================
CREATE OR REPLACE VIEW vw_office_asset_summary AS
SELECT
    ac.category_name AS category,
    ascat.subcategory_name AS subcategory,
    COUNT(oa.office_asset_id) AS total_assets,
    SUM(CASE WHEN oa.condition_status = 'Asset in use' THEN 1 ELSE 0 END) AS in_use,
    SUM(CASE WHEN oa.condition_status = 'Assets in Storage' THEN 1 ELSE 0 END) AS in_storage,
    SUM(CASE WHEN oa.condition_status = 'Assets under repair' THEN 1 ELSE 0 END) AS under_repair,
    SUM(CASE WHEN oa.condition_status = 'Assets disposed' THEN 1 ELSE 0 END) AS disposed
FROM office_assets oa
JOIN asset_categories ac ON ac.category_id = oa.category_id
JOIN asset_subcategories ascat ON ascat.subcategory_id = oa.subcategory_id
GROUP BY ac.category_name, ascat.subcategory_name
ORDER BY ac.category_name, ascat.subcategory_name;

CREATE OR REPLACE VIEW vw_inventory_stock_summary AS
SELECT
    ac.category_name AS category,
    COALESCE(ascat.subcategory_name, ii.item_name) AS subcategory,
    COUNT(ii.inventory_item_id) AS total_items,
    SUM(ii.current_balance) AS total_balance
FROM inventory_items ii
JOIN asset_categories ac ON ac.category_id = ii.category_id
LEFT JOIN asset_subcategories ascat ON ascat.subcategory_id = ii.subcategory_id
GROUP BY ac.category_name, COALESCE(ascat.subcategory_name, ii.item_name)
ORDER BY ac.category_name, subcategory;

COMMIT;

-- Rollback strategy:
-- 1) Drop the new tables/views if needed.
-- 2) Remove major_category from asset_categories if you want to return to legacy model.
