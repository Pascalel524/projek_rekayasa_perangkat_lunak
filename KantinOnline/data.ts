import type { Order, Product, Store } from './types';

export const STORE_CATEGORIES = ['Semua', 'Kebab & Fast Food', 'Ayam & Nasi', 'Minuman & Snack', 'Mie & Bakso'];

export const INITIAL_STORES: Store[] = [
  {
    id: 'store-1',
    name: 'Stand Kebab & Burger Middle East',
    category: 'Kebab & Fast Food',
    rating: 4.8,
    reviewCount: 142,
    status: 'Buka',
    estimate: '10-15 min',
    image: 'https://images.unsplash.com/photo-1541542684-0d5f3b3d3f2b?auto=format&fit=crop&w=500&q=80',
    description: 'Daging sapi panggang gurih dengan sayur segar dan saus khas.',
    owner: 'Pengelola Kebab',
    location: 'Area A'
  },
  {
    id: 'store-2',
    name: 'Ayam Geprek & Penyet Kampus',
    category: 'Ayam & Nasi',
    rating: 4.9,
    reviewCount: 230,
    status: 'Buka',
    estimate: '15-20 min',
    image: 'https://images.unsplash.com/photo-1604908177522-7f0f4a8f8c6b?auto=format&fit=crop&w=500&q=80',
    description: 'Ayam geprek pedas dan sambal pilihan kampus.',
    owner: 'Warung Geprek',
    location: 'Area B'
  },
  {
    id: 'store-3',
    name: 'Kedai Kopi & Toast Mahasiswa',
    category: 'Minuman & Snack',
    rating: 4.7,
    reviewCount: 98,
    status: 'Buka',
    estimate: '5-10 min',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80',
    description: 'Kopi segar dan roti bakar untuk teman kuliah.',
    owner: 'Kedai Kopi',
    location: 'Area C'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p-1', storeId: 'store-1', name: 'Kebab Original Beef (Large)', category: 'Kebab', price: 15000, stock: 15, isAvailable: true, description: 'Kebab daging sapi panggang gurih dengan sayur segar.', image: 'https://images.unsplash.com/photo-1604908177522-7f0f4a8f8c6b?auto=format&fit=crop&w=400&q=80' },
  { id: 'p-2', storeId: 'store-1', name: 'Kebab Keju Mozzarella', category: 'Kebab', price: 18000, stock: 3, isAvailable: true, description: 'Kebab dengan lelehan keju mozzarella.', image: 'https://images.unsplash.com/photo-1541542684-0d5f3b3d3f2b?auto=format&fit=crop&w=400&q=80' },
  { id: 'p-3', storeId: 'store-2', name: 'Nasi Ayam Geprek Sambal Korek', category: 'Ayam & Nasi', price: 15000, stock: 20, isAvailable: true, description: 'Nasi hangat dan ayam krispi dengan sambal korek.', image: 'https://images.unsplash.com/photo-1606756799454-1c7f20b3d3c0?auto=format&fit=crop&w=400&q=80' },
  { id: 'p-4', storeId: 'store-3', name: 'Es Kopi Susu Aren', category: 'Minuman & Snack', price: 12000, stock: 25, isAvailable: true, description: 'Espresso dengan susu segar dan gula aren.', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80' }
];

export const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-101', storeId: 'store-1', customerName: 'Mahasiswa #101 (Rian)', time: '10:15 WIB', status: 'Diproses', total: 15000, items: [{ name: 'Kebab Original Beef (Large)', qty: 1, price: 15000 }] },
  { id: 'ORD-102', storeId: 'store-3', customerName: 'Mahasiswa #204 (Siti)', time: '10:22 WIB', status: 'Siap Diambil', total: 12000, items: [{ name: 'Es Kopi Susu Aren', qty: 1, price: 12000 }] }
];
