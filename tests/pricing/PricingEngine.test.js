import { Money } from '../../src/domain/Money.js';
import { Booking } from '../../src/domain/Booking.js';
import { SeatTier } from '../../src/domain/SeatTier.js';
import { PricingEngine } from '../../src/pricing/PricingEngine.js';

describe('PricingEngine', () => {
  const tier = new SeatTier('Gold', Money.fromRupees(250));
  const booking = new Booking([{ tier, quantity: 2 }]);
  const engine = new PricingEngine({
    festivalDiscount: Money.fromRupees(50),
    memberDiscountPercent: 10,
    memberDiscountCap: Money.fromRupees(40),
    convenienceFeePerTicket: Money.fromRupees(20),
    gstPercent: 18
  });

  test('calculates a plain booking total with fee and GST', () => {
    const bill = engine.price(booking);

    expect(bill.subtotal.paisa).toBe(50000);
    expect(bill.festivalDiscount.paisa).toBe(0);
    expect(bill.memberDiscount.paisa).toBe(0);
    expect(bill.convenienceFee.paisa).toBe(4000);
    expect(bill.gst.paisa).toBe(9720);
    expect(bill.total.paisa).toBe(63720);
  });

  test('applies festival then capped member discounts', () => {
    const bill = engine.price(booking, { festival: true, member: true });

    expect(bill.festivalDiscount.paisa).toBe(5000);
    expect(bill.memberDiscount.paisa).toBe(4000);
    expect(bill.gst.paisa).toBe(8100);
    expect(bill.total.paisa).toBe(53100);
  });
});
