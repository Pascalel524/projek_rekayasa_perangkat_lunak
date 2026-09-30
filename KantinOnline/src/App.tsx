import React, { useMemo, useState } from 'react';

type Store = {
  id: number;
  name: string;
  category: string;
  rating: number;
  estimate: string;
  emoji: string;
  description: string;
};

const stores: Store[] = [
  { id: 1, name: 'Kebab & Burger Middle East', category: 'Fast Food', rating: 4.8, estimate: '10–15 menit', emoji: '🌯', description: 'Kebab daging sapi, burger, dan hotdog dengan saus khas.' },
  { id: 2, name: 'Ayam Geprek Kampus', category: 'Ayam & Nasi', rating: 4.9, estimate: '15–20 menit', emoji: '🍗', description: 'Ayam geprek renyah dengan sambal pilihan level 1–10.' },
  { id: 3, name: 'Kedai Kopi Mahasiswa', category: 'Minuman & Snack', rating: 4.7, estimate: '5–10 menit', emoji: '☕', description: 'Kopi susu gula aren, toast, dan minuman segar.' },
  { id: 4, name: 'Dapur Ricebox & Bento', category: 'Ayam & Nasi', rating: 4.6, estimate: '10–15 menit', emoji: '🍱', description: 'Ricebox hangat dengan pilihan topping favorit.' },
  { id: 5, name: 'Jus Buah Segar Kampus', category: 'Minuman & Snack', rating: 4.9, estimate: '5–8 menit', emoji: '🥤', description: 'Jus buah segar tanpa pemanis buatan.' },
  { id: 6, name: 'Bakso & Mie Ayam Pak Kumis', category: 'Mie & Bakso', rating: 4.7, estimate: '15–20 menit', emoji: '🍜', description: 'Bakso urat dan mie ayam dengan kuah kaldu gurih.' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [cartCount, setCartCount] = useState(0);

  const categories = ['Semua', ...Array.from(new Set(stores.map((store) => store.category)))];
  const filteredStores = useMemo(() => stores.filter((store) => {
    const matchesQuery = `${store.name} ${store.category} ${store.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === 'Semua' || store.category === category);
  }), [query, category]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">K</span><span>KantinOnline</span></div>
        <button className="cart-button" onClick={() => setCartCount((count) => count + 1)}>🛒 Keranjang ({cartCount})</button>
      </header>

      <main className="container">
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
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </section>

        <div className="section-heading"><div><h2>Stand kantin</h2><p>{filteredStores.length} stand ditemukan</p></div><span className="status">● Semua buka</span></div>

        <section className="store-grid">
          {filteredStores.map((store) => (
            <article className="store-card" key={store.id}>
              <div className="store-image">{store.emoji}<span className="open-label">Buka</span></div>
              <div className="store-content">
                <div className="card-meta"><span>{store.category}</span><strong>★ {store.rating}</strong></div>
                <h3>{store.name}</h3>
                <p>{store.description}</p>
                <div className="card-footer"><span>⏱ {store.estimate}</span><button onClick={() => setCartCount((count) => count + 1)}>Tambah</button></div>
              </div>
            </article>
          ))}
        </section>
        {filteredStores.length === 0 && <div className="empty-state">Stand tidak ditemukan. Coba kata kunci lain.</div>}
      </main>
    </div>
  );
}
