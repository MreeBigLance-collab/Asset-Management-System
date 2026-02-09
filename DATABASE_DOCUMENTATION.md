# Asset Management System - Database Schema Documentation

## Overview
This MySQL database schema is designed for a comprehensive asset management system with role-based access control, depreciation tracking, and detailed reporting capabilities.

## Database Tables

### 1. **users**
Manages user authentication and authorization.

**Key Fields:**
- `user_id`: Primary key
- `username`: Unique login identifier
- `password_hash`: Encrypted password (use bcrypt)
- `role`: ENUM('Admin', 'User')
- `is_active`: Account status

**Default Users:**
- Username: `admin`, Password: `admin123` (Role: Admin)
- Username: `user1`, Password: `admin123` (Role: User)
- **⚠️ Change these passwords immediately in production!**

---

### 2. **asset_categories**
Defines the 8 main asset categories.

**Categories:**
1. IT & Electronic Equipment
2. Office Furniture
3. Office Equipment
4. Security & Facilities
5. Pantry Equipment
6. Vehicle
7. Stationery & Supplies
8. Miscellaneous

---

### 3. **asset_subcategories**
Stores subcategories (asset types) under each category.

**Examples:**
- Category: Vehicle → Subcategories: Car, Van, Motorcycle, Lorry, Bus
- Category: IT Equipment → Subcategories: Desktop, Laptop, iPad, etc.

**Total Subcategories:** 38 predefined types

---

### 4. **assets** (Main Table)
Core table storing all asset records.

**Key Fields:**
- `asset_code`: Auto-generated unique identifier (e.g., VEH-CAR-001)
- `category_id` & `subcategory_id`: Foreign keys
- `brand_model`: Text field for brand/model info
- `serial_number` & `registration_number`: Asset identification
- `purchase_date`: Date of purchase
- `cost_rm`: Original purchase cost in RM
- `location_department`: Where the asset is located
- `assigned_to`: Person/department using the asset
- `condition_status`: ENUM values:
  - `Asset in use`
  - `Assets in Storage`
  - `Assets under repair`
  - `Assets disposed`
- `remarks`: Additional notes

**Depreciation Fields:**
- `current_value_rm`: Manually updated by admin
- `depreciation_rate`: Percentage (e.g., 10.00%)
- `last_depreciation_update`: Last update date

**Disposal Fields:**
- `disposal_date`: When asset was disposed
- `disposal_reason`: Why it was disposed
- `disposal_value_rm`: Disposal/salvage value

**Audit Fields:**
- `created_by` & `updated_by`: Track who made changes
- `created_at` & `updated_at`: Timestamps

---

### 5. **asset_depreciation**
Tracks depreciation history for audit trail.

**Purpose:**
- Records every depreciation update
- Maintains historical values
- Links to user who made the update

---

## Database Views (For Reporting)

### 1. **vw_asset_summary**
Provides the summary dashboard data.

**Columns:**
- Category
- Asset_Name (subcategory)
- Total_Units
- Assigned_Units (in use)
- Available_Units (in storage or under repair)
- Disposed_Units

**Usage Example:**
```sql
SELECT * FROM vw_asset_summary;
```

---

### 2. **vw_asset_report**
Detailed asset report matching your Excel format.

**Columns:**
- No, Asset_Name, Category, Brand_Model
- Serial_Registration_No (combined)
- Purchase_Date (formatted as DD/MM/YYYY)
- Cost_RM, Location_Department, Assign_To
- Condition, Remarks
- Current_Value_RM, Depreciation_Rate_Percent

**Usage Example:**
```sql
SELECT * FROM vw_asset_report WHERE Category = 'Vehicle';
```

---

### 3. **vw_asset_value_summary**
Financial summary by category.

**Columns:**
- Category
- Total_Assets
- Total_Original_Value_RM
- Total_Current_Value_RM
- Total_Depreciation_RM

---

## Stored Procedures

