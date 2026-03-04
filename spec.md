# Dukaan

## Current State
The ProductFormPage.tsx has a category dropdown and a free-text product name field. There is no product name suggestion feature.

## Requested Changes (Diff)

### Add
- A `productSuggestions.ts` data file mapping each product category to a list of common product names (e.g., "Groceries & Staples" -> ["Sugar", "Basmati Rice", "Wheat Flour", "Atta", "Maida", "Dal", "Rice", "Salt", "Mustard Oil", ...])
- When a category is selected in the Add Product form, show a horizontal scrollable row of suggested product name chips below the Product Name input
- Clicking a chip auto-fills the product name field
- Suggestions appear only when category is selected and product name field is empty or matches a suggestion
- Cover all 30 categories with relevant Indian product names

### Modify
- `ProductFormPage.tsx`: After the product name input, add a suggestions section that shows clickable chips based on the selected category

### Remove
- Nothing removed
