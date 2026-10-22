import { describe, expect, it } from 'vitest';
import { canAdvanceOrderStatus, createOrder } from './order';

describe('Order business rules', () => {
  it('membuat order baru dengan valid data', () => {
    const order = createOrder('Rian', 45000, 'Diproses');
    expect(order.customerName).toBe('Rian');
    expect(order.total).toBe(45000);
    expect(order.status).toBe('Diproses');
  });

  it('gagal saat nama pelanggan kosong', () => {
    expect(() => createOrder('', 45000, 'Diproses')).toThrow('Nama pelanggan wajib diisi.');
  });

  it('gagal saat total order tidak valid', () => {
    expect(() => createOrder('Rian', 0, 'Diproses')).toThrow('Total order harus lebih dari 0.');
  });

  it('memperbolehkan status naik ke siap diambil', () => {
    expect(canAdvanceOrderStatus('Diproses')).toBe(true);
    expect(canAdvanceOrderStatus('Siap Diambil')).toBe(true);
  });

  it('tidak memperbolehkan status selesai naik ke tahap berikutnya', () => {
    expect(canAdvanceOrderStatus('Selesai')).toBe(false);
  });
});
