# Home Page Objects

This directory contains the page objects and utilities for the home page functionality, organized with clear separation of concerns.

## Files

### `home.page.ts`
**Responsibility**: Main page object for home page interactions
- Navigation to the page
- Currency selection
- Destination search
- Basic UI interactions

### `grid.validator.ts`
**Responsibility**: Validation logic for grid items
- Extracts grid items from the page
- Validates grid items against API data
- Compares prices, data plans, and validity periods
- Returns validation results

### `data-clicker.ts`
**Responsibility**: Clicking data elements in the grid
- Finds and clicks "Data" elements in the grid
- Handles timeouts and errors gracefully
- Ensures grid elements are loaded before interaction

### `home.mapping.ts`
**Responsibility**: CSS selectors and mappings
- All CSS selectors for the home page
- Currency and destination mappings
- Grid-related selectors

### `index.ts`
**Responsibility**: Clean exports
- Exports all classes and utilities for easy importing

## Usage

```typescript
import { HomePage, GridValidator, DataClicker } from '@/utils/page-objects/home';

// Use in tests
const homePage = new HomePage(page);
const dataClicker = new DataClicker(page);
const gridValidator = new GridValidator(page);

await homePage.selectCurrency('EUR');
await homePage.searchYourDestination('THA');
await dataClicker.clickDataElements();
const isValid = await gridValidator.validateGridItems(apiData);
```

## Benefits of This Structure

1. **Single Responsibility**: Each class has one clear purpose
2. **Maintainability**: Easy to modify individual components
3. **Testability**: Each class can be tested independently
4. **Reusability**: Classes can be used in different test scenarios
5. **Clean Imports**: Single import statement for all home page objects 