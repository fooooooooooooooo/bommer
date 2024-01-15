export type UnitPrice = {
  quantity: number;
  price: number;
};

/**
 *
 * @param lcscPricing Pricing information from LCSC
 *
 * Example:
 * ```txt
 * Qty.	Unit Price	Ext. Price
 * 1+	US$1.6514	US$ 1.65
 * 10+	US$1.4287	US$ 14.29
 * 30+	US$1.3062	US$ 39.19
 * 100+	US$1.0803	US$ 108.03
 * 500+	US$1.0198	US$ 509.90
 * 1000+	US$0.9912	US$ 991.20
 * ```
 */
export function parseLcscPricing(lcscPricing: string): UnitPrice[] {
  const lines = lcscPricing.split('\n');
  const priceQuantity: UnitPrice[] = [];

  for (const line of lines) {
    let match = line.match(/^(\d+)\+\s+[^\d]+([\d.]+)/);

    if (match) {
      priceQuantity.push({
        quantity: parseInt(match[1]),
        price: parseFloat(match[2]),
      });
    }
  }

  return priceQuantity;
}

/**
 * @param unitPrices
 * @returns The nearest price for the given quantity
 */
export function findUnitPrice(
  unitPrices: UnitPrice[],
  quantity: number,
): {
  price: number;
  extended: number;
} {
  let price = unitPrices.sort((a, b) => b.quantity - a.quantity).find(unit => unit.quantity <= quantity)?.price;

  if (!price) {
    price = unitPrices[unitPrices.length - 1].price;
  }

  return {
    price: price!,
    extended: price! * quantity,
  };
}

export type Part = {
  id: string;
  name: string;
  unitPrices: UnitPrice[];
  quantity: number;
};
