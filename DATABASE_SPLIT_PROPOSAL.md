# Asset vs Inventory Split Proposal

## 1) What is currently mixed
Your current implementation mixes two different data behaviors in one model:

- Fixed assets: one record = one physical asset unit (has depreciation, condition, assignment, disposal).
- Inventory stock: one record = stock movement summary (opening/received/issued/closing).

Because both are stored as "asset", reporting and lifecycle rules are inconsistent.

## 2) Mapping from current forms
### Fixed assets (Office Asset)
Use `office_assets` table:

- ITEquipmentForm
- OfficeFurnitureForm
- OfficeEquipmentForm
- SecurityFacilitiesForm
- VehicleForm

### Stock / consumables (Office Stock)
Use `inventory_items` + `inventory_transactions` tables:

- PantryEquipmentForm
- StationerySuppliesForm
- GiftForm
- MiscellaneousForm

## 3) Recommended major category names
You asked for two major groups. Recommended naming:

1. Office Assets (Fixed Assets)
2. Office Stock (Consumables & Merchandise)

Alternative for group 1 if you want more formal finance wording:

- Capital Assets & Equipment

Alternative for group 2 if you want broader non-finance wording:

- Office Inventory & Supplies

## 4) Subcategory structure (based on your list)
## Office Assets (Fixed Assets)
### A) Equipment & Technology
- Electronics & IT
  - Laptop, Desktop, Monitor, Printer, Router, Server
- Facilities & Electrical
  - Air conditioner
  - Appliances
  - CCTV
  - Electrical equipment (light bulb, extension cable)

### B) Furniture
- Fixed furniture
  - Cabinet, hanging cabinet
- Movable furniture
  - Chair, table

### C) Vehicles
- Car, Van, Motorcycle, Lorry, Bus
- Required compliance fields:
  - road_tax_start_date
  - road_tax_end_date
  - insurance_start_date
  - insurance_end_date

## Office Stock (Consumables & Merchandise)
### A) Office Stocks
- Stationery stock
- Merchandise (pen, speaker, bag)

### B) Pantry
- Snacks

## 5) Database implementation in this workspace
A migration SQL file is prepared:

- `database_migration_split_asset_inventory.sql`

This script:

- Adds `major_category` to `asset_categories`
- Creates new fixed-asset table: `office_assets`
- Creates vehicle details table: `office_asset_vehicle_details`
- Creates inventory tables: `inventory_items`, `inventory_transactions`
- Migrates legacy rows from `assets` into new tables by `major_category`
- Adds summary views for both models

## 6) Frontend impact (next phase)
After DB migration, frontend should be split into two routes/pages:

- `/office-assets` (fixed assets only)
- `/office-stock` (inventory only)

Current `AssetTable` and `Dashboard` can then remove mixed logic (`isStockCategory`) and become clearer.

## 7) Suggested rollout
1. Run migration in staging.
2. Verify record counts by category in old vs new model.
3. Update backend API endpoints to read/write split tables.
4. Update frontend routes and form submit endpoints.
5. Keep compatibility views during transition.
