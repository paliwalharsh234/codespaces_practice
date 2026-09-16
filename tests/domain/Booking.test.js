import { Money } from '../../src/domain/Money.js';
import { Booking } from '../../src/domain/Booking.js';
import { SeatTier } from '../../src/domain/SeatTier.js';

describe('Booking', () => {
  const silver = new SeatTier('Silver', Money.fromRupees(150));
  const gold = new SeatTier('Gold', Money.fromRupees(250));

  test('calculates ticket count and subtotal across seat tiers', () => {
    const booking = new Booking([
      { tier: silver, quantity: 2 },
      { tier: gold, quantity: 1 }
    ]);

    expect(booking.ticketCount()).toBe(3);
    expect(booking.subtotal().paisa).toBe(55000);
  });

  test('does not allow booking a sold-out tier', () => {
    const soldOut = new SeatTier('Recliner', Money.fromRupees(450), false);

    expect(() => new Booking([{ tier: soldOut, quantity: 1 }])).toThrow(
      'Seat tier Recliner is sold out'
    );
  });

  test('requires a positive whole-number quantity', () => {
    expect(() => new Booking([{ tier: silver, quantity: 0 }])).toThrow();
    expect(() => new Booking([{ tier: silver, quantity: 1.5 }])).toThrow();
  });
});
