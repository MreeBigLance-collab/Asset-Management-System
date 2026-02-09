-- Asset Management System Database Schema
-- MySQL Database Design

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS asset_depreciation;
DROP TABLE IF EXISTS assets;
DROP TABLE IF EXISTS asset_subcategories;
DROP TABLE IF EXISTS asset_categories;
DROP TABLE IF EXISTS users;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role ENUM('Admin', 'User') NOT NULL DEFAULT 'User',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. ASSET CATEGORIES TABLE
-- ============================================
CREATE TABLE asset_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. ASSET SUBCATEGORIES TABLE
-- ============================================
CREATE TABLE asset_subcategories (
    subcategory_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    subcategory_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES asset_categories(category_id) ON DELETE CASCADE,
    UNIQUE KEY unique_subcategory (category_id, subcategory_name),
    INDEX idx_category_id (category_id),
    INDEX idx_subcategory_name (subcategory_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. ASSETS TABLE (Main Asset Records)
-- ============================================
CREATE TABLE assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_code VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated unique code (e.g., VEH-CAR-001)
    category_id INT NOT NULL,
    subcategory_id INT NOT NULL,
    brand_model VARCHAR(150),
    serial_number VARCHAR(100),
    registration_number VARCHAR(100),
    purchase_date DATE NOT NULL,
    cost_rm DECIMAL(15, 2) NOT NULL,
    location_department VARCHAR(150),
    assigned_to VARCHAR(150),
    condition_status ENUM('Asset in use', 'Assets in Storage', 'Assets under repair', 'Assets disposed') NOT NULL DEFAULT 'Asset in use',
    remarks TEXT,
    
    -- Depreciation fields
    current_value_rm DECIMAL(15, 2), -- Updated by admin manually
    depreciation_rate DECIMAL(5, 2), -- Percentage (e.g., 10.00 for 10%)
    last_depreciation_update DATE,
    
    -- Disposal information
    disposal_date DATE NULL,
    disposal_reason TEXT NULL,
    disposal_value_rm DECIMAL(15, 2) NULL,
    
    -- Audit fields
    created_by INT,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES asset_categories(category_id),
    FOREIGN KEY (subcategory_id) REFERENCES asset_subcategories(subcategory_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL,
    
    INDEX idx_asset_code (asset_code),
    INDEX idx_category_id (category_id),
    INDEX idx_subcategory_id (subcategory_id),
    INDEX idx_condition_status (condition_status),
    INDEX idx_purchase_date (purchase_date),
    INDEX idx_assigned_to (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. ASSET DEPRECIATION HISTORY TABLE
-- ============================================
CREATE TABLE asset_depreciation (
    depreciation_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    previous_value_rm DECIMAL(15, 2) NOT NULL,
    new_value_rm DECIMAL(15, 2) NOT NULL,
    depreciation_amount_rm DECIMAL(15, 2) NOT NULL,
    depreciation_date DATE NOT NULL,
    updated_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL,
    
    INDEX idx_asset_id (asset_id),
    INDEX idx_depreciation_date (depreciation_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT INITIAL DATA
-- ============================================

-- Insert default admin user (password: admin123 - should be changed!)
-- Note: In production, this should use proper password hashing (bcrypt)
INSERT INTO users (username, password_hash, full_name, email, role) VALUES
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEZGHK', 'System Administrator', 'admin@company.com', 'Admin'),
('user1', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEZGHK', 'Regular User', 'user@company.com', 'User');

-- Insert Categories
INSERT INTO asset_categories (category_name, description) VALUES
('IT & Electronic Equipment', 'Computer and electronic devices'),
('Office Furniture', 'Desks, chairs, and office furniture'),
('Office Equipment', 'Office machines and equipment'),
('Security & Facilities', 'Security and building facilities'),
('Pantry Equipment', 'Kitchen and pantry appliances'),
('Vehicle', 'Company vehicles'),
('Stationery & Supplies', 'Office supplies and stationery'),
('Miscellaneous', 'Other company assets');

-- Insert Subcategories for IT & Electronic Equipment
INSERT INTO asset_subcategories (category_id, subcategory_name) VALUES
(1, 'Desktop'),
(1, 'Laptop'),
(1, 'iPad'),
(1, 'Tab'),
(1, 'Monitor'),
(1, 'Printer'),
(1, 'Scanner'),
(1, 'Server'),
(1, 'Router & Network Switches'),
(1, 'UPS (Uninterruptible Power Supply)'),
(1, 'External Hard Drive');

-- Insert Subcategories for Office Furniture
INSERT INTO asset_subcategories (category_id, subcategory_name) VALUES
(2, 'Office Desk'),
(2, 'Office Chair'),
(2, 'Filing Cabinet'),
(2, 'Meeting Table'),
(2, 'Discussion Table');

-- Insert Subcategories for Office Equipment
INSERT INTO asset_subcategories (category_id, subcategory_name) VALUES
(3, 'Photocopier'),
(3, 'Telephone'),
(3, 'Fax Machine'),
(3, 'Projector'),
(3, 'Whiteboard');

-- Insert Subcategories for Security & Facilities
INSERT INTO asset_subcategories (category_id, subcategory_name) VALUES
(4, 'CCTV Camera'),
(4, 'Access System'),
(4, 'Fire Extinguisher'),
(4, 'Air Conditioner');

-- Insert Subcategories for Pantry Equipment
INSERT INTO asset_subcategories (category_id, subcategory_name) VALUES
(5, 'Refrigerator'),
(5, 'Coway Machine'),
(5, 'Microwave');

-- Insert Subcategories for Vehicle
INSERT INTO asset_subcategories (category_id, subcategory_name) VALUES
(6, 'Car'),
(6, 'Van'),
(6, 'Motorcycle'),
(6, 'Lorry'),
(6, 'Bus');

-- Insert Subcategories for Stationery & Supplies
INSERT INTO asset_subcategories (category_id, subcategory_name) VALUES
(7, 'Stapler'),
(7, 'Paper Shredder'),
(7, 'Calculator');

-- Insert Subcategories for Miscellaneous
INSERT INTO asset_subcategories (category_id, subcategory_name) VALUES
(8, 'Company Mobile Phone'),
(8, 'ID Card Printer'),
(8, 'Time Attendance Device');

-- ============================================
-- SAMPLE DATA (Based on your example)
-- ============================================
INSERT INTO assets (
    asset_code, category_id, subcategory_id, brand_model, 
    serial_number, registration_number, purchase_date, cost_rm, 
    location_department, assigned_to, condition_status, remarks,
    current_value_rm, created_by
) VALUES
('VEH-CAR-001', 6, 21, 'MAZDA X8', 'SAZ100', 'SAZ100', '2023-02-15', 300000.00, 'IT Dept', 'Pn Sazlina', 'Asset in use', '9 years financial', 300000.00, 1),
('VEH-CAR-002', 6, 21, 'MAZDA X8', 'ELI888', 'ELI888', '2023-02-15', 300000.00, 'IT Dept', 'Pn Sazlina', 'Asset in use', '9 years financial', 300000.00, 1);

-- ============================================
-- USEFUL VIEWS FOR REPORTING
-- ============================================

-- View: Asset Summary by Category
CREATE OR REPLACE VIEW vw_asset_summary AS
SELECT 
    ac.category_name AS Category,
    asc.subcategory_name AS Asset_Name,
    COUNT(a.asset_id) AS Total_Units,
    SUM(CASE WHEN a.condition_status = 'Asset in use' THEN 1 ELSE 0 END) AS Assigned_Units,
    SUM(CASE WHEN a.condition_status IN ('Assets in Storage', 'Assets under repair') THEN 1 ELSE 0 END) AS Available_Units,
    SUM(CASE WHEN a.condition_status = 'Assets disposed' THEN 1 ELSE 0 END) AS Disposed_Units
FROM assets a
JOIN asset_categories ac ON a.category_id = ac.category_id
JOIN asset_subcategories asc ON a.subcategory_id = asc.subcategory_id
GROUP BY ac.category_name, asc.subcategory_name
ORDER BY ac.category_name, asc.subcategory_name;

-- View: Detailed Asset Report
CREATE OR REPLACE VIEW vw_asset_report AS
SELECT 
    a.asset_id AS No,
    asc.subcategory_name AS Asset_Name,
    ac.category_name AS Category,
    a.brand_model AS Brand_Model,
    CONCAT_WS(' / ', a.serial_number, a.registration_number) AS Serial_Registration_No,
    DATE_FORMAT(a.purchase_date, '%d/%m/%Y') AS Purchase_Date,
    FORMAT(a.cost_rm, 2) AS Cost_RM,
    a.location_department AS Location_Department,
    a.assigned_to AS Assign_To,
    a.condition_status AS Condition,
    a.remarks AS Remarks,
    FORMAT(a.current_value_rm, 2) AS Current_Value_RM,
    a.depreciation_rate AS Depreciation_Rate_Percent
FROM assets a
JOIN asset_categories ac ON a.category_id = ac.category_id
JOIN asset_subcategories asc ON a.subcategory_id = asc.subcategory_id
ORDER BY ac.category_name, asc.subcategory_name, a.purchase_date;

-- View: Asset Value Summary
CREATE OR REPLACE VIEW vw_asset_value_summary AS
SELECT 
    ac.category_name AS Category,
    COUNT(a.asset_id) AS Total_Assets,
    FORMAT(SUM(a.cost_rm), 2) AS Total_Original_Value_RM,
    FORMAT(SUM(a.current_value_rm), 2) AS Total_Current_Value_RM,
    FORMAT(SUM(a.cost_rm - COALESCE(a.current_value_rm, a.cost_rm)), 2) AS Total_Depreciation_RM
FROM assets a
JOIN asset_categories ac ON a.category_id = ac.category_id
WHERE a.condition_status != 'Assets disposed'
GROUP BY ac.category_name
ORDER BY SUM(a.cost_rm) DESC;

-- ============================================
-- STORED PROCEDURES (Optional but useful)
-- ============================================

DELIMITER //

-- Procedure: Generate Asset Code
CREATE PROCEDURE sp_generate_asset_code(
    IN p_category_id INT,
    IN p_subcategory_id INT,
    OUT p_asset_code VARCHAR(50)
)
BEGIN
    DECLARE v_category_prefix VARCHAR(10);
    DECLARE v_subcategory_prefix VARCHAR(10);
    DECLARE v_count INT;
    
    -- Get category prefix
    SELECT UPPER(LEFT(category_name, 3)) INTO v_category_prefix
    FROM asset_categories WHERE category_id = p_category_id;
    
    -- Get subcategory prefix
    SELECT UPPER(LEFT(subcategory_name, 3)) INTO v_subcategory_prefix
    FROM asset_subcategories WHERE subcategory_id = p_subcategory_id;
    
    -- Count existing assets in this subcategory
    SELECT COUNT(*) + 1 INTO v_count
    FROM assets
    WHERE category_id = p_category_id AND subcategory_id = p_subcategory_id;
    
    -- Generate code: CAT-SUB-XXX
    SET p_asset_code = CONCAT(v_category_prefix, '-', v_subcategory_prefix, '-', LPAD(v_count, 3, '0'));
END //

DELIMITER ;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
-- Additional composite indexes for common queries
CREATE INDEX idx_asset_category_status ON assets(category_id, condition_status);
CREATE INDEX idx_asset_subcategory_status ON assets(subcategory_id, condition_status);
CREATE INDEX idx_user_role_active ON users(role, is_active);
