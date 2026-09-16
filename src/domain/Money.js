/**
 * Money value object to handle precision currency calculations in integer paisa.
 */
export class Money {
  /**
   * @param {number} paisa - Total amount in paisa (integer)
   */
  constructor(paisa = 0) {
    this.paisa = Math.round(paisa);
  }

  /**
   * Helper to create Money from Rupees (e.g. 150.50 -> 15050)
   */
  static fromRupees(rupees) {
    return new Money(Math.round(rupees * 100));
  }

  /**
   * Helper to create Money from Paisa directly
   */
  static fromPaisa(paisa) {
    return new Money(paisa);
  }

  add(other) {
    return new Money(this.paisa + other.paisa);
  }

  subtract(other) {
    return new Money(Math.max(0, this.paisa - other.paisa));
  }

  /**
   * Multiplies money by a factor and applies Math.round to maintain exact paisa.
   */
  multiply(factor) {
    return new Money(Math.round(this.paisa * factor));
  }

  /**
   * Applies a percentage and rounds to nearest paisa.
   */
  percentage(percent) {
    return new Money(Math.round((this.paisa * percent) / 100));
  }

  /**
   * Returns formatted string like "₹150.50"
   */
  toFormattedString() {
    const rupees = (this.paisa / 100).toFixed(2);
    return `₹${rupees}`;
  }

  /**
   * Returns raw float value in rupees for calculations/serialization
   */
  toRupees() {
    return this.paisa / 100;
  }
}