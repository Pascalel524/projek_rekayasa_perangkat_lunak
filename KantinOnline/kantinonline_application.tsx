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

            {currentView === 'store_detail' && selectedStore && (
              <div className="hidden md:flex items-center text-xs text-orange-100 bg-orange-700/60 px-3 py-1.5 rounded-full border border-orange-500/30">
                <span>Daftar Toko</span>
                <ChevronRight className="w-3 h-3 mx-1 opacity-70" />
                <span className="font-semibold text-white truncate max-w-[150px]">{selectedStore.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
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

            {mode === 'mahasiswa' && (
              <button
                onClick={onOpenCart}
                className="relative bg-orange-700 hover:bg-orange-800 text-white px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 font-medium border border-orange-500/40 transition shadow-inner"
              >
                <ShoppingBag className="w-5 h-5 text-orange-100" />
                <span className="hidden sm:inline text-xs font-semibold bg-orange-800 px-2 py-0.5 rounded-md">Rp {cartTotal.toLocaleString('id-ID')}</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-orange-600 shadow-md">{cartCount}</span>
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
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <UtensilsCrossed className="w-72 h-72" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-orange-700/60 text-orange-100 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-orange-400/30">Kantin Kampus Terpadu</span>
          <h1 className="text-2xl sm:text-4xl font-extrabold mt-3 tracking-tight">Pesan Makanan Tanpa Antre, Ambil Langsung Di Stand!</h1>
          <p className="text-orange-100 mt-2 text-sm sm:text-base">Pilih stand pilihanmu, pesan menu favorit, dan bayar dengan mudah. Pesananmu diproses secara real-time!</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari stand kantin, kebab, ayam geprek, kopi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          />

