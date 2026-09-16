import { Money } from './Money.js';
import { SeatTier } from './SeatTier.js';

export class Booking {
  constructor(items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Booking must contain at least one seat tier');
    }

    this.items = items.map(({ tier, quantity }) => {
      if (!(tier instanceof SeatTier)) {
        throw new Error('Booking item must contain a valid seat tier');
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error('Ticket quantity must be a positive whole number');
      }

      if (!tier.isAvailable()) {
        throw new Error(`Seat tier ${tier.name} is sold out`);
      }

      return { tier, quantity };
    });
  }

  ticketCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  subtotal() {
    return this.items.reduce(
      (total, item) => total.add(item.tier.price.multiply(item.quantity)),
      Money.fromPaisa(0)
    );
  }
}
