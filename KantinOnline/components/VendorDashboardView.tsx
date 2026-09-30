import { Check, CheckCircle2, Clock, Package, Plus, TrendingUp, X } from 'lucide-react';
import type { Order, OrderStatus, Product, Store } from '../../KantinOnline/types';

interface Props { stores: Store[]; storeId: string; setStoreId: (id: string) => void; products: Product[]; orders: Order[]; onStock: (id: string, delta: number) => void; onToggle: (id: string) => void; onStatus: (id: string, status: OrderStatus) => void; onAddMenu: () => void; }
export function VendorDashboardView({ stores, storeId, setStoreId, products, orders, onStock, onToggle, onStatus, onAddMenu }: Props) {
  const store = stores.find((s) => s.id === storeId) || stores[0] || ({} as Store);

  const storeProducts = products.filter((p) => p.storeId === store.id);
  const storeOrders = orders.filter((o) => o.storeId === store.id);

  const totalRevenue = storeOrders
    .filter((o) => o.status === 'Selesai' || o.status === 'Siap Diambil' || o.status === 'Diproses')
    .reduce((acc, curr) => acc + curr.total, 0);

  const activeOrdersCount = storeOrders.filter((o) => o.status === 'Diproses').length;
  const completedTodayCount = storeOrders.filter((o) => o.status === 'Selesai').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">
            <span>Dashboard Pengelola Stand</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Selamat Datang, {store.owner}</h1>
          <p className="text-slate-400 text-xs mt-1">Kelola menu, update ketersediaan stok, dan pantau pesanan masuk secara langsung.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select value={store.id} onChange={(e) => setStoreId(e.target.value)} className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 font-semibold focus:outline-none">
            {stores.map((s) => (
              <option key={s.id} value={s.id}>🏪 {s.name}</option>
            ))}
          </select>

          <button onClick={onAddMenu} className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            <span>+ Tambah Menu Baru</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Pendapatan</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-black text-slate-900">Rp {totalRevenue.toLocaleString('id-ID')}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+8% dari kemarin</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pesanan Aktif</span>
            <span className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-black text-slate-900">{activeOrdersCount} Order</div>
          <span className="text-[10px] text-orange-600 font-semibold">Membutuhkan penanganan</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Selesai Hari Ini</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-black text-slate-900">{completedTodayCount} Transaksi</div>
          <span className="text-[10px] text-slate-400">Siap & telah diambil</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Jenis Menu</span>
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Package className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-black text-slate-900">{storeProducts.length} Item</div>
          <span className="text-[10px] text-slate-400">Terdaftar di toko ini</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-800">Manajemen Stok & Ketersediaan</h2>
              <p className="text-xs text-slate-500">Atur jumlah porsi dan sakelar ketersediaan menu</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-lg">{storeProducts.length} Menu</span>
          </div>

          <div className="space-y-3">
            {storeProducts.map((prod) => (
              <div key={prod.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-lg object-cover bg-slate-200" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{prod.name}</h4>
                    <p className="text-[11px] font-semibold text-orange-600">Rp {prod.price.toLocaleString('id-ID')}</p>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">{prod.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-200 bg-white rounded-lg p-0.5">
                    <button onClick={() => onStock(prod.id, -1)} className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded text-xs font-bold">-</button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">{prod.stock}</span>
                    <button onClick={() => onStock(prod.id, 1)} className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded text-xs font-bold">+</button>
                  </div>
                  <button onClick={() => onToggle(prod.id)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${prod.isAvailable ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'}`}>
                    {prod.isAvailable ? <> <Check className="w-3.5 h-3.5" /> <span>Ada</span> </> : <> <X className="w-3.5 h-3.5" /> <span>Habis</span> </>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2"> <span>Antrean Pesanan Masuk</span> <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" /> </h2>
              <p className="text-xs text-slate-500">Daftar pesanan baru yang harus disiapkan</p>
            </div>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-lg">{storeOrders.length} Order</span>
          </div>

          {storeOrders.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <p className="text-xs font-bold text-slate-600">Belum Ada Pesanan Masuk</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Pesanan yang dibuat mahasiswa akan langsung muncul di sini.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {storeOrders.map((order) => (
                <div key={order.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">{order.id}</span>
                      <h4 className="text-xs font-bold text-slate-800 mt-1">{order.customerName}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{order.time}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${order.status === 'Diproses' ? 'bg-amber-100 text-amber-800' : order.status === 'Siap Diambil' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{order.status}</span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700">
                        <span>{it.qty}x <span className="font-medium">{it.name}</span></span>
                        <span className="font-semibold">Rp {(it.price * it.qty).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 pt-1.5 mt-1.5 flex justify-between font-extrabold text-slate-900">
                      <span>Total Pemesanan:</span>
                      <span className="text-orange-600">Rp {order.total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div>
                    {order.status === 'Diproses' && (
                      <button onClick={() => onStatus(order.id, 'Siap Diambil')} className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">🔔 Tandai Siap Diambil</button>
                    )}

                    {order.status === 'Siap Diambil' && (
                      <button onClick={() => onStatus(order.id, 'Selesai')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">Pesanan Sudah Diambil Mahasiswa</button>
                    )}

                    {order.status === 'Selesai' && (
                      <div className="text-center text-[11px] text-emerald-600 font-bold bg-emerald-50 py-1.5 rounded-lg">✓ Transaksi Telah Selesai</div>
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
