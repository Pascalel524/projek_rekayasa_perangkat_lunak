import { describe, expect, it } from 'vitest';
import { formatRupiah, validatePaymentAmount } from './payment';

describe('Payment business rules', () => {
  it('menganggap pembayaran pas sebagai transaksi berhasil', () => {
    const result = validatePaymentAmount(35000, '35000');

    expect(result.ok).toBe(true);
    expect(result.paid).toBe(35000);
    expect(result.change).toBe(0);
    expect(result.message).toContain('Uang pas');
  });

  it('menolak pembayaran yang lebih kecil dari total belanja', () => {
    const result = validatePaymentAmount(35000, '30000');

    expect(result.ok).toBe(false);
    expect(result.paid).toBe(30000);
    expect(result.change).toBe(0);
    expect(result.message).toContain('kurang');
  });

  it('menghitung kembalian ketika nominal bayar lebih besar', () => {
    const result = validatePaymentAmount(35000, '50000');

    expect(result.ok).toBe(true);
    expect(result.change).toBe(15000);
    expect(result.message).toContain('Kembalian');
  });

  it('menerima input nominal dengan format ribuan seperti 35.000', () => {
    const result = validatePaymentAmount(35000, '35.000');

    expect(result.ok).toBe(true);
    expect(result.change).toBe(0);
    expect(result.paid).toBe(35000);
  });

  it('menghasilkan format rupiah sesuai kebutuhan UI', () => {
    expect(formatRupiah(15000)).toBe('Rp 15.000');
    expect(formatRupiah(50000)).toBe('Rp 50.000');
  });
});
