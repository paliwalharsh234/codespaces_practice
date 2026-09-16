import { PriceListImporter } from '../../src/domain/PriceListImporter.js';

describe('PriceListImporter', () => {
  test('normalizes prices and de-duplicates names ignoring case', () => {
    const result = new PriceListImporter().import([
      { name: 'silver', price: '₹150' },
      { name: 'SILVER', price: '150.00' },
      { name: 'Gold', price: '₹ 250.50' },
      { name: 'Recliner', price: 450 }
    ]);

    expect(result.prices).toEqual([
      { name: 'Silver', pricePaisa: 15000 },
      { name: 'Gold', pricePaisa: 25050 },
      { name: 'Recliner', pricePaisa: 45000 }
    ]);
    expect(result.report).toEqual({ imported: 3, deDuplicated: 1, rejected: 0 });
  });

  test('rejects blank names, blank prices, and negative prices', () => {
    const result = new PriceListImporter().import([
      { name: 'Silver', price: '' },
      { name: '', price: '200' },
      { name: 'Gold', price: '-50' },
      { name: 'Recliner', price: 'not money' }
    ]);

    expect(result.prices).toEqual([]);
    expect(result.report).toEqual({ imported: 0, deDuplicated: 0, rejected: 4 });
    expect(result.rejected.map((item) => item.reason)).toEqual([
      'blank price',
      'blank name',
      'negative price',
      'invalid price'
    ]);
  });

  test('reports rejected and duplicate rows separately', () => {
    const result = new PriceListImporter().import([
      { name: 'Gold', price: '250 INR' },
      { name: 'gold', price: '300' },
      { name: 'Silver', price: '₹150.25' }
    ]);

    expect(result.report).toEqual({ imported: 2, deDuplicated: 1, rejected: 0 });
    expect(result.duplicates).toEqual(['gold']);
  });
});