### **sp_generate_asset_code**
Auto-generates unique asset codes.

**Format:** `CATEGORY-SUBCATEGORY-NUMBER`
**Example:** `VEH-CAR-001`, `ITE-LAP-045`

**Usage:**
```sql
CALL sp_generate_asset_code(6, 21, @new_code);
SELECT @new_code;
```

---

## Setup Instructions

### Step 1: Create Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE asset_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE asset_management;
```

### Step 2: Import Schema
```bash
mysql -u root -p asset_management < database_schema.sql
```

### Step 3: Verify Installation
```sql
-- Check tables
SHOW TABLES;

-- Check sample data
SELECT * FROM vw_asset_summary;
SELECT * FROM vw_asset_report;
```

### Step 4: Create Database User (Optional but Recommended)
```sql
CREATE USER 'asset_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON asset_management.* TO 'asset_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## Key Features

### ✅ Role-Based Access Control
- **Admin**: Full CRUD, depreciation updates, disposal, all reports
- **User**: Add new assets only, view reports, cannot edit cost fields

### ✅ Asset Code Generation
- Automatic unique code generation using stored procedure
- Format: Category prefix + Subcategory prefix + Sequential number

### ✅ Depreciation Tracking
- Manual entry by admin
- Historical tracking in separate table
- Audit trail maintained

### ✅ Condition Status Tracking
- Asset in use
- Assets in Storage
- Assets under repair
- Assets disposed

### ✅ Reporting Views
- Pre-built views for dashboards
- Summary reports by category
- Detailed asset listings
- Financial value summaries

### ✅ Audit Trail
- Track who created/updated records
- Timestamp all changes
- Depreciation history maintained

---

## Sample Queries for Dashboard

### Get Total Assets by Category
```sql
SELECT 
    Category,
    SUM(Total_Units) as Total_Assets,
    SUM(Assigned_Units) as In_Use,
    SUM(Available_Units) as Available
FROM vw_asset_summary
GROUP BY Category;
```

### Get Assets by Condition
```sql
SELECT 
    condition_status,
    COUNT(*) as count,
    SUM(current_value_rm) as total_value
FROM assets
GROUP BY condition_status;
```

### Get Top 10 Most Valuable Assets
```sql
SELECT * FROM vw_asset_report
ORDER BY CAST(REPLACE(Cost_RM, ',', '') AS DECIMAL) DESC
LIMIT 10;
```

### Get Assets Needing Depreciation Update
```sql
SELECT 
    asset_code,
    Asset_Name,
    Category,
    last_depreciation_update,
    DATEDIFF(CURDATE(), last_depreciation_update) as days_since_update
FROM vw_asset_report
WHERE last_depreciation_update IS NOT NULL
    AND DATEDIFF(CURDATE(), last_depreciation_update) > 365
ORDER BY days_since_update DESC;
```

---

## Security Recommendations

1. **Change Default Passwords Immediately**
2. **Use Environment Variables** for database credentials
3. **Enable SSL/TLS** for database connections
4. **Regular Backups**: Set up automated daily backups
5. **Principle of Least Privilege**: Use dedicated database user with minimal permissions
6. **Input Validation**: Always validate/sanitize user inputs in FastAPI
7. **Password Hashing**: Use bcrypt with salt rounds ≥ 12

---

## Backup & Restore

### Backup
```bash
mysqldump -u root -p asset_management > backup_$(date +%Y%m%d).sql
```

### Restore
```bash
mysql -u root -p asset_management < backup_20260130.sql
```

---

## Next Steps

After database setup, you'll need to:

1. **FastAPI Backend**: Create models, CRUD operations, authentication
2. **React Frontend**: Build UI components, forms, dashboards
3. **CI/CD Pipeline**: Automate testing and deployment
4. **Dashboard/ETL**: Implement Power BI-style reporting

Would you like me to proceed with the CI/CD pipeline setup now?
