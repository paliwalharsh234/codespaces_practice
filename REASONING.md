# Reasoning

## Interpretation

The prompt describes a reusable pricing engine rather than a single movie or show. Therefore, seat prices, availability, discount rules, convenience fees, and GST are configuration inputs.

## Design Decisions

- `Money` stores integer paisa so floating-point rupee calculations cannot change the final amount.
- `SeatTier` owns tier identity, price, and availability.
- `Booking` validates positive whole-ticket quantities and rejects sold-out tiers before calculating the plain subtotal.
- `PricingEngine` applies the festival discount first, then the capped member percentage discount, then the per-ticket convenience fee, and finally GST.
- The pricing result keeps every intermediate amount so the receipt formatter does not duplicate business logic.
- `ReceiptFormatter` produces a visible line for every component, including zero-value discounts.
- `PriceListImporter` isolates messy external data from the domain model and returns both cleaned prices and an import audit report.

## Rounding

Percentage calculations round to the nearest paisa through `Money.percentage`. GST is calculated on the discounted subtotal plus convenience fees.

## Validation

The tests cover money precision, tier availability, booking validation, plain totals, discount ordering and caps, GST, and receipt output.

## Price List Import

Valid prices are normalized to integer paisa. Names are normalized to title case and compared case-insensitively. The first valid occurrence wins when names duplicate; later occurrences are reported as de-duplicated. Blank names, blank values, negatives, and unsupported formats are rejected with row numbers and reasons.
