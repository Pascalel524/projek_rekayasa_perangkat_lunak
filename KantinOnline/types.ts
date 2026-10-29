export type Mode = 'mahasiswa' | 'penjual';
export type View = 'store_list' | 'store_detail';
export type StoreStatus = 'Buka' | 'Tutup';
export type OrderStatus = 'Diproses' | 'Siap Diambil' | 'Selesai';
export type UserRole = 'pembeli' | 'penjual';
export type PaymentMethod = 'QRIS' | 'Saldo' | 'Tunai';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  balance: number;
  created_at: string;
}

export type RegisterUserData = {
  name: string;
  email: string;
  password: string;
}

export type UserIdentity = {
  id: string;
  email: string;
}

export type DatabaseProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
}

export type TransactionItemRecord = {
  id: string;
  transaction_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export type TransactionRecord = {
  id: string;
  user_id: string;
  total_price: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  created_at: string;
}

export type TransactionItemInput = {
  product_id: string;
  quantity: number;
}

export type SaveTransactionData = {
  total_price: number;
  payment_method: PaymentMethod;
  items: TransactionItemInput[];
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at' | 'balance' | 'role'> &
          Partial<Pick<UserProfile, 'created_at' | 'balance' | 'role'>>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>;
        Relationships: [];
      };
      products: {
        Row: DatabaseProduct;
        Insert: Omit<DatabaseProduct, 'id'> & { id?: string };
        Update: Partial<Omit<DatabaseProduct, 'id'>>;
        Relationships: [];
      };
      transactions: {
        Row: TransactionRecord;
        Insert: Omit<TransactionRecord, 'id' | 'created_at' | 'payment_status'> &
          Partial<Pick<TransactionRecord, 'id' | 'created_at' | 'payment_status'>>;
        Update: Partial<
          Pick<TransactionRecord, 'total_price' | 'payment_method' | 'payment_status'>
        >;
        Relationships: [
          {
            foreignKeyName: 'transactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      transaction_items: {
        Row: TransactionItemRecord;
        Insert: Omit<TransactionItemRecord, 'id'> & { id?: string };
        Update: Partial<Pick<TransactionItemRecord, 'quantity' | 'price'>>;
        Relationships: [
          {
            foreignKeyName: 'transaction_items_transaction_id_fkey';
            columns: ['transaction_id'];
            isOneToOne: false;
            referencedRelation: 'transactions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transaction_items_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      save_transaction: {
        Args: {
          p_total_price: number;
          p_payment_method: PaymentMethod;
          p_items: Json;
        };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  status: StoreStatus;
  estimate: string;
  image: string;
  description: string;
  owner: string;
  location: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  description: string;
  image: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  storeId: string;
  customerName: string;
  time: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
}

export type NewStore = Omit<Store, 'id' | 'rating' | 'reviewCount'>;
export type NewMenu = Omit<Product, 'id'>;
