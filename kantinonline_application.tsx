import React, { useState, useMemo } from 'react';
import {
  Store,
  ShoppingBag,
  Search,
  Plus,
  ArrowLeft,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Package,
  ChevronRight,
  User,
  ShoppingBasket,
  Trash2,
  X,
  SlidersHorizontal,
  Check,
  UtensilsCrossed,
  Coffee,
  Sparkles,
  Bell,
  ChefHat
} from 'lucide-react';


const INITIAL_STORES = [
  {
    id: 'store-1',
    name: 'Stand Kebab & Burger Middle East',
    category: 'Kebab & Fast Food',
    rating: 4.8,
    reviewCount: 142,
    status: 'Buka',
    estimate: '10-15 min',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80',
    description: 'Kebab renyah bertabur daging sapi pilihan, mayo gurih, dan saus rempah khas.',
    owner: 'Pak Farhan',
    location: 'Kantin Utama - Stand #03'
  },
  {
    id: 'store-2',
    name: 'Ayam Geprek & Penyet Kampus',
    category: 'Ayam & Nasi',
    rating: 4.9,
    reviewCount: 230,
    status: 'Buka',
    estimate: '15-20 min',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    description: 'Ayam krispi renyah ditumbuk dengan sambal korek pedas level 1-10.',
    owner: 'Bu Endang',
    location: 'Kantin Utama - Stand #01'
  },
  {
    id: 'store-3',
    name: 'Kedai Kopi & Toast Mahasiswa',
    category: 'Minuman & Snack',
    rating: 4.7,
    reviewCount: 98,
    status: 'Buka',
    estimate: '5-10 min',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    description: 'Kopi susu gula aren segar, roti bakar keju leleh, dan matcha latte.',
    owner: 'Mas Dimas',
    location: 'Kantin Utama - Stand #07'
  },
  {
    id: 'store-4',
    name: 'Dapur Ricebox & Bento',
    category: 'Ayam & Nasi',
    rating: 4.6,
    reviewCount: 85,
    status: 'Buka',
    estimate: '10-15 min',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Nasi hangat dengan topping chicken teriyaki, beef blackpepper, dan telur mata sapi.',
    owner: 'Chef Rendy',
    location: 'Kantin Timur - Stand #12'
  },
  {
    id: 'store-5',
    name: 'Jus & Es Buah Segar Kampus',
    category: 'Minuman & Snack',
    rating: 4.9,
    reviewCount: 175,
    status: 'Buka',
    estimate: '5-8 min',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    description: 'Aneka jus buah asli tanpa pemanis buatan, es buah spesial, dan alpukat kocok.',
    owner: 'Mbak Dewi',
    location: 'Kantin Barat - Stand #05'
  },
  {
    id: 'store-6',
    name: 'Bakso & Mie Ayam Pak Kumis',
    category: 'Mie & Bakso',
    rating: 4.7,
    reviewCount: 210,
    status: 'Tutup',
    estimate: '15-20 min',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    description: 'Bakso urat jumbo gurih dan mie ayam kenyal kuah kaldu sapi mantap.',
    owner: 'Pak Slamet',
    location: 'Kantin Utama - Stand #02'
  }
];

