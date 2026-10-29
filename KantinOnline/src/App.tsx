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
  storeCount: number;
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
  { id: 'store-1', name: 'Stand Kebab & Burger Middle East', category: 'Fast Food', rating: 4.8, estimate: '10–15 menit', emoji: '🌯', description: 'Kebab daging sapi, burger, dan hotdog dengan saus spesial.' },
  { id: 'store-2', name: 'Ayam Geprek Kampus', category: 'Ayam & Nasi', rating: 4.9, estimate: '15–20 menit', emoji: '🍗', description: 'Ayam geprek renyah dengan sambal pilihan level 1–10.' },
  { id: 'store-3', name: 'Kedai Kopi Mahasiswa', category: 'Minuman & Snack', rating: 4.7, estimate: '5–10 menit', emoji: '☕', description: 'Kopi susu gula aren, toast, dan minuman segar.' },
  { id: 'store-4', name: 'Dapur Ricebox & Bento', category: 'Ayam & Nasi', rating: 4.6, estimate: '10–15 menit', emoji: '🍱', description: 'Ricebox hangat dengan pilihan topping favorit.' },
  { id: 'store-5', name: 'Jus Buah Segar Kampus', category: 'Minuman & Snack', rating: 4.9, estimate: '5–8 menit', emoji: '🥤', description: 'Jus buah segar tanpa pemanis buatan.' },
  { id: 'store-6', name: 'Bakso & Mie Ayam Pak Kumis', category: 'Mie & Bakso', rating: 4.7, estimate: '15–20 menit', emoji: '🍜', description: 'Bakso urat dan mie ayam dengan kuah kaldu gurih.' },
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

