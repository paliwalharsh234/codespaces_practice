import { Money } from '../../src/domain/Money.js';
import { SeatTier } from '../../src/domain/SeatTier.js';

describe('SeatTier', () => {
  test('stores a tier name, price, and availability', () => {
    const tier = new SeatTier('Gold', Money.fromRupees(250), true);

    expect(tier.name).toBe('Gold');
    expect(tier.price.paisa).toBe(25000);
    expect(tier.isAvailable()).toBe(true);
  });

  test('identifies a sold-out tier as unavailable', () => {
    const tier = new SeatTier('Recliner', Money.fromRupees(450), false);

    expect(tier.isAvailable()).toBe(false);
  });

  test('rejects a missing or invalid price', () => {
    expect(() => new SeatTier('Silver', null, true)).toThrow();
    expect(() => new SeatTier('Silver', Money.fromPaisa(-1), true)).toThrow();
  });
});
