export type Mode = 'mahasiswa' | 'penjual';
export type View = 'store_list' | 'store_detail';
export type StoreStatus = 'Buka' | 'Tutup';
export type OrderStatus = 'Diproses' | 'Siap Diambil' | 'Selesai';

export interface Store { id: string; name: string; category: string; rating: number; reviewCount: number; status: StoreStatus; estimate: string; image: string; description: string; owner: string; location: string; }
export interface Product { id: string; storeId: string; name: string; category: string; price: number; stock: number; isAvailable: boolean; description: string; image: string; }
export interface CartItem extends Product { qty: number; }
export interface OrderItem { name: string; qty: number; price: number; }
export interface Order { id: string; storeId: string; customerName: string; time: string; status: OrderStatus; total: number; items: OrderItem[]; }
export type NewStore = Omit<Store, 'id' | 'rating' | 'reviewCount'>;
export type NewMenu = Omit<Product, 'id'>;
