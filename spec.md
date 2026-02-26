# Specification

## Summary
**Goal:** Add a global city search, extended product pricing fields, and product amenities/attributes to the Dukaan marketplace.

**Planned changes:**
- Replace the city input in ShopkeeperRegistration and ShopkeeperNetwork filter with a searchable dropdown backed by a static worldwide city dataset grouped by country.
- Extend the backend product data model with new pricing fields: MRP, wholesale price, discount percentage, and unit of measurement.
- Extend the backend product data model with amenity fields: features list, tags list, and warranty/shelf-life text.
- Update `addProduct` and `updateProduct` backend methods to accept and return all new fields, with safe defaults for existing products.
- Add a "Pricing Details" section and a "Product Amenities" section to the ProductFormPage with appropriate input fields and validation.
- Update ProductDetail page to display MRP (with strikethrough when discounted), selling price, wholesale price, discount badge, feature pills, tags, and warranty/shelf-life info.
- Update ProductCard to show a discount badge when a discount percentage is set.

**User-visible outcome:** Shopkeepers can select any city worldwide during registration and filtering. Products can be listed with detailed pricing (MRP, wholesale, discount) and amenities (features, tags, warranty), all visible to buyers on product cards and detail pages.
