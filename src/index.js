import { Money } from './domain/Money.js';
import { SeatTier } from './domain/SeatTier.js';
import { Booking } from './domain/Booking.js';
import { PricingEngine } from './pricing/PricingEngine.js';
import { ReceiptFormatter } from './receipt/ReceiptFormatter.js';

export function createDefaultEngine() {
  return new PricingEngine({
    festivalDiscount: Money.fromRupees(50),
    memberDiscountPercent: 10,
    memberDiscountCap: Money.fromRupees(40),
    convenienceFeePerTicket: Money.fromRupees(20),
    gstPercent: 18
  });
}

export function runDemo() {
  const gold = new SeatTier('Gold', Money.fromRupees(250));
  const booking = new Booking([{ tier: gold, quantity: 2 }]);
  const bill = createDefaultEngine().price(booking, { festival: true, member: true });

  console.log(new ReceiptFormatter().format(bill));
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file:').href) {
  runDemo();
}
