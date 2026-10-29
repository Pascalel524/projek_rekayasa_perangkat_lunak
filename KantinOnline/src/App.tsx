import React, { useEffect, useMemo, useState } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  saveTransaction,
  getTransactionHistory
} from './services/db';
import { formatRupiah, validatePaymentAmount } from './payment';

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
  paid: number;
  change: number;
  items: Array<{ name: string; qty: number; price: number }>;
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
  { id: 'store-1', name: 'Kebab & Burger Middle East', category: 'Fast Food', rating: 4.8, estimate: '10–15 menit', emoji: '🌯', description: 'Kebab daging sapi, burger, dan hotdog dengan saus spesial.' },
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
  const [paymentInput, setPaymentInput] = useState('');
  const [paymentFeedback, setPaymentFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [successPopup, setSuccessPopup] = useState<string | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(() => readPaymentHistory());

  const categories = ['Semua', ...Array.from(new Set(STORES.map((store) => store.category)))];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PAYMENT_HISTORY_KEY, JSON.stringify(paymentHistory));
    }
  }, [paymentHistory]);

  useEffect(() => {
    if (!successPopup) return;

    const timer = window.setTimeout(() => setSuccessPopup(null), 2200);
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
    setPaymentFeedback(null);
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
    if (cart.length === 0) {
      setPaymentFeedback({ type: 'error', message: 'Keranjang masih kosong. Tambahkan menu terlebih dahulu.' });
      return;
    }

    setPaymentFeedback(null);
    setPaymentInput('');
    setCheckoutPage(true);
    setCartVisible(false);
  };

  const closeCheckoutPage = () => {
    setCheckoutPage(false);
    setPaymentInput('');
    setPaymentFeedback(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const storeProducts = selectedStore ? PRODUCTS.filter((product) => product.storeId === selectedStore.id) : [];

  const handlePayment = async () => {
    if (cart.length === 0) {
      setPaymentFeedback({ type: 'error', message: 'Keranjang masih kosong. Tambahkan menu terlebih dahulu.' });
      return;
    }

    const validation = validatePaymentAmount(cartTotal, paymentInput);

    if (!validation.ok) {
      setPaymentFeedback({ type: 'error', message: validation.message });
      return;
    }

    const transaction: PaymentHistoryItem = {
      id: `PAY-${Date.now()}`,
      createdAt: new Date().toISOString(),
      total: cartTotal,
      paid: validation.paid,
      change: validation.change,
      items: cart.map((item) => ({
        name: item.productName,
        qty: item.qty,
        price: item.unitPrice,
      })),
      status: 'Berhasil',
    };

    setPaymentHistory((prev) => [transaction, ...prev].slice(0, 10));
    setCart([]);
    setCartDrafts({});
    setPaymentInput('');
    setPaymentFeedback({
      type: 'success',
      message:
        validation.change > 0
          ? `Pembayaran berhasil. Kembalian ${formatRupiah(validation.change)}.`
          : 'Pembayaran berhasil. Uang pas.',
    });
    setSuccessPopup(`Transaksi berhasil! Total ${formatRupiah(transaction.total)}`);
    setCheckoutPage(false);
    setCartVisible(false);
  };

  return (
    <div className="app-shell">
      {successPopup && (
        <div className="success-popup" role="status" aria-live="polite">
          {successPopup}
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
              <h2>Checkout</h2>
            </div>

            <div className="checkout-layout">
              <div className="checkout-items-panel">
                <div className="section-heading compact">
                  <div>
                    <h3>Ringkasan Pesanan</h3>
                  </div>
                  <button className="subtle-button" onClick={() => setCart([])}>Hapus Semua</button>
                </div>

                {cart.length === 0 ? (
                  <div className="empty-cart">Keranjang kosong.</div>
                ) : (
                  cart.map((item) => (
                    <div key={item.productId} className="checkout-item">
                      <div>
                        <div className="checkout-item-name">{item.productName}</div>
                        <div className="checkout-item-store">{item.storeName}</div>
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
                  ))
                )}
              </div>

              <aside className="checkout-summary-panel">
                <h3>Detail Pembayaran</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>{formatRupiah(cartTotal)}</strong>
                </div>

                <label className="payment-field">
                  <span>Nominal Bayar</span>
                  <input
                    type="number"
                    min={0}
                    value={paymentInput}
                    onChange={(event) => {
                      setPaymentInput(event.target.value);
                      if (paymentFeedback) setPaymentFeedback(null);
                    }}
                    placeholder="Masukkan nominal"
                  />
                </label>

                {paymentFeedback && (
                  <div className={`payment-feedback ${paymentFeedback.type}`}>{paymentFeedback.message}</div>
                )}

                <button className="checkout-button full" onClick={handlePayment} disabled={cart.length === 0}>
                  Bayar Sekarang
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
                <p className="hero-copy">Pilih stand favoritmu, pesan menu, dan ambil langsung saat sudah siap.</p>
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
                        <strong>{entry.id}</strong>
                        <span className="history-status">{entry.status}</span>
                      </div>
                      <div className="history-item-meta">
                        <span>{new Date(entry.createdAt).toLocaleString('id-ID')}</span>
                        <span>{entry.items.length} item</span>
                      </div>
                      <div className="history-item-total">Total: {formatRupiah(entry.total)}</div>
                      <div className="history-item-detail">
                        <span>Bayar: {formatRupiah(entry.paid)}</span>
                        <span>Kembali: {formatRupiah(entry.change)}</span>
                      </div>
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
              <button onClick={() => { setCart([]); setCartVisible(false); setPaymentInput(''); setPaymentFeedback(null); }} className="clear-cart">
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

              <button className="checkout-button full" onClick={openCheckoutPage}>Checkout</button>
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
                    <strong>{new Date(item.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</strong>
                    <span className="history-status">{item.status}</span>
                  </div>
                  <div className="history-meta">Total: {formatRupiah(item.total)}</div>
                  <div className="history-meta">Bayar: {formatRupiah(item.paid)}</div>
                  <div className="history-meta">Kembalian: {formatRupiah(item.change)}</div>
                  <ul className="history-items">
                    {item.items.map((entry, index) => (
                      <li key={`${item.id}-${index}`}>{`${entry.name} x${entry.qty}`}</li>
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
