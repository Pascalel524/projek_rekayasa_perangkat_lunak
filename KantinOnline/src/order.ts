export type OrderStatus = 'Diproses' | 'Siap Diambil' | 'Selesai';

export type Order = {
  id: string;
  customerName: string;
  total: number;
  status: OrderStatus;
};

export function createOrder(customerName: string, total: number, status: OrderStatus): Order {
  if (!customerName.trim()) {
    throw new Error('Nama pelanggan wajib diisi.');
  }
  if (total <= 0) {
    throw new Error('Total order harus lebih dari 0.');
  }
  return {
    id: `ORD-${Date.now()}`,
    customerName: customerName.trim(),
    total,
    status,
  };
}

export function canAdvanceOrderStatus(status: OrderStatus) {
  return status === 'Diproses' || status === 'Siap Diambil';
}
