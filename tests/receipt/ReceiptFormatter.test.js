import { Money } from '../../src/domain/Money.js';
import { ReceiptFormatter } from '../../src/receipt/ReceiptFormatter.js';

describe('ReceiptFormatter', () => {
  test('formats every bill component line by line', () => {
    const bill = {
      subtotal: Money.fromRupees(500),
      festivalDiscount: Money.fromRupees(50),
      memberDiscount: Money.fromRupees(40),
      discountedSubtotal: Money.fromRupees(410),
      convenienceFee: Money.fromRupees(40),
      taxableAmount: Money.fromRupees(450),
      gst: Money.fromRupees(81),
      total: Money.fromRupees(531)
    };

    expect(new ReceiptFormatter().format(bill)).toBe(
      [
        'Subtotal: ₹500.00',
        'Festival discount: -₹50.00',
        'Member discount: -₹40.00',
        'Discounted subtotal: ₹410.00',
        'Convenience fee: ₹40.00',
        'Taxable amount: ₹450.00',
        'GST: ₹81.00',
        'Total: ₹531.00'
      ].join('\n')
    );
  });
});
