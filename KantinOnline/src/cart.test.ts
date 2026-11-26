import { describe, expect, it } from 'vitest';
import { addItemToCart, getCartTotal, removeItemFromCart, updateCartQty } from './cart';

describe('Cart business rules', () => {
  it('menambah item baru ke keranjang', () => {
    const cart = addItemToCart([], { productId: 'p1', productName: 'Kebab', unitPrice: 15000, qty: 2 });
    expect(cart).toHaveLength(1);
    expect(cart[0].qty).toBe(2);
    expect(cart[0].unitPrice).toBe(15000);
  });

  it('menggabungkan qty item yang sama', () => {
    const cart = addItemToCart(
      [{ productId: 'p1', productName: 'Kebab', unitPrice: 15000, qty: 1 }],
      { productId: 'p1', productName: 'Kebab', unitPrice: 15000, qty: 2 }
    );

    expect(cart).toHaveLength(1);
    expect(cart[0].qty).toBe(3);
  });

  it('mencegah qty negatif saat update', () => {
    const cart = updateCartQty(
      [{ productId: 'p1', productName: 'Kebab', unitPrice: 15000, qty: 2 }],
      'p1',
      -5
    );

    expect(cart).toHaveLength(1);
    expect(cart[0].qty).toBe(0);
  });

  it('menghitung total belanja dengan benar', () => {
    const cart = [
      { productId: 'p1', productName: 'Kebab', unitPrice: 15000, qty: 2 },
      { productId: 'p2', productName: 'Jus', unitPrice: 12000, qty: 1 },
    ];
    expect(getCartTotal(cart)).toBe(42000);
  });

  it('menghapus item dari keranjang', () => {
    const cart = removeItemFromCart(
      [
        { productId: 'p1', productName: 'Kebab', unitPrice: 15000, qty: 1 },
        { productId: 'p2', productName: 'Jus', unitPrice: 12000, qty: 1 },
      ],
      'p1'
    );

    expect(cart).toHaveLength(1);
    expect(cart[0].productId).toBe('p2');
  });

  it('mencegah qty NaN atau desimal merusak kalkulasi total keranjang', () => {
    const added = addItemToCart([], {
      productId: 'p1',
      productName: 'Kebab',
      unitPrice: 15000,
      qty: Number.NaN,
    });
    expect(added[0].qty).toBe(1);
    expect(getCartTotal(added)).toBe(15000);

    const updated = updateCartQty(added, 'p1', Number.NaN);
    expect(updated[0].qty).toBe(0);
    expect(getCartTotal(updated)).toBe(0);

    const floored = updateCartQty(added, 'p1', 2.8);
    expect(floored[0].qty).toBe(2);
    expect(getCartTotal(floored)).toBe(30000);
  });
});
