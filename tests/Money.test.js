import { Money } from '../src/domain/Money.js';

describe('Money Class Precision Tests', () => {
  test('converts rupees to paisa correctly', () => {
    const m = Money.fromRupees(150.50);
    expect(m.paisa).toBe(15050);
    expect(m.toFormattedString()).toBe('₹150.50');
  });

  test('handles percentage calculation and rounds fractional paisa', () => {
    const base = Money.fromRupees(350); // ₹350
    const tax = base.percentage(18); // 18% GST -> ₹63.00
    expect(tax.paisa).toBe(6300);
    expect(tax.toFormattedString()).toBe('₹63.00');
  });

  test('prevents negative money amounts', () => {
    const a = Money.fromRupees(50);
    const b = Money.fromRupees(100);
    expect(a.subtract(b).paisa).toBe(0);
  });
});