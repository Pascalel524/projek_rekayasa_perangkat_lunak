export type CartItem = {
  productId: string;
  productName: string;
  unitPrice: number;
  qty: number;
};

function normalizeQty(qty: number, min: number): number {
  if (!Number.isFinite(qty)) return min;
  return Math.max(min, Math.floor(qty));
}

export function addItemToCart(cart: CartItem[], item: CartItem) {
  const safeQty = normalizeQty(item.qty, 1);
  const existing = cart.find((entry) => entry.productId === item.productId);
  if (!existing) return [...cart, { ...item, qty: safeQty }];
  return cart.map((entry) =>
    entry.productId === item.productId
      ? { ...entry, qty: entry.qty + safeQty }
      : entry
  );
}

export function updateCartQty(cart: CartItem[], productId: string, qty: number) {
  const nextQty = normalizeQty(qty, 0);
  return cart.map((entry) =>
    entry.productId === productId ? { ...entry, qty: nextQty } : entry
  );
}

export function getCartTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
}

export function removeItemFromCart(cart: CartItem[], productId: string) {
  return cart.filter((entry) => entry.productId !== productId);
}
