export class ReceiptFormatter {
  format(bill) {
    return [
      `Subtotal: ${bill.subtotal.toFormattedString()}`,
      `Festival discount: -${bill.festivalDiscount.toFormattedString()}`,
      `Member discount: -${bill.memberDiscount.toFormattedString()}`,
      `Discounted subtotal: ${bill.discountedSubtotal.toFormattedString()}`,
      `Convenience fee: ${bill.convenienceFee.toFormattedString()}`,
      `Taxable amount: ${bill.taxableAmount.toFormattedString()}`,
      `GST: ${bill.gst.toFormattedString()}`,
      `Total: ${bill.total.toFormattedString()}`
    ].join('\n');
  }
}
