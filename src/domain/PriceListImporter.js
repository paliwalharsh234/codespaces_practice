export class PriceListImporter {
  import(rows) {
    if (!Array.isArray(rows)) {
      throw new Error('Price list must be an array');
    }

    const prices = [];
    const rejected = [];
    const duplicates = [];
    const seenNames = new Set();

    rows.forEach((row, index) => {
      const name = typeof row?.name === 'string' ? row.name.trim() : '';
      const reason = this.rejectionReason(name, row?.price);

      if (reason) {
        rejected.push({ row: index + 1, name, price: row?.price, reason });
        return;
      }

      const normalizedName = this.titleCase(name);
      const key = normalizedName.toLowerCase();
      if (seenNames.has(key)) {
        duplicates.push(name);
        return;
      }

      seenNames.add(key);
      prices.push({ name: normalizedName, pricePaisa: this.toPaisa(row.price) });
    });

    return {
      prices,
      rejected,
      duplicates,
      report: {
        imported: prices.length,
        deDuplicated: duplicates.length,
        rejected: rejected.length
      }
    };
  }

  rejectionReason(name, price) {
    if (!name) return 'blank name';
    if (price === null || price === undefined || (typeof price === 'string' && price.trim() === '')) {
      return 'blank price';
    }
    if (this.isNegative(price)) return 'negative price';
    if (this.toPaisaOrNull(price) === null) return 'invalid price';
    return null;
  }

  isNegative(price) {
    return /^\s*(?:₹|rs\.?|inr)?\s*-/.test(String(price).toLowerCase());
  }

  toPaisa(price) {
    const paisa = this.toPaisaOrNull(price);
    if (paisa === null) throw new Error('Invalid price');
    return paisa;
  }

  toPaisaOrNull(price) {
    if (typeof price === 'number') {
      return Number.isFinite(price) && price >= 0 ? Math.round(price * 100) : null;
    }

    if (typeof price !== 'string') return null;
    const cleaned = price.trim().replace(/,/g, '').replace(/₹/g, '').replace(/\b(?:rs\.?|inr)\b/gi, '').trim();
    if (!/^\d+(?:\.\d{1,2})?$/.test(cleaned)) return null;
    return Math.round(Number(cleaned) * 100);
  }

  titleCase(name) {
    return name.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
}
