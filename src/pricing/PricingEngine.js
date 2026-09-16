import { Money } from '../domain/Money.js';

export class PricingEngine {
  constructor({
    festivalDiscount,
    memberDiscountPercent,
    memberDiscountCap,
    convenienceFeePerTicket,
    gstPercent
  }) {
    if (!(festivalDiscount instanceof Money) || festivalDiscount.paisa < 0) {
      throw new Error('Festival discount must be a non-negative Money value');
    }
    if (!(memberDiscountCap instanceof Money) || memberDiscountCap.paisa < 0) {
      throw new Error('Member discount cap must be a non-negative Money value');
    }
    if (!(convenienceFeePerTicket instanceof Money) || convenienceFeePerTicket.paisa < 0) {
      throw new Error('Convenience fee must be a non-negative Money value');
    }
    if (!Number.isFinite(memberDiscountPercent) || memberDiscountPercent < 0) {
      throw new Error('Member discount percentage must be non-negative');
    }
    if (!Number.isFinite(gstPercent) || gstPercent < 0) {
      throw new Error('GST percentage must be non-negative');
    }

    this.festivalDiscount = festivalDiscount;
    this.memberDiscountPercent = memberDiscountPercent;
    this.memberDiscountCap = memberDiscountCap;
    this.convenienceFeePerTicket = convenienceFeePerTicket;
    this.gstPercent = gstPercent;
  }

  price(booking, { festival = false, member = false } = {}) {
    const subtotal = booking.subtotal();
    const festivalDiscount = festival
      ? this.minimum(this.festivalDiscount, subtotal)
      : Money.fromPaisa(0);
    const afterFestival = subtotal.subtract(festivalDiscount);
    const memberDiscount = member
      ? this.minimum(afterFestival.percentage(this.memberDiscountPercent), this.memberDiscountCap)
      : Money.fromPaisa(0);
    const discountedSubtotal = afterFestival.subtract(memberDiscount);
    const convenienceFee = this.convenienceFeePerTicket.multiply(booking.ticketCount());
    const taxableAmount = discountedSubtotal.add(convenienceFee);
    const gst = taxableAmount.percentage(this.gstPercent);

    return {
      subtotal,
      festivalDiscount,
      memberDiscount,
      discountedSubtotal,
      convenienceFee,
      taxableAmount,
      gst,
      total: taxableAmount.add(gst)
    };
  }

  minimum(firstAmount, secondAmount) {
    return firstAmount.paisa <= secondAmount.paisa ? firstAmount : secondAmount;
  }
}
