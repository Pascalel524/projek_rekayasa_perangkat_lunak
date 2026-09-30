import { ChevronRight, ShoppingBag } from 'lucide-react';
import type { Mode, Store, View } from '../types';

interface Props { mode: Mode; setMode: (mode: Mode) => void; cartCount: number; cartTotal: number; onOpenCart: () => void; selectedStore?: Store; currentView: View; onBack: () => void; }
export function HeaderNavbar({ mode, setMode, cartCount, cartTotal, onOpenCart, selectedStore, currentView, onBack }: Props) {
  return <header className="sticky top-0 z-40 bg-orange-600 text-white shadow-lg"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16">
    <div className="flex items-center gap-3"><button onClick={onBack} className="flex items-center gap-2 font-bold text-xl"><span className="w-9 h-9 rounded-xl bg-white text-orange-600 flex items-c[...]
    <div className="flex items-center gap-2 sm:gap-4"><div className="bg-orange-700/80 p-1 rounded-full flex items-center text-xs sm:text-sm"><button onClick={() => setMode('mahasiswa')} className=[...]
  </div></div></header>;
}
