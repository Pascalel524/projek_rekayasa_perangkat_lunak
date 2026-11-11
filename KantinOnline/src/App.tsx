import React, { useEffect, useMemo, useState } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  getClient
} from './services/db';
import { formatRupiah } from './payment';

type AuthMode = 'login' | 'register';

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Store = {
  id: string;
  name: string;
  category: string;
  rating: number;
  estimate: string;
  emoji: string;
  description: string;
  owner: string;
  location: string;
  phone: string;
  qrisNmid: string;
};

type Product = {
  id: string;
  storeId: string;
  name: string;
  price: number;
  description?: string;
};

type CartItem = {
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  unitPrice: number;
  qty: number;
};

type PaymentHistoryItem = {
  id: string;
  createdAt: string;
  total: number;
  paymentMethod: string;
  storeId: string;
  storeName: string;
  storeOwner: string;
  storePhone: string;
  items: Array<{ name: string; qty: number; price: number; storeName?: string }>;
  status: 'Berhasil';
};

const emptyForm: FormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SESSION_KEY = 'kantinonline_session';
const SESSION_USER_ID_KEY = 'kantinonline_user_id';
const PAYMENT_HISTORY_KEY = 'kantinonline_payment_history';

const STORES: Store[] = [
  {
    id: 'store-1',
    name: 'Stand Kebab & Burger Middle East',
    category: 'Fast Food',
    rating: 4.8,
    estimate: '10–15 menit',
    emoji: '🌯',
    description: 'Kebab daging sapi, burger, dan hotdog dengan saus rempah khas.',
    owner: 'Pak Farhan',
    location: 'Kantin Utama - Stand #01',
    phone: '6281234567801',
    qrisNmid: 'ID1020304050601'
  },
  {
    id: 'store-2',
    name: 'Ayam Geprek Kampus',
    category: 'Ayam & Nasi',
    rating: 4.9,
    estimate: '15–20 menit',
    emoji: '🍗',
    description: 'Ayam geprek renyah dengan sambal korek pilihan level 1–10.',
    owner: 'Bu Endang',
    location: 'Kantin Utama - Stand #02',
    phone: '6281234567802',
    qrisNmid: 'ID1020304050602'
  },
  {
    id: 'store-3',
    name: 'Kedai Kopi Mahasiswa',
    category: 'Minuman & Snack',
    rating: 4.7,
    estimate: '5–10 menit',
    emoji: '☕',
    description: 'Kopi susu gula aren, toast keju leleh, dan matcha latte.',
    owner: 'Mas Dimas',
    location: 'Kantin Utama - Stand #03',
    phone: '6281234567803',
    qrisNmid: 'ID1020304050603'
  },
  {
    id: 'store-4',
    name: 'Dapur Ricebox & Bento',
    category: 'Ayam & Nasi',
    rating: 4.6,
    estimate: '10–15 menit',
    emoji: '🍱',
    description: 'Ricebox hangat topping chicken teriyaki dan beef blackpepper.',
    owner: 'Chef Rendy',
    location: 'Kantin Timur - Stand #04',
    phone: '6281234567804',
    qrisNmid: 'ID1020304050604'
  },
  {
    id: 'store-5',
    name: 'Jus Buah Segar Kampus',
    category: 'Minuman & Snack',
    rating: 4.9,
    estimate: '5–8 menit',
    emoji: '🥤',
    description: 'Aneka jus buah segar asli tanpa pemanis buatan dan es buah spesial.',
    owner: 'Mbak Dewi',
    location: 'Kantin Barat - Stand #05',
    phone: '6281234567805',
    qrisNmid: 'ID1020304050605'
  },
  {
    id: 'store-6',
    name: 'Bakso & Mie Ayam Pak Kumis',
    category: 'Mie & Bakso',
    rating: 4.7,
    estimate: '15–20 menit',
    emoji: '🍜',
    description: 'Bakso urat jumbo gurih dan mie ayam kenyal kaldu sapi mantap.',
    owner: 'Pak Slamet',
    location: 'Kantin Utama - Stand #06',
    phone: '6281234567806',
    qrisNmid: 'ID1020304050606'
  },
];

