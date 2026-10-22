export type CartItem = {
  productId: string;
  productName: string;
  unitPrice: number;
  qty: number;
};

export function addItemToCart(cart: CartItem[], item: CartItem) {
  const existing = cart.find((entry) => entry.productId === item.productId);
  if (!existing) return [...cart, { ...item, qty: Math.max(1, item.qty) }];
  return cart.map((entry) =>
    entry.productId === item.productId
      ? { ...entry, qty: entry.qty + Math.max(1, item.qty) }
      : entry
  );
}

export function updateCartQty(cart: CartItem[], productId: string, qty: number) {
  const nextQty = Math.max(0, qty);
  return cart
    .map((entry) =>
      entry.productId === productId ? { ...entry, qty: nextQty } : entry
    )
    .filter((entry) => entry.qty > 0);
}

export function getCartTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
}

export function removeItemFromCart(cart: CartItem[], productId: string) {
  return cart.filter((entry) => entry.productId !== productId);
}