const INITIAL_PRODUCTS = [
  // Store 1: Kebab
  {
    id: 'p-1',
    storeId: 'store-1',
    name: 'Kebab Original Beef (Large)',
    category: 'Kebab',
    price: 15000,
    stock: 15,
    isAvailable: true,
    description: 'Daging sapi panggang gurih, tortila lembut, saus keju spesial & saus tomat/sambal.',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'p-2',
    storeId: 'store-1',
    name: 'Kebab Keju Mozzarella Melt',
    category: 'Kebab',
    price: 18000,
    stock: 3,
    isAvailable: true,
    description: 'Kebab daging sapi dipadu keju mozzarella melimpah yang mulur lezat.',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'p-3',
    storeId: 'store-1',
    name: 'Hotdog Sosis Jumbo BBQ',
    category: 'Hotdog',
    price: 16000,
    stock: 10,
    isAvailable: true,
    description: 'Roti lembut berisikan sosis panggang jumbo, saus BBQ, mustard dan bumbu herbs.',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'p-4',
    storeId: 'store-1',
    name: 'Double Beef Burger Crispy',
    category: 'Burger',
    price: 22000,
    stock: 0,
    isAvailable: false,
    description: 'Dua lapis daging sapi premium, keju cheddar, selada segar & saus rahasia.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'p-5',
    storeId: 'store-1',
    name: 'Kebab Ayam Crispy Pedas',
    category: 'Kebab',
    price: 14000,
    stock: 8,
    isAvailable: true,
    description: 'Potongan ayam renyah ditaburi saus pedas manis guriih dalam gulungan kebab.',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=500&q=80'
  },

  // Store 2: Ayam Geprek
  {
    id: 'p-6',
    storeId: 'store-2',
    name: 'Nasi Ayam Geprek Sambal Korek',
    category: 'Ayam & Nasi',
    price: 15000,
    stock: 20,
    isAvailable: true,
    description: 'Nasi putih hangat, ayam paha/dada krispi digeprek dengan sambal bawang segar.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'p-7',
    storeId: 'store-2',
    name: 'Nasi Ayam Geprek Keju Melt',
    category: 'Ayam & Nasi',
    price: 19000,
    stock: 5,
    isAvailable: true,
    description: 'Ayam geprek pedas disiram lelehan keju mozzarella dan parutan keju cheddar.',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=500&q=80'
  },

  // Store 3: Kopi & Toast
  {
    id: 'p-8',
    storeId: 'store-3',
    name: 'Es Kopi Susu Aren Kampus',
    category: 'Minuman & Snack',
    price: 12000,
    stock: 25,
    isAvailable: true,
    description: 'Espresso blend Arabika & Robusta dengan susu segar dan sirup gula aren asli.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'p-9',
    storeId: 'store-3',
    name: 'Roti Bakar Cokelat Keju',
    category: 'Minuman & Snack',
    price: 10000,
    stock: 12,
    isAvailable: true,
    description: 'Roti tawar tebal dipanggang mentega dengan isian meses meises & keju tebal.',
    image: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=500&q=80'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-101',
    storeId: 'store-1',
    customerName: 'Mahasiswa #101 (Rian)',
    time: '10:15 WIB',
    status: 'Diproses',
    total: 33000,
    items: [
      { name: 'Kebab Original Beef (Large)', qty: 1, price: 15000 },
      { name: 'Kebab Keju Mozzarella Melt', qty: 1, price: 18000 }
    ]
  },
  {
    id: 'ORD-102',
    storeId: 'store-1',
    customerName: 'Mahasiswa #204 (Siti)',
    time: '10:22 WIB',
    status: 'Siap Diambil',
    total: 16000,
    items: [
      { name: 'Hotdog Sosis Jumbo BBQ', qty: 1, price: 16000 }
    ]
  }
];


