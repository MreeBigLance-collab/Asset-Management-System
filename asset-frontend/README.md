# Asset Frontend

React frontend for the Asset Management System.

## Folder Architecture

The source is organized by feature to keep related pages, components, and logic together.

```text
src/
  api/                          # Shared API client setup
  img/                          # Shared image assets
  features/
    assets/
      components/               # Asset table and dashboard widgets
      forms/                    # New/Edit forms by category
      views/                    # Category-specific listing views
      pages/                    # Asset and dashboard pages
      config/                   # Asset category/form field mapping
    auth/
      components/               # Login UI
      context/                  # Auth context/provider
      pages/                    # Login page wrapper
    home/
      pages/                    # App shell and navigation layout
  App.js                        # Route configuration
  index.js                      # App bootstrap
```

## Scripts

- `npm start` - start development server
- `npm test` - run tests
- `npm run build` - create production build
