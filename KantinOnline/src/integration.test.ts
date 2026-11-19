import { describe, expect, it } from 'vitest';
import { generateOrderId, getPaymentHistoryKey, sanitizeWhatsAppNumber } from './App';

describe('Integrations & Utilities Post-Deploy Tests', () => {
  it('menormalkan nomor WhatsApp lokal yang diawali 08 menjadi format 628', () => {
    expect(sanitizeWhatsAppNumber('081234567890')).toBe('6281234567890');
    expect(sanitizeWhatsAppNumber('0812-3456-7890')).toBe('6281234567890');
    expect(sanitizeWhatsAppNumber('+62 812-3456-7890')).toBe('6281234567890');
  });

  it('mempertahankan nomor internasional yang sudah valid', () => {
    expect(sanitizeWhatsAppNumber('6281234567801')).toBe('6281234567801');
  });

  it('menghasilkan ID pesanan yang unik dan bebas bentrok (collision-free)', () => {
    const id1 = generateOrderId('store-1');
    const id2 = generateOrderId('store-1');
    expect(id1).toContain('KNT-ST1-');
    expect(id2).toContain('KNT-ST1-');
    expect(id1).not.toBe(id2);
  });

  it('mengisolasi kunci localStorage berdasarkan identifier pengguna', () => {
    const keyUser1 = getPaymentHistoryKey('usr-1', 'mhs1@student.pradita.ac.id');
    const keyUser2 = getPaymentHistoryKey('usr-2', 'mhs2@student.pradita.ac.id');
    const keyGuest = getPaymentHistoryKey(null, null);

    expect(keyUser1).toBe('kantinonline_payment_history_usr-1');
    expect(keyUser2).toBe('kantinonline_payment_history_usr-2');
    expect(keyGuest).toBe('kantinonline_payment_history_guest');
    expect(keyUser1).not.toBe(keyUser2);
  });
});
