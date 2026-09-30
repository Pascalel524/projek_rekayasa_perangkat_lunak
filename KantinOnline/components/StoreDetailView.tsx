import { useMemo, useState } from 'react';
import { ArrowLeft, Plus, UtensilsCrossed } from 'lucide-react';
import type { CartItem, Product, Store } from '../../KantinOnline/types';

interface Props { store: Store; products: Product[]; cart: CartItem[]; onBack: () => void; onAdd: (product: Product) => void; }
export function StoreDetailView({ store, products, cart, onBack, onAdd }: Props) {
  const [category, setCategory] = useState('Semua');
  const categories = useMemo(() => {
    const cats = ['Semua'];
    products.forEach((p) => {
      if (!cats.includes(p.category)) cats.push(p.category);
    });
    return cats;
  }, [products]);

  const filtered = useMemo(() => {
    if (category === 'Semua') return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-orange-600 font-semibold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Toko</span>
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800">{store.name}</h1>
            <p className="text-xs text-slate-500">{store.location} • Pemilik: {store.owner}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {store.status} • Estimasi {store.estimate}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${category === cat ? 'bg-orange-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm font-medium">Belum ada menu di kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const cartEntry = cart.find((c) => c.id === item.id);
            const inCartQty = cartEntry ? cartEntry.qty : 0;

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
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition duration-200">
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-orange-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow">{item.category}</span>
                  <span className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow ${stockBadgeClass}`}>{stockLabel}</span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Harga</span>
                      <span className="text-base font-black text-slate-900">Rp {item.price.toLocaleString('id-ID')}</span>
                    </div>

                    {inCartQty > 0 && (
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">{inCartQty}x di keranjang</span>
                    )}
                  </div>

                  <button onClick={() => onAdd(item)} disabled={!item.isAvailable || item.stock === 0} className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${item.isAvailable && item.stock > 0 ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-[0.98]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
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
