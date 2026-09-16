# Multiplex Pricing Engine

A configurable cinema ticket pricing engine that calculates every amount in integer paisa and returns a line-by-line bill.

## Setup

```bash
npm install
```

## Run Tests

```bash
npm test -- --runInBand
```

## Run the Demo

```bash
npm start
```

The demo books two Gold tickets and applies the festival and member offers.

## Debugging

Run one focused test file while developing:

```bash
npm test -- --runInBand tests/pricing/PricingEngine.test.js
```

The pricing engine accepts configurable seat prices, discount values, discount caps, convenience fees, and GST rates. It applies discounts before the per-ticket convenience fee, then calculates GST on the discounted subtotal plus fees.

## Import a Price List

The local counter screen includes an **Import seat price list** control. Paste a JSON array containing `name` and `price` fields, for example:

```json
[
	{ "name": "silver", "price": "₹150" },
	{ "name": "GOLD", "price": "250 INR" },
	{ "name": "Recliner", "price": 450 }
]
```

The importer accepts rupee values with currency text or symbols, trims and title-cases names, de-duplicates names case-insensitively using the first valid row, and rejects blank, negative, or malformed values. The screen reports retained entries, duplicates removed, and rejected rows.