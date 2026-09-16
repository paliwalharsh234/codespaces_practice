import { Money } from './Money.js';

export class SeatTier {
  constructor(name, price, available = true) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('Seat tier name is required');
    }

    if (!(price instanceof Money) || price.paisa < 0) {
      throw new Error('Seat tier price must be a non-negative Money value');
    }

    if (typeof available !== 'boolean') {
      throw new Error('Seat tier availability must be boolean');
    }

    this.name = name;
    this.price = price;
    this.available = available;
  }

  isAvailable() {
    return this.available;
  }
}
