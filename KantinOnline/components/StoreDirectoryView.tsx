import { useMemo } from 'react';
import { ChevronRight, Clock, Plus, Search, Star, Store, UtensilsCrossed, X } from 'lucide-react';
import { STORE_CATEGORIES } from '../../KantinOnline/data';
import type { Store as StoreType } from '../../KantinOnline/types';

interface Props { stores: StoreType[]; onSelect: (id: string) => void; onAdd: () => void; search: string; setSearch: (value: string) => void; category: string; setCategory: (value: string) => void; }
export function StoreDirectoryView({ stores, onSelect, onAdd, search, setSearch, category, setCategory }: Props) {
  const filtered = useMemo(
    () =>
      stores.filter(
        (s) =>
          (s.name + s.category + s.description).toLowerCase().includes(search.toLowerCase()) &&
          (category === 'Semua' || s.category === category)
      ),
    [stores, search, category]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white">
        <UtensilsCrossed className="w-24 h-24 opacity-10 absolute -right-10 -bottom-10 pointer-events-none" />
        <span className="bg-orange-700/60 text-orange-100 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-orange-400/30">
          Kantin Kampus Terpadu
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold mt-3 tracking-tight">Pesan Makanan Tanpa Antre, Ambil Langsung Di Stand!</h1>
        <p className="text-orange-100 mt-2 text-sm sm:text-base">Pilih stand pilihanmu, pesan menu favorit, dan bayar dengan mudah.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari stand kantin, kebab, ayam geprek, kopi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {STORE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                category === cat ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button onClick={onAdd} className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold">
          <Plus className="w-4 h-4" />
          <span>+ Daftarkan Stand</span>
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold">Daftar Stand Kantin</h2>
        <p className="text-xs text-slate-500">Menampilkan {filtered.length} stand</p>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Tidak ada stand ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1">Coba kata kunci pencarian lain atau pilih kategori yang berbeda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((store) => {
            const isOpen = store.status === 'Buka';
            return (
              <div key={store.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col group">
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-md ${isOpen ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {store.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{store.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({store.reviewCount})</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-600/90 text-white px-2 py-0.5 rounded">{store.category}</span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition">{store.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{store.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1 text-slate-600"><Clock className="w-3.5 h-3.5 text-orange-500" /><span>{store.estimate}</span></div>
                    <div className="text-slate-400 text-[11px]">{store.location}</div>
                  </div>
                  <button onClick={() => onSelect(store.id)} disabled={!isOpen} className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${isOpen ? 'bg-slate-900 hover:bg-orange-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
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
