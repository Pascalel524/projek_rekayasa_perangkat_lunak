import type { Order, Product, Store } from './types';

export const STORE_CATEGORIES = ['Semua', 'Kebab & Fast Food', 'Ayam & Nasi', 'Minuman & Snack', 'Mie & Bakso'];

export const INITIAL_STORES: Store[] = [
  { id: 'store-1', name: 'Stand Kebab & Burger Middle East', category: 'Kebab & Fast Food', rating: 4.8, reviewCount: 142, status: 'Buka', estimate: '10-15 min', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80', description: 'Kebab renyah bertabur daging sapi pilihan, mayo gurih, dan saus rempah khas.', owner: 'Pak Farhan', location: 'Kantin Utama - Stand #03' },
  { id: 'store-2', name: 'Ayam Geprek & Penyet Kampus', category: 'Ayam & Nasi', rating: 4.9, reviewCount: 230, status: 'Buka', estimate: '15-20 min', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80', description: 'Ayam krispi renyah ditumbuk dengan sambal korek pedas level 1-10.', owner: 'Bu Endang', location: 'Kantin Utama - Stand #01' },
  { id: 'store-3', name: 'Kedai Kopi & Toast Mahasiswa', category: 'Minuman & Snack', rating: 4.7, reviewCount: 98, status: 'Buka', estimate: '5-10 min', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', description: 'Kopi susu gula aren segar, roti bakar keju leleh, dan matcha latte.', owner: 'Mas Dimas', location: 'Kantin Utama - Stand #07' },
  { id: 'store-4', name: 'Dapur Ricebox & Bento', category: 'Ayam & Nasi', rating: 4.6, reviewCount: 85, status: 'Buka', estimate: '10-15 min', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', description: 'Nasi hangat dengan topping chicken teriyaki, beef blackpepper, dan telur mata sapi.', owner: 'Chef Rendy', location: 'Kantin Timur - Stand #12' },
  { id: 'store-5', name: 'Jus & Es Buah Segar Kampus', category: 'Minuman & Snack', rating: 4.9, reviewCount: 175, status: 'Buka', estimate: '5-8 min', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80', description: 'Aneka jus buah asli tanpa pemanis buatan, es buah spesial, dan alpukat kocok.', owner: 'Mbak Dewi', location: 'Kantin Barat - Stand #05' },
  { id: 'store-6', name: 'Bakso & Mie Ayam Pak Kumis', category: 'Mie & Bakso', rating: 4.7, reviewCount: 210, status: 'Tutup', estimate: '15-20 min', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', description: 'Bakso urat jumbo gurih dan mie ayam kenyal kuah kaldu sapi mantap.', owner: 'Pak Slamet', location: 'Kantin Utama - Stand #02' }
];

const image = 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=500&q=80';
export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p-1', storeId: 'store-1', name: 'Kebab Original Beef (Large)', category: 'Kebab', price: 15000, stock: 15, isAvailable: true, description: 'Daging sapi panggang gurih, tortila lembut, saus keju spesial.', image },
  { id: 'p-2', storeId: 'store-1', name: 'Kebab Keju Mozzarella Melt', category: 'Kebab', price: 18000, stock: 3, isAvailable: true, description: 'Kebab daging sapi dipadu keju mozzarella melimpah.', image },
  { id: 'p-3', storeId: 'store-1', name: 'Hotdog Sosis Jumbo BBQ', category: 'Hotdog', price: 16000, stock: 10, isAvailable: true, description: 'Roti lembut berisi sosis panggang jumbo dan saus BBQ.', image },
  { id: 'p-4', storeId: 'store-1', name: 'Double Beef Burger Crispy', category: 'Burger', price: 22000, stock: 0, isAvailable: false, description: 'Dua lapis daging sapi premium dan keju cheddar.', image },
  { id: 'p-5', storeId: 'store-1', name: 'Kebab Ayam Crispy Pedas', category: 'Kebab', price: 14000, stock: 8, isAvailable: true, description: 'Potongan ayam renyah dengan saus pedas manis.', image },
  { id: 'p-6', storeId: 'store-2', name: 'Nasi Ayam Geprek Sambal Korek', category: 'Ayam & Nasi', price: 15000, stock: 20, isAvailable: true, description: 'Nasi hangat dan ayam krispi dengan sambal bawang.', image },
  { id: 'p-7', storeId: 'store-2', name: 'Nasi Ayam Geprek Keju Melt', category: 'Ayam & Nasi', price: 19000, stock: 5, isAvailable: true, description: 'Ayam geprek pedas dengan lelehan mozzarella.', image },
  { id: 'p-8', storeId: 'store-3', name: 'Es Kopi Susu Aren Kampus', category: 'Minuman & Snack', price: 12000, stock: 25, isAvailable: true, description: 'Espresso dengan susu segar dan gula aren asli.', image },
  { id: 'p-9', storeId: 'store-3', name: 'Roti Bakar Cokelat Keju', category: 'Minuman & Snack', price: 10000, stock: 12, isAvailable: true, description: 'Roti tawar tebal dengan meses dan keju.', image }
];

export const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-101', storeId: 'store-1', customerName: 'Mahasiswa #101 (Rian)', time: '10:15 WIB', status: 'Diproses', total: 33000, items: [{ name: 'Kebab Original Beef (Large)', qty: 1, price: 15000 }, { name: 'Kebab Keju Mozzarella Melt', qty: 1, price: 18000 }] },
  { id: 'ORD-102', storeId: 'store-1', customerName: 'Mahasiswa #204 (Siti)', time: '10:22 WIB', status: 'Siap Diambil', total: 16000, items: [{ name: 'Hotdog Sosis Jumbo BBQ', qty: 1, price: 16000 }] }
];