function QrisVisual() {
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
      <rect x="82" y="82" width="36" height="36" rx="8" fill="white" stroke="#dc2626" strokeWidth="2" />
      <text x="100" y="104" textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="900" fontFamily="sans-serif">QRIS</text>
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
  const [qrisModalVisible, setQrisModalVisible] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const categories = ['Semua', ...Array.from(new Set(STORES.map((store) => store.category)))];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PAYMENT_HISTORY_KEY, JSON.stringify(paymentHistory));
    }
  }, [paymentHistory]);

  useEffect(() => {
    if (!successPopup) return;

    const timer = window.setTimeout(() => setSuccessPopup(null), 3000);
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
    const groups: Record<string, { storeName: string; items: CartItem[] }> = {};
    cart.forEach((item) => {
      if (!groups[item.storeId]) {
        groups[item.storeId] = { storeName: item.storeName, items: [] };
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
    setQrisModalVisible(false);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const storeProducts = selectedStore ? PRODUCTS.filter((product) => product.storeId === selectedStore.id) : [];

  const handleStartQrisPayment = () => {
    if (cart.length === 0) return;
    setQrisModalVisible(true);
  };

  const handleConfirmQrisSuccess = async () => {
    setIsProcessingPayment(true);
    const orderId = `KNT-${Date.now().toString().slice(-6)}`;

    // Catat ke Supabase jika ada user terautentikasi
    try {
      if (userId) {
        const client = getClient();
        await client.from('transactions').insert({
          user_id: userId,
          total_price: cartTotal,
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
      total: cartTotal,
      paymentMethod: 'QRIS Terpadu',
      storeCount: distinctStoresCount,
      items: cart.map((item) => ({
        name: item.productName,
        qty: item.qty,
        price: item.unitPrice,
        storeName: item.storeName
      })),
      status: 'Berhasil',
    };

    setPaymentHistory((prev) => [transaction, ...prev].slice(0, 15));
    setCart([]);
    setCartDrafts({});
    setQrisModalVisible(false);
    setCheckoutPage(false);
    setIsProcessingPayment(false);

    setSuccessPopup(
      `Pembayaran QRIS Berhasil! Total ${formatRupiah(cartTotal)}. Pesanan telah diteruskan ke ${distinctStoresCount} stand kantin.`
    );
  };

  return (
    <div className="app-shell">
      {successPopup && (
        <div className="success-popup" role="status" aria-live="polite">
          {successPopup}
        </div>
      )}

      {/* QRIS PAYMENT MODAL */}
      {qrisModalVisible && (
        <div className="qris-modal-overlay">
          <div className="qris-modal-card">
            <div className="qris-top-banner">
              <h3>📱 QRIS Terpadu Kantin</h3>
              <button
                onClick={() => setQrisModalVisible(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="qris-body">
              <div className="qris-merchant-info">
                <span className="qris-merchant-name">Kantin Kampus Terpadu</span>
                <span className="qris-merchant-sub">NMID: ID1020304050607 · Pesanan {distinctStoresCount} Stand Berbeda</span>
              </div>

              <div className="qris-qr-wrapper">
                <div className="qris-qr-inner">
                  <QrisVisual />
                </div>
                <div className="qris-qr-tag">SCAN & BAYAR DI SINI</div>
              </div>

              <div className="qris-amount-box">
                <span>Total Pembayaran:</span>
                <strong>{formatRupiah(cartTotal)}</strong>
              </div>

              <div className="qris-timer">
                ⏱ Batas Waktu Pembayaran: 15:00
              </div>

              <div className="qris-instruction">
                <strong>Cara Pembayaran:</strong>
                <ol>
                  <li>Buka aplikasi m-Banking atau e-Wallet Anda (BCA, GoPay, OVO, Dana, dll.).</li>
                  <li>Scan QRIS di atas dan pastikan nominal sesuai: <b>{formatRupiah(cartTotal)}</b>.</li>
                  <li>Konfirmasi PIN pembayaran di ponsel Anda.</li>
                  <li>Setelah bayar, tekan tombol konfirmasi di bawah ini.</li>
                </ol>
              </div>

              <div className="qris-actions">
                <button
                  className="btn-confirm-payment"
                  onClick={handleConfirmQrisSuccess}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? 'Memverifikasi Pembayaran...' : '✓ Saya Sudah Membayar'}
                </button>
                <button
                  className="btn-cancel-payment"
                  onClick={() => setQrisModalVisible(false)}
                >
                  Batal / Ganti Pesanan
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
          <button className="cart-button" onClick={() => setCartVisible((visible) => !visible)}>🛒 Keranjang ({cartCount})</button>
          <button className="cart-button" onClick={() => setHistoryVisible((visible) => !visible)}>🧾 Riwayat</button>
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="container">
        {checkoutPage ? (
          <section className="checkout-page">
            <div className="checkout-header">
              <button className="back-button" onClick={closeCheckoutPage}>↩ Kembali</button>
              <h2>Checkout Terpadu</h2>
            </div>

            <div className="checkout-layout">
              <div className="checkout-items-panel">
                <div className="section-heading compact">
                  <div>
                    <h3>Rincian Pesanan per Stand</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                      Pesanan dari <strong>{distinctStoresCount} stand berbeda</strong> akan diproses serentak setelah pembayaran lunas.
                    </p>
                  </div>
                  <button className="subtle-button" onClick={() => setCart([])}>Hapus Semua</button>
                </div>

                {cart.length === 0 ? (
                  <div className="empty-cart">Keranjang kosong.</div>
                ) : (
                  Object.entries(cartGroupedByStore).map(([storeId, group]) => (
                    <div key={storeId} className="checkout-store-group">
                      <div className="checkout-store-header">
                        <span>🏪</span>
                        <span>{group.storeName}</span>
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
                    </div>
                  ))
                )}
              </div>

              <aside className="checkout-summary-panel">
                <h3>Detail Pembayaran</h3>

                <div className="summary-row">
                  <span>Subtotal Pesanan</span>
                  <strong>{formatRupiah(cartTotal)}</strong>
                </div>

                <div className="summary-row">
                  <span>Biaya Layanan Kantin</span>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>Gratis</span>
                </div>

                <div className="summary-row" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '16px' }}>
                  <span>Total Tagihan</span>
                  <strong style={{ color: '#ea580c', fontSize: '18px' }}>{formatRupiah(cartTotal)}</strong>
                </div>

                {/* Metode Pembayaran QRIS */}
                <div className="payment-method-card">
                  <div className="payment-method-header">
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>📱 QRIS Terpadu Kantin</strong>
                    <span className="qris-badge">OTOMATIS</span>
                  </div>
                  <p className="payment-method-desc">
                    Cukup <strong>1 kali scan QRIS</strong> untuk membayar seluruh pesanan dari {distinctStoresCount} stand berbeda. Makanan langsung dibuat otomatis setelah lunas.
                  </p>
                  <div className="payment-supported-apps">
                    <span className="app-pill">BCA</span>
                    <span className="app-pill">Mandiri</span>
                    <span className="app-pill">GoPay</span>
                    <span className="app-pill">OVO</span>
                    <span className="app-pill">Dana</span>
                    <span className="app-pill">ShopeePay</span>
                  </div>
                </div>

                <button
                  className="checkout-button full"
                  onClick={handleStartQrisPayment}
                  disabled={cart.length === 0}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <span>📲</span>
                  <span>Bayar Sekarang dengan QRIS</span>
                </button>
              </aside>
            </div>
          </section>
        ) : !selectedStore ? (
          <>
            <section className="hero">
              <div>
                <p className="eyebrow">KANTIN KAMPUS TERPADU</p>
                <h1>Pesan makanan tanpa antre.</h1>
                <p className="hero-copy">Pilih stand favoritmu, pesan menu, bayar praktis via QRIS, dan ambil langsung saat sudah siap.</p>
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
                      <div className="history-item-total">Total: {formatRupiah(entry.total)}</div>
                      <ul className="history-items" style={{ margin: '6px 0 0', paddingLeft: '18px', fontSize: '13px', color: '#475569' }}>
                        {entry.items.map((it, idx) => (
                          <li key={idx}>
                            {it.name} x{it.qty} {it.storeName ? `(${it.storeName})` : ''} — {formatRupiah(it.price * it.qty)}
                          </li>
                        ))}
                      </ul>
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
              <div className="store-meta">{selectedStore?.category} · ★ {selectedStore?.rating}</div>
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

      {cartVisible && !checkoutPage && (
        <div className="cart-panel">
          <div className="cart-header">
            <strong>Keranjang</strong>
            <div className="cart-actions">
              <button onClick={() => { setCart([]); setCartVisible(false); }} className="clear-cart">
                Kosongkan
              </button>
              <button onClick={() => setCartVisible(false)} className="close-cart">Tutup</button>
            </div>
          </div>

          {cart.length === 0 && <div className="empty-cart">Keranjang kosong</div>}

          {cart.map((item) => {
            const draftValue = cartDrafts[item.productId] ?? String(item.qty);

            return (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-details">
                  <div className="cart-product-name">{item.productName}</div>
                  <div className="cart-product-store">{item.storeName}</div>
                  <div className="cart-product-total">Rp {item.unitPrice.toLocaleString('id-ID')} × {item.qty} = <strong>Rp {(item.unitPrice * item.qty).toLocaleString('id-ID')}</strong></div>
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
                      if (!Number.isFinite(nextQty) || nextQty < 0) {
                        return;
                      }

                      setCartDrafts((prev) => ({ ...prev, [item.productId]: raw }));

                      if (nextQty > 0) {
                        updateCartQty(item.productId, nextQty);
                      }
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

          {cart.length > 0 && (
            <div className="checkout-box">
              <div className="total-row">
                <div>Total</div>
                <div className="total-price">{formatRupiah(cartTotal)}</div>
              </div>

              <button className="checkout-button full" onClick={openCheckoutPage}>
                Lanjut ke Checkout ({distinctStoresCount} Stand)
              </button>
            </div>
          )}
        </div>
      )}

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
                  <div className="history-meta" style={{ fontWeight: 800, color: '#ea580c' }}>Total: {formatRupiah(item.total)}</div>
                  <ul className="history-items" style={{ margin: '6px 0 0', paddingLeft: '18px', fontSize: '13px' }}>
                    {item.items.map((entry, index) => (
                      <li key={`${item.id}-${index}`}>{`${entry.name} x${entry.qty} ${entry.storeName ? `(${entry.storeName})` : ''}`}</li>
                    ))}
                  </ul>
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
          text: `Pendaftaran berhasil untuk ${result.email}. Jika verifikasi email aktif di Supabase, silakan cek inbox email Anda, atau langsung coba login.`
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