const PRODUCTS: Product[] = [
  { id: 'p-1', storeId: 'store-1', name: 'Kebab Original Beef (Large)', price: 15000, description: 'Kebab daging sapi panggang' },
  { id: 'p-2', storeId: 'store-1', name: 'Kebab Keju Mozzarella', price: 18000 },
  { id: 'p-3', storeId: 'store-1', name: 'Double Beef Burger', price: 22000 },
  { id: 'p-4', storeId: 'store-2', name: 'Nasi Ayam Geprek Sambal Korek', price: 15000 },
  { id: 'p-5', storeId: 'store-2', name: 'Nasi Ayam Geprek Keju Melt', price: 19000 },
  { id: 'p-6', storeId: 'store-3', name: 'Es Kopi Susu Aren', price: 12000 },
  { id: 'p-7', storeId: 'store-3', name: 'Roti Bakar Cokelat Keju', price: 10000 },
  { id: 'p-8', storeId: 'store-4', name: 'Ricebox Chicken Teriyaki', price: 25000 },
  { id: 'p-9', storeId: 'store-4', name: 'Ricebox Beef Blackpepper', price: 27000 },
  { id: 'p-10', storeId: 'store-5', name: 'Jus Alpukat Kocok', price: 12000 },
  { id: 'p-11', storeId: 'store-5', name: 'Es Buah Spesial', price: 15000 },
  { id: 'p-12', storeId: 'store-6', name: 'Bakso Urat Jumbo', price: 18000 },
  { id: 'p-13', storeId: 'store-6', name: 'Mie Ayam Komplit', price: 16000 },
];

