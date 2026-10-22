export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function validatePaymentAmount(
  total: number,
  paidAmount: string | number
): { ok: boolean; paid: number; change: number; message: string } {
  const raw =
    typeof paidAmount === 'string'
      ? paidAmount.replace(/\./g, '').replace(/[^0-9-]/g, '')
      : String(paidAmount);

  const paid = Number(raw);

  if (!Number.isFinite(paid) || paid <= 0) {
    return {
      ok: false,
      paid: 0,
      change: 0,
      message: 'Nominal pembayaran wajib diisi dan harus lebih dari 0.',
    };
  }

  if (paid < total) {
    return {
      ok: false,
      paid,
      change: 0,
      message: `Nominal bayar belum cukup. Masih kurang ${formatRupiah(total - paid)}.`,
    };
  }

  return {
    ok: true,
    paid,
    change: paid - total,
    message:
      paid > total
        ? `Pembayaran berhasil. Kembalian ${formatRupiah(paid - total)}.`
        : 'Pembayaran berhasil. Uang pas.',
  };
}
