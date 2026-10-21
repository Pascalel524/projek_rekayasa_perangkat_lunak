import React, { useMemo, useState } from 'react';
import { loginUser, registerUser } from './auth';

type AuthMode = 'login' | 'register';

type FormState = {
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

const emptyForm: FormState = {
  email: '',
  password: '',
  confirmPassword: '',
};

const SESSION_KEY = 'kantinonline_session';

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

function QuantityAdder({ onAdd }: { onAdd: (qty: number) => void }) {
  const [value, setValue] = useState<string>('1');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;

    if (next === '') {
      setValue('');
      return;
    }

    const parsed = Number(next);
    if (Number.isFinite(parsed) && parsed > 0) {
      setValue(String(Math.floor(parsed)));
    }
  };

  const handleAdd = () => {
    const parsed = Number(value);
    onAdd(Number.isFinite(parsed) && parsed > 0 ? parsed : 1);
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
          if (!value || Number(value) <= 0) {
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

function MainKantinApp({ userEmail, onLogout }: { userEmail: string | null; onLogout: () => void }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [cartVisible, setCartVisible] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const categories = ['Semua', ...Array.from(new Set(STORES.map((s) => s.category)))];

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
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + qty } : i));
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
        .map((i) => (i.productId === productId ? { ...i, qty: Math.max(0, qty) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const storeProducts = selectedStore ? PRODUCTS.filter((p) => p.storeId === selectedStore.id) : [];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">K</span>
          <span>KantinOnline</span>
        </div>
        <div className="topbar-actions">
          <span className="user-pill">{userEmail ?? 'Mahasiswa'}</span>
          <button className="cart-button" onClick={() => setCartVisible((v) => !v)}>🛒 Keranjang ({cartCount})</button>
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="container">
        {!selectedStore ? (
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
              <input aria-label="Cari stand" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari stand, kebab, kopi..." />
              <select aria-label="Filter kategori" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedStore(store);
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
          </>
        ) : (
          <>
            <div className="store-detail-header">
              <button className="back-button" onClick={() => setSelectedStore(null)}>↩ Kembali</button>
              <div className="store-title">{selectedStore.name}</div>
              <div className="store-meta">{selectedStore.category} · ★ {selectedStore.rating}</div>
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

      {cartVisible && (
        <div className="cart-panel">
          <div className="cart-header">
            <strong>Keranjang</strong>
            <div className="cart-actions">
              <button onClick={() => { setCart([]); setCartVisible(false); }} className="clear-cart">Kosongkan</button>
              <button onClick={() => setCartVisible(false)} className="close-cart">Tutup</button>
            </div>
          </div>

          {cart.length === 0 && <div className="empty-cart">Keranjang kosong</div>}

          {cart.map((item) => (
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
                  value={item.qty}
                  onChange={(e) => {
                    const nextQty = Number(e.target.value);
                    updateCartQty(item.productId, Number.isFinite(nextQty) && nextQty > 0 ? nextQty : 0);
                  }}
                />
                <button onClick={() => removeFromCart(item.productId)} className="remove-item">Hapus</button>
              </div>
            </div>
          ))}

          {cart.length > 0 && (
            <div className="checkout-box">
              <div className="total-row">
                <div>Total</div>
                <div className="total-price">Rp {cartTotal.toLocaleString('id-ID')}</div>
              </div>
              <button className="checkout-button">Checkout</button>
            </div>
          )}
        </div>
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (message) setMessage(null);
  };

  const handleLoginSuccess = (email: string) => {
    setLoggedInUser(email);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SESSION_KEY, email);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SESSION_KEY);
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

      const result = await registerUser(email, password);

      if (!result.ok) {
        setMessage({ type: 'error', text: result.error.message });
        setIsSubmitting(false);
        return;
      }

      setMessage({ type: 'success', text: `Pendaftaran berhasil untuk ${result.data.email}. Silakan login.` });
      setForm({ ...emptyForm });
      setMode('login');
      setIsSubmitting(false);
      return;
    }

    const result = await loginUser(email, password);

    if (!result.ok) {
      setMessage({ type: 'error', text: result.error.message });
      setIsSubmitting(false);
      return;
    }

    handleLoginSuccess(result.data.email);
    setMessage({ type: 'success', text: `Login berhasil. Selamat datang, ${result.data.email}.` });
    setForm({ ...emptyForm });
    setIsSubmitting(false);
  };

  if (loggedInUser) {
    return <MainKantinApp userEmail={loggedInUser} onLogout={handleLogout} />;
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
            ? 'Akun harus didaftarkan terlebih dahulu sebelum bisa login.'
            : 'Jika belum punya akun, silakan register dulu.'}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={updateField('email')}
              placeholder="nama@student.pradita.ac.id"
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
            {isSubmitting ? 'Memproses...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