function readPaymentHistory(): PaymentHistoryItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(PAYMENT_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatWhatsAppMessage(order: PaymentHistoryItem, userEmail: string | null): string {
  const dateFormatted = new Date(order.createdAt).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const itemList = order.items
    .map((item) => `• ${item.name} x${item.qty} (${formatRupiah(item.price * item.qty)})`)
    .join('\n');

  const greeting = order.storeOwner ? `Halo ${order.storeOwner} (${order.storeName}),` : `Halo ${order.storeName},`;

  return `${greeting}
Saya ingin mengonfirmasi pesanan & bukti pembayaran dari *KantinOnline*:

🧾 *ID Pesanan:* #${order.id}
👤 *Pemesan:* ${userEmail ?? 'Mahasiswa'}
📍 *Stand:* ${order.storeName}
📅 *Waktu:* ${dateFormatted}

📋 *Detail Menu Pesanan:*
${itemList}

💰 *Total Pembayaran:* *${formatRupiah(order.total)}*
💳 *Metode Pembayaran:* QRIS (${order.storeName})
✅ *Status Pembayaran:* *LUNAS (BERHASIL)*

Mohon pesanan segera diproses ya. Terima kasih banyak! 🙏`;
}

function openWhatsApp(order: PaymentHistoryItem, userEmail: string | null) {
  const message = formatWhatsAppMessage(order, userEmail);
  const waUrl = `https://wa.me/${order.storePhone}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

function QuantityAdder({ onAdd }: { onAdd: (qty: number) => void }) {
  const [value, setValue] = useState<string>('1');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;

    if (raw === '') {
      setValue('');
      return;
    }

    const next = Number(raw);
    if (Number.isFinite(next) && next >= 0) {
      setValue(raw);
    }
  };

  const handleAdd = () => {
    const qty = Math.max(1, Number(value) || 1);
    onAdd(qty);
    setValue('1');
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        aria-label="Jumlah"
        type="number"
        min={1}
        value={value}
        onChange={handleChange}
        onBlur={() => {
          if (!value || Number(value) < 1) {
            setValue('1');
          }
        }}
        style={{ width: 72, padding: 6, borderRadius: 8, border: '1px solid #e6eef4' }}
      />
      <button onClick={handleAdd} style={{ padding: '10px 12px', borderRadius: 8, background: '#ea580c', color: 'white', fontWeight: 700 }}>
        Tambah
      </button>
    </div>
  );
}

function QrisVisual({ storeName }: { storeName: string }) {
  // Generate distinct center initials
  const initials = storeName
    .split(' ')
    .filter((w) => !['&', 'Stand', 'Kedai', 'Dapur'].includes(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'QR';

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white" />
      {/* Top Left Marker */}
      <rect x="15" y="15" width="45" height="45" rx="6" fill="#0f172a" />
      <rect x="22" y="22" width="31" height="31" rx="4" fill="white" />
      <rect x="29" y="29" width="17" height="17" rx="2" fill="#0f172a" />

      {/* Top Right Marker */}
      <rect x="140" y="15" width="45" height="45" rx="6" fill="#0f172a" />
      <rect x="147" y="22" width="31" height="31" rx="4" fill="white" />
      <rect x="154" y="29" width="17" height="17" rx="2" fill="#0f172a" />

      {/* Bottom Left Marker */}
      <rect x="15" y="140" width="45" height="45" rx="6" fill="#0f172a" />
      <rect x="22" y="147" width="31" height="31" rx="4" fill="white" />
      <rect x="29" y="154" width="17" height="17" rx="2" fill="#0f172a" />

      {/* QR Data Matrix Patterns */}
      <rect x="70" y="20" width="10" height="20" fill="#0f172a" />
      <rect x="90" y="15" width="15" height="10" fill="#0f172a" />
      <rect x="115" y="20" width="15" height="15" fill="#0f172a" />
      <rect x="70" y="50" width="20" height="10" fill="#0f172a" />
      <rect x="100" y="45" width="25" height="15" fill="#0f172a" />
      <rect x="20" y="70" width="15" height="20" fill="#0f172a" />
      <rect x="45" y="75" width="15" height="15" fill="#0f172a" />
      <rect x="70" y="70" width="25" height="25" fill="#0f172a" />
      <rect x="105" y="70" width="15" height="15" fill="#0f172a" />
      <rect x="130" y="75" width="20" height="15" fill="#0f172a" />
      <rect x="160" y="70" width="25" height="20" fill="#0f172a" />
      <rect x="20" y="100" width="25" height="15" fill="#0f172a" />
      <rect x="55" y="105" width="15" height="20" fill="#0f172a" />
      <rect x="80" y="105" width="40" height="15" fill="#0f172a" />
      <rect x="130" y="100" width="15" height="25" fill="#0f172a" />
      <rect x="155" y="100" width="25" height="15" fill="#0f172a" />
      <rect x="70" y="130" width="15" height="25" fill="#0f172a" />
      <rect x="95" y="130" width="25" height="15" fill="#0f172a" />
      <rect x="130" y="135" width="25" height="20" fill="#0f172a" />
      <rect x="165" y="130" width="20" height="25" fill="#0f172a" />
      <rect x="70" y="165" width="25" height="20" fill="#0f172a" />
      <rect x="105" y="160" width="20" height="25" fill="#0f172a" />
      <rect x="135" y="165" width="20" height="20" fill="#0f172a" />
      <rect x="165" y="165" width="20" height="15" fill="#0f172a" />

      {/* Center QRIS Badge */}
      <rect x="76" y="76" width="48" height="48" rx="8" fill="white" stroke="#dc2626" strokeWidth="2.5" />
      <text x="100" y="96" textAnchor="middle" fill="#dc2626" fontSize="9" fontWeight="900" fontFamily="sans-serif">QRIS</text>
      <text x="100" y="112" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="900" fontFamily="sans-serif">{initials}</text>
    </svg>
  );
}

function MainKantinApp({
  userEmail,
  userId,
  onLogout
}: {
  userEmail: string | null;
  userId: string | null;
  onLogout: () => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [cartVisible, setCartVisible] = useState(false);
  const [checkoutPage, setCheckoutPage] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [cartDrafts, setCartDrafts] = useState<Record<string, string>>({});
  const [successPopup, setSuccessPopup] = useState<string | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(() => readPaymentHistory());

  // Per-store payment modal state
  const [payingStore, setPayingStore] = useState<{
    store: Store;
    items: CartItem[];
    total: number;
  } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Completed receipt modal state with direct WhatsApp button
  const [receiptModal, setReceiptModal] = useState<PaymentHistoryItem | null>(null);

  const categories = ['Semua', ...Array.from(new Set(STORES.map((store) => store.category)))];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PAYMENT_HISTORY_KEY, JSON.stringify(paymentHistory));
    }
  }, [paymentHistory]);

  useEffect(() => {
    if (!successPopup) return;

    const timer = window.setTimeout(() => setSuccessPopup(null), 3500);
    return () => window.clearTimeout(timer);
  }, [successPopup]);

  const filteredStores = useMemo(() => {
    return STORES.filter((store) => {
      const q = query.trim().toLowerCase();
      const matchQuery = `${store.name} ${store.category} ${store.description}`.toLowerCase().includes(q);
      const matchCat = category === 'Semua' || store.category === category;
      return matchQuery && matchCat;
    });
  }, [query, category]);

  // Kelompokkan cart berdasarkan toko
  const cartGroupedByStore = useMemo(() => {
    const groups: Record<string, { storeName: string; store: Store; items: CartItem[] }> = {};
    cart.forEach((item) => {
      if (!groups[item.storeId]) {
        const foundStore = STORES.find((s) => s.id === item.storeId) || {
          id: item.storeId,
          name: item.storeName,
          category: 'Kantin',
          rating: 4.8,
          estimate: '10–15 menit',
          emoji: '🍽️',
          description: '',
          owner: 'Penjual',
          location: 'Stand Kantin',
          phone: '6281234567801',
          qrisNmid: 'ID1020304050601'
        };
        groups[item.storeId] = { storeName: item.storeName, store: foundStore, items: [] };
      }
      groups[item.storeId].items.push(item);
    });
    return groups;
  }, [cart]);

  const distinctStoresCount = Object.keys(cartGroupedByStore).length;

  const addToCart = (product: Product, qty: number) => {
    if (qty <= 0) return;
    const store = STORES.find((s) => s.id === product.storeId)!;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) => (item.productId === product.id ? { ...item, qty: item.qty + qty } : item));
      }

      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          storeId: store.id,
          storeName: store.name,
          unitPrice: product.price,
          qty,
        },
      ];
    });

    setCartVisible(true);
  };

  const updateCartQty = (productId: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.productId === productId ? { ...item, qty: Math.max(0, qty) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    setCartDrafts((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const openCheckoutPage = () => {
    if (cart.length === 0) return;
    setCheckoutPage(true);
    setCartVisible(false);
  };

  const closeCheckoutPage = () => {
    setCheckoutPage(false);
    setPayingStore(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const storeProducts = selectedStore ? PRODUCTS.filter((product) => product.storeId === selectedStore.id) : [];

  // Buka modal QRIS spesifik untuk satu toko
  const handleStartStorePayment = (store: Store, items: CartItem[], total: number) => {
    setPayingStore({ store, items, total });
  };

  // Konfirmasi pembayaran berhasil untuk satu toko
  const handleConfirmStorePaymentSuccess = async () => {
    if (!payingStore) return;
    setIsProcessingPayment(true);

    const { store, items, total } = payingStore;
    const orderId = `KNT-${store.id.replace('store-', 'ST')}-${Date.now().toString().slice(-5)}`;

    // Catat ke Supabase jika ada user terautentikasi
    try {
      if (userId) {
        const client = getClient();
        await client.from('transactions').insert({
          user_id: userId,
          total_price: total,
          payment_method: 'QRIS',
          payment_status: 'SUCCESS'
        });
      }
    } catch (err) {
      console.warn('Gagal mencatat transaksi ke Supabase:', err);
    }

    const transaction: PaymentHistoryItem = {
      id: orderId,
      createdAt: new Date().toISOString(),
      total,
      paymentMethod: `QRIS (${store.name})`,
      storeId: store.id,
      storeName: store.name,
      storeOwner: store.owner,
      storePhone: store.phone,
      items: items.map((item) => ({
        name: item.productName,
        qty: item.qty,
        price: item.unitPrice,
        storeName: store.name
      })),
      status: 'Berhasil',
    };

    // Update history
    setPaymentHistory((prev) => [transaction, ...prev].slice(0, 15));

    // Hapus hanya item milik toko yang sudah dibayar dari cart
    setCart((prev) => prev.filter((item) => item.storeId !== store.id));

    // Tutup modal bayar dan buka modal bukti pembayaran (dengan tombol WhatsApp)
    setPayingStore(null);
    setIsProcessingPayment(false);
    setReceiptModal(transaction);

    setSuccessPopup(
      `Pembayaran QRIS ${store.name} Berhasil! (${formatRupiah(total)}). Silakan kirim bukti ke WhatsApp toko.`
    );
  };

  return (
    <div className="app-shell">
      {successPopup && (
        <div className="success-popup" role="status" aria-live="polite">
          {successPopup}
        </div>
      )}

      {/* QRIS PAYMENT MODAL SPESIFIK PER TOKO */}
      {payingStore && (
        <div className="qris-modal-overlay">
          <div className="qris-modal-card">
            <div className="qris-top-banner">
              <h3>📱 QRIS {payingStore.store.name}</h3>
              <button
                onClick={() => setPayingStore(null)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="qris-body">
              <div className="qris-merchant-info">
                <span className="qris-merchant-name">{payingStore.store.name}</span>
                <span className="qris-merchant-sub">
                  Pemilik: <b>{payingStore.store.owner}</b> · {payingStore.store.location}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  NMID: {payingStore.store.qrisNmid} · WA: {payingStore.store.phone}
                </span>
              </div>

              <div className="qris-qr-wrapper">
                <div className="qris-qr-inner">
                  <QrisVisual storeName={payingStore.store.name} />
                </div>
                <div className="qris-qr-tag">SCAN QRIS RESMI {payingStore.store.name.toUpperCase()}</div>
              </div>

              <div className="qris-amount-box">
                <span>Total Tagihan Toko:</span>
                <strong>{formatRupiah(payingStore.total)}</strong>
              </div>

              <div className="qris-timer">
                ⏱ Batas Waktu Pembayaran: 15:00
              </div>

              <div className="qris-instruction">
                <strong>Cara Pembayaran:</strong>
                <ol>
                  <li>Buka m-Banking atau e-Wallet (BCA, GoPay, OVO, Dana, Mandiri, dll.).</li>
                  <li>Scan QRIS khusus <b>{payingStore.store.name}</b> di atas.</li>
                  <li>Pastikan nama merchant dan nominal sesuai: <b>{formatRupiah(payingStore.total)}</b>.</li>
                  <li>Setelah bayar, tekan tombol konfirmasi di bawah untuk kirim bukti ke WhatsApp toko.</li>
                </ol>
              </div>

              <div className="qris-actions">
                <button
                  className="btn-confirm-payment"
                  onClick={handleConfirmStorePaymentSuccess}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? 'Memverifikasi Pembayaran...' : '✓ Saya Sudah Membayar'}
                </button>
                <button
                  className="btn-cancel-payment"
                  onClick={() => setPayingStore(null)}
                >
                  Batal / Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BUKTI PEMBAYARAN & KIRIM KE WHATSAPP */}
      {receiptModal && (
        <div className="qris-modal-overlay">
          <div className="receipt-modal-card">
            <div className="receipt-top-banner">
              <h3>🎉 Pembayaran Berhasil!</h3>
              <button
                onClick={() => setReceiptModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="receipt-body">
              <div className="receipt-summary-box">
                <div className="receipt-row">
                  <span>ID Pesanan:</span>
                  <strong>#{receiptModal.id}</strong>
                </div>
                <div className="receipt-row">
                  <span>Stand Kantin:</span>
                  <strong>{receiptModal.storeName} ({receiptModal.storeOwner})</strong>
                </div>
                <div className="receipt-row">
                  <span>Waktu:</span>
                  <span>{new Date(receiptModal.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
                <div className="receipt-row">
                  <span>Status:</span>
                  <span className="history-status" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 800 }}>
                    LUNAS (QRIS)
                  </span>
                </div>

                <div className="receipt-items-list">
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Rincian Menu:</span>
                  {receiptModal.items.map((it, idx) => (
                    <div key={idx} className="receipt-item-line">
                      <span>{it.name} x{it.qty}</span>
                      <strong>{formatRupiah(it.price * it.qty)}</strong>
                    </div>
                  ))}
                </div>

                <div className="receipt-row" style={{ fontSize: '15px' }}>
                  <strong>Total Pembayaran:</strong>
                  <strong style={{ color: '#ea580c', fontSize: '17px' }}>{formatRupiah(receiptModal.total)}</strong>
                </div>
              </div>

              <div className="wa-notice-box">
                <span style={{ fontSize: '20px' }}>📲</span>
                <div>
                  <strong>Kirim Bukti ke WhatsApp Penjual</strong>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#15803d' }}>
                    Kirimkan rincian pesanan dan bukti bayar ke nomor WhatsApp <b>{receiptModal.storeOwner}</b> ({receiptModal.storePhone}) agar pesanan langsung disiapkan!
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  className="btn-whatsapp"
                  onClick={() => openWhatsApp(receiptModal, userEmail)}
                >
                  <span>💬</span>
                  <span>Kirim Bukti & Detail Pesanan ke WhatsApp Toko</span>
                </button>

                <button
                  className="btn-cancel-payment"
                  onClick={() => {
                    setReceiptModal(null);
                    if (cart.length === 0) {
                      setCheckoutPage(false);
                    }
                  }}
                >
                  {cart.length > 0 ? `Lanjut Bayar Toko Lain (${distinctStoresCount} Stand Tersisa)` : 'Selesai & Tutup'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">K</span>
          <span>KantinOnline</span>
        </div>
        <div className="topbar-actions">
          <span className="user-pill">{userEmail ?? 'Mahasiswa'}</span>
          <button className="cart-button" onClick={() => setCartVisible((visible) => !visible)}>
            🛒 Keranjang ({cartCount})
          </button>
          <button className="cart-button" onClick={() => setHistoryVisible((visible) => !visible)}>
            🧾 Riwayat
          </button>
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="container">
        {checkoutPage ? (
          <section className="checkout-page">
            <div className="checkout-header">
              <button className="back-button" onClick={closeCheckoutPage}>↩ Kembali</button>
              <div>
                <h2>Checkout per Stand Kantin</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
                  Setiap toko memiliki QRIS terpisah. Silakan bayar pesanan langsung di bawah list masing-masing toko.
                </p>
              </div>
            </div>

            <div className="checkout-layout">
              <div className="checkout-items-panel">
                <div className="section-heading compact">
                  <div>
                    <h3>Pesanan ({distinctStoresCount} Toko)</h3>
                  </div>
                  <button className="subtle-button" onClick={() => setCart([])}>Hapus Semua</button>
                </div>

                {cart.length === 0 ? (
                  <div className="empty-cart" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px' }}>Keranjang belanja kosong.</p>
                    <button className="back-button" onClick={closeCheckoutPage}>Kembali ke Menu</button>
                  </div>
                ) : (
                  /* LIST MAKANAN DIKELOMPOKKAN PER TOKO DENGAN TOMBOL BAYAR QRIS DI BAWAHNYA */
                  Object.entries(cartGroupedByStore).map(([storeId, group]) => {
                    const storeSubtotal = group.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

                    return (
                      <div key={storeId} className="checkout-store-group">
                        <div className="checkout-store-header">
                          <div className="store-header-title">
                            <span style={{ fontSize: '20px' }}>{group.store.emoji}</span>
                            <span>{group.store.name}</span>
                          </div>
                          <span className="store-header-location">{group.store.location}</span>
                        </div>

                        <div className="checkout-store-items">
                          {group.items.map((item) => (
                            <div key={item.productId} className="checkout-item">
                              <div>
                                <div className="checkout-item-name">{item.productName}</div>
                                <div className="checkout-item-price">{formatRupiah(item.unitPrice)} / item</div>
                              </div>

                              <div className="checkout-item-controls">
                                <div className="quantity-stepper">
                                  <button onClick={() => updateCartQty(item.productId, item.qty - 1)} aria-label={`Kurangi ${item.productName}`}>-</button>
                                  <span>{item.qty}</span>
                                  <button onClick={() => updateCartQty(item.productId, item.qty + 1)} aria-label={`Tambah ${item.productName}`}>+</button>
                                </div>
                                <button className="remove-item" onClick={() => removeFromCart(item.productId)}>Hapus</button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* SUB-TOTAL TOKO DAN TOMBOL BAYAR QRIS KHUSUS TOKO INI */}
                        <div className="checkout-store-footer">
                          <div className="store-subtotal-row">
                            <span>Subtotal {group.store.name}:</span>
                            <span className="store-subtotal-price">{formatRupiah(storeSubtotal)}</span>
                          </div>

                          <button
                            className="btn-store-pay"
                            onClick={() => handleStartStorePayment(group.store, group.items, storeSubtotal)}
                          >
                            <span>📱</span>
                            <span>Bayar QRIS {group.store.name} ({formatRupiah(storeSubtotal)})</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <aside className="checkout-summary-panel">
                <h3>Ringkasan Pembayaran</h3>

                <div className="summary-row">
                  <span>Total Seluruh Stand ({distinctStoresCount} Toko)</span>
                  <strong style={{ color: '#ea580c', fontSize: '18px' }}>{formatRupiah(cartTotal)}</strong>
                </div>

                <div className="payment-method-card" style={{ marginTop: '10px' }}>
                  <div className="payment-method-header">
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>📱 Pembayaran QRIS per Toko</strong>
                    <span className="qris-badge">LANGSUNG</span>
                  </div>
                  <p className="payment-method-desc">
                    Uang langsung masuk ke rekening masing-masing penjual stand. Setelah bayar, Anda dapat langsung mengirim bukti transaksi ke <b>WhatsApp toko</b> dengan sekali klik!
                  </p>
                </div>

                <div className="wa-notice-box" style={{ marginTop: '6px' }}>
                  <span>💬</span>
                  <span style={{ fontSize: '12px' }}>
                    Setelah status pembayaran dikonfirmasi, Anda akan diarahkan untuk mengirim detail pesanan ke WhatsApp penjual.
                  </span>
                </div>
              </aside>
            </div>
          </section>
        ) : !selectedStore ? (
          <>
            <section className="hero">
              <div>
                <p className="eyebrow">KANTIN KAMPUS TERPADU</p>
                <h1>Pesan makanan tanpa antre.</h1>
                <p className="hero-copy">Pilih stand favoritmu, pesan menu, bayar langsung via QRIS toko, dan konfirmasi ke WhatsApp penjual.</p>
              </div>
              <div className="hero-emoji">🍽️</div>
            </section>

            <section className="toolbar">
              <input aria-label="Cari stand" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari stand, kebab, kopi..." />
              <select aria-label="Filter kategori" value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </section>

            <div className="section-heading">
              <div>
                <h2>Stand kantin</h2>
                <p>{filteredStores.length} stand ditemukan</p>
              </div>
              <span className="status">● Semua buka</span>
            </div>

            <section className="store-grid">
              {filteredStores.map((store) => (
                <article
                  key={store.id}
                  className="store-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedStore(store)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') setSelectedStore(store);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="store-image">
                    {store.emoji}
                    <span className="open-label">Buka</span>
                  </div>
                  <div className="store-content">
                    <div className="card-meta">
                      <span>{store.category}</span>
                      <strong>★ {store.rating}</strong>
                    </div>
                    <h3>{store.name}</h3>
                    <p>{store.description}</p>
                    <div className="card-footer">
                      <span>⏱ {store.estimate}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>👤 {store.owner}</span>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="history-panel">
              <div className="history-header">
                <h3>Riwayat Pembayaran</h3>
                <span>{paymentHistory.length} transaksi</span>
              </div>

              {paymentHistory.length === 0 ? (
                <p className="empty-history">Belum ada pembayaran yang dicatat.</p>
              ) : (
                <div className="history-list">
                  {paymentHistory.map((entry) => (
                    <div key={entry.id} className="history-item">
                      <div className="history-item-top">
                        <strong>Order #{entry.id}</strong>
                        <span className="history-status">{entry.status}</span>
                      </div>
                      <div className="history-item-meta">
                        <span>{new Date(entry.createdAt).toLocaleString('id-ID')}</span>
                        <span>{entry.paymentMethod}</span>
                      </div>
                      <div className="history-item-total">
                        Total: {formatRupiah(entry.total)} ({entry.storeName})
                      </div>
                      <ul className="history-items" style={{ margin: '6px 0 0', paddingLeft: '18px', fontSize: '13px', color: '#475569' }}>
                        {entry.items.map((it, idx) => (
                          <li key={idx}>
                            {it.name} x{it.qty} — {formatRupiah(it.price * it.qty)}
                          </li>
                        ))}
                      </ul>

                      {/* Tombol Kirim Ulang Bukti ke WhatsApp Toko */}
                      <button
                        className="btn-whatsapp-sm"
                        onClick={() => openWhatsApp(entry, userEmail)}
                      >
                        <span>💬</span>
                        <span>Kirim Ulang Bukti ke WA {entry.storeOwner || entry.storeName}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <>
            <div className="store-detail-header">
              <button className="back-button" onClick={() => setSelectedStore(null)}>↩ Kembali</button>
              <div className="store-title">{selectedStore?.name}</div>
              <div className="store-meta">{selectedStore?.category} · ★ {selectedStore?.rating} · 👤 {selectedStore?.owner}</div>
            </div>

            <section className="product-list">
              {storeProducts.map((product) => (
                <div key={product.id} className="product-item">
                  <div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-description">{product.description}</div>
                    <div className="product-price">Rp {product.price.toLocaleString('id-ID')}</div>
                  </div>

                  <div className="product-actions">
                    <QuantityAdder onAdd={(qty) => addToCart(product, qty)} />
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </main>

      {/* DRAWER KERANJANG BELANJA */}
      {cartVisible && !checkoutPage && (
        <div className="cart-panel">
          <div className="cart-header">
            <strong>Keranjang ({cartCount})</strong>
            <div className="cart-actions">
              <button onClick={() => { setCart([]); setCartVisible(false); }} className="clear-cart">
                Kosongkan
              </button>
              <button onClick={() => setCartVisible(false)} className="close-cart">Tutup</button>
            </div>
          </div>

          {cart.length === 0 && <div className="empty-cart">Keranjang kosong</div>}

          {/* DAFTAR PER TOKO DI DALAM DRAWER KERANJANG */}
          {Object.entries(cartGroupedByStore).map(([storeId, group]) => {
            const storeSubtotal = group.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

            return (
              <div key={storeId} style={{ marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '13px', color: '#ea580c' }}>🏪 {group.store.name}</strong>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>{formatRupiah(storeSubtotal)}</span>
                </div>

                {group.items.map((item) => {
                  const draftValue = cartDrafts[item.productId] ?? String(item.qty);

                  return (
                    <div key={item.productId} className="cart-item">
                      <div className="cart-item-details">
                        <div className="cart-product-name">{item.productName}</div>
                        <div className="cart-product-total">
                          Rp {item.unitPrice.toLocaleString('id-ID')} × {item.qty} = <strong>Rp {(item.unitPrice * item.qty).toLocaleString('id-ID')}</strong>
                        </div>
                      </div>
                      <div className="cart-qty-actions">
                        <input
                          type="number"
                          min={1}
                          value={draftValue}
                          onChange={(event) => {
                            const raw = event.target.value;
                            if (raw === '') {
                              setCartDrafts((prev) => ({ ...prev, [item.productId]: '' }));
                              return;
                            }
                            const nextQty = Number(raw);
                            if (!Number.isFinite(nextQty) || nextQty < 0) return;
                            setCartDrafts((prev) => ({ ...prev, [item.productId]: raw }));
                            if (nextQty > 0) updateCartQty(item.productId, nextQty);
                          }}
                          onBlur={(event) => {
                            const raw = event.target.value;
                            const normalized = raw === '' || Number(raw) < 1 ? '1' : String(Math.floor(Number(raw)));
                            setCartDrafts((prev) => ({ ...prev, [item.productId]: normalized }));
                            updateCartQty(item.productId, Number(normalized));
                          }}
                        />
                        <button onClick={() => removeFromCart(item.productId)} className="remove-item">Hapus</button>
                      </div>
                    </div>
                  );
                })}

                <button
                  className="btn-store-pay"
                  style={{ marginTop: '6px', padding: '9px 12px', fontSize: '12px' }}
                  onClick={() => {
                    setCartVisible(false);
                    handleStartStorePayment(group.store, group.items, storeSubtotal);
                  }}
                >
                  <span>📱</span>
                  <span>Bayar {group.store.name} ({formatRupiah(storeSubtotal)})</span>
                </button>
              </div>
            );
          })}

          {cart.length > 0 && (
            <div className="checkout-box" style={{ marginTop: '14px' }}>
              <div className="total-row">
                <div>Total Seluruh Stand</div>
                <div className="total-price">{formatRupiah(cartTotal)}</div>
              </div>

              <button className="checkout-button full" onClick={openCheckoutPage}>
                Buka Halaman Checkout ({distinctStoresCount} Toko)
              </button>
            </div>
          )}
        </div>
      )}

      {/* DRAWER RIWAYAT PEMBAYARAN */}
      {historyVisible && (
        <aside className="history-panel">
          <div className="history-header">
            <strong>Riwayat Pembayaran</strong>
            <button className="close-cart" onClick={() => setHistoryVisible(false)}>Tutup</button>
          </div>

          {paymentHistory.length === 0 ? (
            <div className="empty-cart">Belum ada transaksi.</div>
          ) : (
            <div className="history-list">
              {paymentHistory.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-topline">
                    <strong>Order #{item.id}</strong>
                    <span className="history-status">{item.status}</span>
                  </div>
                  <div className="history-meta">{new Date(item.createdAt).toLocaleString('id-ID')} · {item.paymentMethod}</div>
                  <div className="history-meta" style={{ fontWeight: 800, color: '#ea580c' }}>
                    Total: {formatRupiah(item.total)}
                  </div>
                  <ul className="history-items" style={{ margin: '6px 0 0', paddingLeft: '18px', fontSize: '13px' }}>
                    {item.items.map((entry, index) => (
                      <li key={`${item.id}-${index}`}>{`${entry.name} x${entry.qty}`}</li>
                    ))}
                  </ul>

                  <button
                    className="btn-whatsapp-sm"
                    onClick={() => openWhatsApp(item, userEmail)}
                  >
                    <span>💬</span>
                    <span>Kirim Ulang Bukti ke WhatsApp {item.storeOwner || item.storeName}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </aside>
      )}
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState<AuthMode>('register');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(SESSION_KEY);
  });
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(SESSION_USER_ID_KEY);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user?.email) {
        setLoggedInUser(user.email);
        setLoggedInUserId(user.id);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(SESSION_KEY, user.email);
          window.localStorage.setItem(SESSION_USER_ID_KEY, user.id);
        }
      }
    });
  }, []);

  const updateField = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (message) setMessage(null);
  };

  const handleLoginSuccess = (email: string, id: string) => {
    setLoggedInUser(email);
    setLoggedInUserId(id);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SESSION_KEY, email);
      window.localStorage.setItem(SESSION_USER_ID_KEY, id);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }
    setLoggedInUser(null);
    setLoggedInUserId(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SESSION_KEY);
      window.localStorage.removeItem(SESSION_USER_ID_KEY);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const email = form.email.trim();
    const password = form.password;

    if (mode === 'register') {
      if (form.confirmPassword !== password) {
        setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok.' });
        setIsSubmitting(false);
        return;
      }

      try {
        const result = await registerUser({
          name: form.name.trim() || email.split('@')[0],
          email,
          password,
        });

        setMessage({
          type: 'success',
          text: `Pendaftaran berhasil untuk ${result.email}. Silakan langsung login.`
        });
        setForm({ ...emptyForm });
        setMode('login');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Pendaftaran gagal.';
        setMessage({ type: 'error', text: msg });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      const result = await loginUser(email, password);
      handleLoginSuccess(result.email, result.id);
      setMessage({ type: 'success', text: `Login berhasil. Selamat datang, ${result.email}.` });
      setForm({ ...emptyForm });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login gagal. Periksa kembali email dan password Anda.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loggedInUser) {
    return <MainKantinApp userEmail={loggedInUser} userId={loggedInUserId} onLogout={handleLogout} />;
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark">K</div>
          <div>
            <p className="eyebrow">KANTINONLINE</p>
            <h1>{mode === 'login' ? 'Masuk ke akun' : 'Buat akun baru'}</h1>
          </div>
        </div>

        <div className="auth-toggle" aria-label="Mode autentikasi">
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
            Register
          </button>
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
            Login
          </button>
        </div>

        <div className="auth-note">
          {mode === 'register'
            ? 'Daftarkan akun Anda ke database Supabase.'
            : 'Masuk dengan email dan password yang telah didaftarkan.'}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <label>
              Nama Lengkap
              <input
                type="text"
                value={form.name}
                onChange={updateField('name')}
                placeholder="Masukkan nama Anda"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={updateField('email')}
              placeholder="nama@email.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={updateField('password')}
              placeholder="Minimal 6 karakter"
              required
            />
          </label>

          {mode === 'register' && (
            <label>
              Konfirmasi Password
              <input
                type="password"
                value={form.confirmPassword}
                onChange={updateField('confirmPassword')}
                placeholder="Ulangi password"
                required
              />
            </label>
          )}

          {message && <div className={`auth-message ${message.type}`}>{message.text}</div>}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Memproses ke Supabase...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