function HeaderNavbar({
  mode,
  setMode,
  cartCount,
  cartTotal,
  onOpenCart,
  selectedStore,
  currentView,
  onBackToDirectory
}) {
  return (
    <header className="sticky top-0 z-40 bg-orange-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onBackToDirectory}
              className="flex items-center gap-2 font-bold text-xl tracking-tight text-white hover:opacity-90 transition"
            >
              <div className="w-9 h-9 rounded-xl bg-white text-orange-600 flex items-center justify-center font-extrabold shadow-md">
                K
              </div>
              <span className="hidden sm:inline">KantinOnline</span>
            </button>

            {/* Breadcrumb if in Store Detail */}
            {currentView === 'store_detail' && selectedStore && (
              <div className="hidden md:flex items-center text-xs text-orange-100 bg-orange-700/60 px-3 py-1.5 rounded-full border border-orange-500/30">
                <span>Daftar Toko</span>
                <ChevronRight className="w-3 h-3 mx-1 opacity-70" />
                <span className="font-semibold text-white truncate max-w-[150px]">
                  {selectedStore.name}
                </span>
              </div>
            )}
          </div>

          {/* Center/Right Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Mode Switcher Pill */}
            <div className="bg-orange-700/80 p-1 rounded-full flex items-center border border-orange-500/40 text-xs sm:text-sm">
              <button
                onClick={() => setMode('mahasiswa')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition ${
                  mode === 'mahasiswa'
                    ? 'bg-white text-orange-700 shadow-sm'
                    : 'text-orange-100 hover:text-white'
                }`}
              >
                <span>🎓</span>
                <span>Mode Mahasiswa</span>
              </button>
              <button
                onClick={() => setMode('penjual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition ${
                  mode === 'penjual'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-orange-100 hover:text-white'
                }`}
              >
                <span>🏪</span>
                <span>Mode Penjual</span>
              </button>
            </div>

            {/* Cart Button (For Mahasiswa Mode) */}
            {mode === 'mahasiswa' && (
              <button
                onClick={onOpenCart}
                className="relative bg-orange-700 hover:bg-orange-800 text-white px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 font-medium border border-orange-500/40 transition shadow-inner"
              >
                <ShoppingBag className="w-5 h-5 text-orange-100" />
                <span className="hidden sm:inline text-xs font-semibold bg-orange-800 px-2 py-0.5 rounded-md">
                  Rp {cartTotal.toLocaleString('id-ID')}
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-orange-600 shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}


function StoreDirectoryView({
  stores,
  onSelectStore,
  onOpenAddStore,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}) {
  const categories = ['Semua', 'Kebab & Fast Food', 'Ayam & Nasi', 'Minuman & Snack', 'Mie & Bakso'];

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchQuery =
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCat =
        selectedCategory === 'Semua' || store.category === selectedCategory;

      return matchQuery && matchCat;
    });
  }, [stores, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Banner / Intro */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <UtensilsCrossed className="w-72 h-72" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-orange-700/60 text-orange-100 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-orange-400/30">
            Kantin Kampus Terpadu
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold mt-3 tracking-tight">
            Pesan Makanan Tanpa Antre, Ambil Langsung Di Stand!
          </h1>
          <p className="text-orange-100 mt-2 text-sm sm:text-base">
            Pilih stand pilihanmu, pesan menu favorit, dan bayar dengan mudah. Pesananmu diproses secara real-time!
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Filter & Add Store */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari stand kantin, kebab, ayam geprek, kopi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Add Store Button */}
        <button
          onClick={onOpenAddStore}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ Daftarkan Stand</span>
        </button>
      </div>

      {/* Stores Grid Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Daftar Stand Kantin</h2>
          <p className="text-xs text-slate-500">
            Menampilkan {filteredStores.length} stand aktif saat ini
          </p>
        </div>
      </div>

      {/* Stores Grid */}
      {filteredStores.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Tidak ada stand ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1">
            Coba kata kunci pencarian lain atau pilih kategori yang berbeda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => {
            const isOpen = store.status === 'Buka';
            return (
              <div
                key={store.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col group"
              >
                {/* Store Banner Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-md ${
                        isOpen
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {store.status}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{store.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({store.reviewCount})
                    </span>
                  </div>

                  {/* Location & Category inside Image Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-600/90 text-white px-2 py-0.5 rounded">
                      {store.category}
                    </span>
                  </div>
                </div>

                {/* Store Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition">
                      {store.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {store.description}
                    </p>
                  </div>

                  {/* Meta details */}
                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <span>{store.estimate}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {store.location}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => onSelectStore(store.id)}
                    disabled={!isOpen}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                      isOpen
                        ? 'bg-slate-900 hover:bg-orange-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>{isOpen ? 'Pilih Toko / Lihat Menu' : 'Toko Sedang Tutup'}</span>
                    {isOpen && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


function StoreDetailView({
  store,
  products,
  onBack,
  onAddToCart,
  cartItems
}) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Categories extracted from this store's products
  const productCategories = useMemo(() => {
    const cats = ['Semua'];
    products.forEach((p) => {
      if (!cats.includes(p.category)) cats.push(p.category);
    });
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Semua') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header & Navigation Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-orange-600 font-semibold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Toko</span>
          </button>
          
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800">{store.name}</h1>
            <p className="text-xs text-slate-500">
              {store.location} • Pemilik: {store.owner}
            </p>
          </div>
        </div>

        {/* Quick status pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {store.status} • Estimasi {store.estimate}
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {productCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items Grid - Matching Screenshot 1 Requirements */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm font-medium">Belum ada menu di kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => {
            // Find existing quantity in cart
            const cartEntry = cartItems.find((c) => c.id === item.id);
            const inCartQty = cartEntry ? cartEntry.qty : 0;

            // Stock badge color styling logic
            let stockBadgeClass = 'bg-emerald-500 text-white';
            let stockLabel = `Tersedia: ${item.stock}`;

            if (!item.isAvailable || item.stock === 0) {
              stockBadgeClass = 'bg-rose-600 text-white';
              stockLabel = 'Stok Habis';
            } else if (item.stock <= 3) {
              stockBadgeClass = 'bg-amber-500 text-white';
              stockLabel = `Sisa ${item.stock}!`;
            }

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition duration-200"
              >
                {/* Image & Badges */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Top-Left Category Badge */}
                  <span className="absolute top-3 left-3 bg-orange-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow">
                    {item.category}
                  </span>

                  {/* Top-Right Stock Badge */}
                  <span
                    className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow ${stockBadgeClass}`}
                  >
                    {stockLabel}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Harga</span>
                      <span className="text-base font-black text-slate-900">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {inCartQty > 0 && (
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                        {inCartQty}x di keranjang
                      </span>
                    )}
                  </div>

                  {/* Dark Navy Full-Width Button matching requirements */}
                  <button
                    onClick={() => onAddToCart(item)}
                    disabled={!item.isAvailable || item.stock === 0}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      item.isAvailable && item.stock > 0
                        ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-[0.98]'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Tambah Ke Keranjang</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


function VendorDashboardView({
  stores,
  selectedVendorStoreId,
  setSelectedVendorStoreId,
  products,
  onUpdateProductStock,
  onToggleAvailability,
  orders,
  onUpdateOrderStatus,
  onOpenAddMenu
}) {
  const currentStore = stores.find((s) => s.id === selectedVendorStoreId) || stores[0];

  // Filter products for this vendor store
  const storeProducts = useMemo(() => {
    return products.filter((p) => p.storeId === currentStore.id);
  }, [products, currentStore]);

  // Filter active orders for this vendor store
  const storeOrders = useMemo(() => {
    return orders.filter((o) => o.storeId === currentStore.id);
  }, [orders, currentStore]);

  // Calculate statistics
  const totalRevenue = useMemo(() => {
    return storeOrders
      .filter((o) => o.status === 'Selesai' || o.status === 'Siap Diambil' || o.status === 'Diproses')
      .reduce((acc, curr) => acc + curr.total, 0);
  }, [storeOrders]);

  const activeOrdersCount = storeOrders.filter((o) => o.status === 'Diproses').length;
  const completedTodayCount = storeOrders.filter((o) => o.status === 'Selesai').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Vendor Header Banner - Dark Slate Background */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">
            <ChefHat className="w-4 h-4" />
            <span>Dashboard Pengelola Stand</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Selamat Datang, {currentStore.owner}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Kelola menu, update ketersediaan stok, dan pantau pesanan masuk secara langsung.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Store Switcher Dropdown */}
          <select
            value={currentStore.id}
            onChange={(e) => setSelectedVendorStoreId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                🏪 {s.name}
              </option>
            ))}
          </select>

          {/* Add Menu Button */}
          <button
            onClick={onOpenAddMenu}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Menu Baru</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Pendapatan */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Pendapatan</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-black text-slate-900">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">+8% dari kemarin</span>
        </div>

        {/* Pesanan Aktif */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pesanan Aktif</span>
            <span className="p-1.5 bg-orange-50 text-orange-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {activeOrdersCount} Order
          </div>
          <span className="text-[10px] text-orange-600 font-semibold">Membutuhkan penanganan</span>
        </div>

        {/* Selesai Hari Ini */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Selesai Hari Ini</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {completedTodayCount} Transaksi
          </div>
          <span className="text-[10px] text-slate-400">Siap & telah diambil</span>
        </div>

        {/* Total Jenis Menu */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Jenis Menu</span>
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {storeProducts.length} Item
          </div>
          <span className="text-[10px] text-slate-400">Terdaftar di toko ini</span>
        </div>

      </div>

      {/* Two Column Layout matching Screenshot 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Manajemen Stok & Ketersediaan (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-800">Manajemen Stok & Ketersediaan</h2>
              <p className="text-xs text-slate-500">Atur jumlah porsi dan sakelar ketersediaan menu</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-lg">
              {storeProducts.length} Menu
            </span>
          </div>

          <div className="space-y-3">
            {storeProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{prod.name}</h4>
                    <p className="text-[11px] font-semibold text-orange-600">
                      Rp {prod.price.toLocaleString('id-ID')}
                    </p>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">
                      {prod.category}
                    </span>
                  </div>
                </div>

                {/* Right controls: Stepper & Toggle */}
                <div className="flex items-center gap-4">
                  {/* Stepper Controls */}
                  <div className="flex items-center border border-slate-200 bg-white rounded-lg p-0.5">
                    <button
                      onClick={() => onUpdateProductStock(prod.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">
                      {prod.stock}
                    </span>
                    <button
                      onClick={() => onUpdateProductStock(prod.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded text-xs font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Toggle Switch (Ada / Habis) */}
                  <button
                    onClick={() => onToggleAvailability(prod.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                      prod.isAvailable
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {prod.isAvailable ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Ada</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" />
                        <span>Habis</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Antrean Pesanan Masuk (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>Antrean Pesanan Masuk</span>
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              </h2>
              <p className="text-xs text-slate-500">Daftar pesanan baru yang harus disiapkan</p>
            </div>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-lg">
              {storeOrders.length} Order
            </span>
          </div>

          {storeOrders.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">Belum Ada Pesanan Masuk</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Pesanan yang dibuat mahasiswa akan langsung muncul di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {storeOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50/30 space-y-3"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {order.id}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 mt-1">
                        {order.customerName}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{order.time}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          order.status === 'Diproses'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'Siap Diambil'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Item List */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700">
                        <span>
                          {it.qty}x <span className="font-medium">{it.name}</span>
                        </span>
                        <span className="font-semibold">
                          Rp {(it.price * it.qty).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 pt-1.5 mt-1.5 flex justify-between font-extrabold text-slate-900">
                      <span>Total Pemesanan:</span>
                      <span className="text-orange-600">
                        Rp {order.total.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {order.status === 'Diproses' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Siap Diambil')}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow transition"
                      >
                        <Bell className="w-3.5 h-3.5 text-amber-400" />
                        <span>🔔 Tandai Siap Diambil</span>
                      </button>
                    )}

                    {order.status === 'Siap Diambil' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Selesai')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pesanan Sudah Diambil Mahasiswa</span>
                      </button>
                    )}

                    {order.status === 'Selesai' && (
                      <div className="text-center text-[11px] text-emerald-600 font-bold bg-emerald-50 py-1.5 rounded-lg">
                        ✓ Transaksi Telah Selesai
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}


function CartModal({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  stores
}) {
  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-orange-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <ShoppingBag className="w-5 h-5" />
            <span>Keranjang Belanja Saya</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-orange-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <ShoppingBasket className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Keranjang masih kosong</p>
              <p className="text-xs text-slate-400">
                Pilih menu lezat dari stand kantin favoritmu sekarang!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const store = stores.find((s) => s.id === item.storeId);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                        <span className="text-[10px] text-orange-600 font-semibold block">
                          {store ? store.name : 'Stand Kantin'}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">
                          Rp {item.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Stepper */}
                      <div className="flex items-center border border-slate-300 bg-white rounded-lg">
                        <button
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold rounded-l"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold rounded-r"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold text-slate-800">
              <span>Total Pembayaran:</span>
              <span className="text-lg text-orange-600">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              * Pembayaran tunai / QRIS saat pengambilan di stand kantin.
            </p>
            <button
              onClick={onCheckout}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-3 rounded-xl shadow-lg transition text-sm flex items-center justify-center gap-2"
            >
              <span>Konfirmasi & Buat Pesanan Sekarang</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

function AddStoreModal({ isOpen, onClose, onAddStore }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Kebab & Fast Food');
  const [owner, setOwner] = useState('');
  const [location, setLocation] = useState('Kantin Utama - Stand #08');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !owner) return;

    onAddStore({
      name,
      category,
      owner,
      location,
      description: description || 'Stand makanan dan minuman lezat berkualitas kampus.',
      rating: 5.0,
      reviewCount: 1,
      status: 'Buka',
      estimate: '10-15 min',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
    });

    setName('');
    setOwner('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base">
            <Store className="w-5 h-5 text-orange-500" />
            <span>Daftarkan Stand Kantin Baru</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nama Stand / Toko</label>
            <input
              type="text"
              required
              placeholder="Contoh: Stand Kebab Delight Kampus"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Kategori Stand</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Kebab & Fast Food">Kebab & Fast Food</option>
              <option value="Ayam & Nasi">Ayam & Nasi</option>
              <option value="Minuman & Snack">Minuman & Snack</option>
              <option value="Mie & Bakso">Mie & Bakso</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Nama Penjual / Pengelola</label>
            <input
              type="text"
              required
              placeholder="Contoh: Pak Herman"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Lokasi Stand</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Deskripsi Singkat</label>
            <textarea
              rows={2}
              placeholder="Jelaskan keunikan menu stand Anda..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl shadow-md transition mt-2"
          >
            Simpan Stand Baru
          </button>
        </form>
      </div>
    </div>
  );
}

function AddMenuModal({ isOpen, onClose, onAddMenu, storeId }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Kebab');
  const [price, setPrice] = useState('15000');
  const [stock, setStock] = useState('10');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    onAddMenu({
      storeId,
      name,
      category,
      price: parseInt(price) || 10000,
      stock: parseInt(stock) || 10,
      isAvailable: true,
      description: description || 'Menu renyah nan lezat dibuat segar saat dipesan.',
      image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=500&q=80'
    });

    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base">
            <Plus className="w-5 h-5 text-orange-500" />
            <span>Tambah Menu Makanan Baru</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nama Menu Item</label>
            <input
              type="text"
              required
              placeholder="Contoh: Kebab Sapi Double Keju"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Kategori Badge</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Kebab / Hotdog / Burger"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Harga (Rp)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Stok Awal</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Deskripsi Menu</label>
            <textarea
              rows={2}
              placeholder="Karakteristik rasa, bahan utama..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl shadow-md transition mt-2"
          >
            + Simpan Ke Menu Stand
          </button>
        </form>
      </div>
    </div>
  );
}


export default function App() {
  // Navigation & Mode States
  const [mode, setMode] = useState('mahasiswa'); // 'mahasiswa' | 'penjual'
  const [currentView, setCurrentView] = useState('store_list'); // 'store_list' | 'store_detail'
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedVendorStoreId, setSelectedVendorStoreId] = useState('store-1');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Core Data States
  const [stores, setStores] = useState(INITIAL_STORES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [cart, setCart] = useState([]);

  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  // Toast Banner Notification
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Currently Active Selected Store in Mahasiswa Mode
  const activeSelectedStore = useMemo(() => {
    return stores.find((s) => s.id === selectedStoreId);
  }, [stores, selectedStoreId]);

  // Selected Store Products
  const activeStoreProducts = useMemo(() => {
    if (!selectedStoreId) return [];
    return products.filter((p) => p.storeId === selectedStoreId);
  }, [products, selectedStoreId]);

  // Handlers
  const handleSelectStore = (storeId) => {
    setSelectedStoreId(storeId);
    setCurrentView('store_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDirectory = () => {
    setCurrentView('store_list');
    setSelectedStoreId(null);
  };

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`✓ ${product.name} berhasil ditambahkan ke keranjang!`);
  };

  const handleUpdateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
    const newOrder = {
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      storeId: cart[0].storeId,
      customerName: `Mahasiswa #${Math.floor(100 + Math.random() * 800)}`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      status: 'Diproses',
      total,
      items: cart.map((i) => ({ name: i.name, qty: i.qty, price: i.price }))
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    showToast(`🎉 Pesanan ${newOrder.id} berhasil dibuat! Silahkan tunggu konfirmasi stand.`);
  };

  // Vendor Actions
  const handleUpdateProductStock = (productId, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStock = Math.max(0, p.stock + delta);
          return {
            ...p,
            stock: nextStock,
            isAvailable: nextStock > 0 ? p.isAvailable : false
          };
        }
        return p;
      })
    );
  };

  const handleToggleAvailability = (productId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, isAvailable: !p.isAvailable };
        }
        return p;
      })
    );
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Status pesanan ${orderId} diperbarui ke "${newStatus}"`);
  };

  const handleAddStore = (newStoreData) => {
    const id = `store-${Date.now()}`;
    const storeObj = { id, ...newStoreData };
    setStores((prev) => [storeObj, ...prev]);
    showToast(`Stand "${newStoreData.name}" berhasil terdaftar!`);
  };

  const handleAddMenu = (newMenuData) => {
    const id = `p-${Date.now()}`;
    const menuObj = { id, ...newMenuData };
    setProducts((prev) => [menuObj, ...prev]);
    showToast(`Menu "${newMenuData.name}" berhasil ditambahkan!`);
  };

  const cartTotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 antialiased selection:bg-orange-500 selection:text-white pb-12">
      
      {/* Universal Header Navbar */}
      <HeaderNavbar
        mode={mode}
        setMode={setMode}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        selectedStore={activeSelectedStore}
        currentView={currentView}
        onBackToDirectory={handleBackToDirectory}
      />

      {/* Dynamic Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Body Switcher */}
      <main>
        {mode === 'penjual' ? (
          <VendorDashboardView
            stores={stores}
            selectedVendorStoreId={selectedVendorStoreId}
            setSelectedVendorStoreId={setSelectedVendorStoreId}
            products={products}
            onUpdateProductStock={handleUpdateProductStock}
            onToggleAvailability={handleToggleAvailability}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onOpenAddMenu={() => setIsAddMenuOpen(true)}
          />
        ) : currentView === 'store_list' ? (
          <StoreDirectoryView
            stores={stores}
            onSelectStore={handleSelectStore}
            onOpenAddStore={() => setIsAddStoreOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        ) : (
          <StoreDetailView
            store={activeSelectedStore}
            products={activeStoreProducts}
            onBack={handleBackToDirectory}
            onAddToCart={handleAddToCart}
            cartItems={cart}
          />
        )}
      </main>

      {/* Modals */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        stores={stores}
      />

      <AddStoreModal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        onAddStore={handleAddStore}
      />

      <AddMenuModal
        isOpen={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        onAddMenu={handleAddMenu}
        storeId={selectedVendorStoreId}
      />

    </div>
  );
}