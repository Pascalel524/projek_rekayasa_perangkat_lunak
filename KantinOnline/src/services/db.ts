import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  Database,
  RegisterUserData,
  SaveTransactionData,
  UserIdentity,
  UserProfile,
} from '../../types';

let client: SupabaseClient<Database> | undefined;

function getClient(): SupabaseClient<Database> {
  if (client) {
    return client;
  }

  const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = import.meta.env;

  if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
    throw new Error(
      'Konfigurasi Supabase belum tersedia. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.',
    );
  }

  client = createClient<Database>(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
  return client;
}

export async function registerUser(userData: RegisterUserData): Promise<UserIdentity> {
  if (!userData.name.trim()) {
    throw new Error('Nama wajib diisi.');
  }

  const { data, error } = await getClient().auth.signUp({
    email: userData.email.trim().toLowerCase(),
    password: userData.password,
    options: {
      data: { name: userData.name.trim() },
    },
  });

  if (error) {
    throw new Error(`Registrasi gagal: ${error.message}`);
  }

  if (!data.user?.email) {
    throw new Error('Supabase tidak mengembalikan identitas pengguna setelah registrasi.');
  }

  return { id: data.user.id, email: data.user.email };
}

export async function loginUser(email: string, password: string): Promise<UserIdentity> {
  const { data, error } = await getClient().auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    throw new Error(`Login gagal: ${error.message}`);
  }

  if (!data.user?.email) {
    throw new Error('Supabase tidak mengembalikan identitas pengguna setelah login.');
  }

  return { id: data.user.id, email: data.user.email };
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await getClient()
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal mengambil profil pengguna: ${error.message}`);
  }

  if (!data) {
    throw new Error('Profil pengguna tidak ditemukan atau tidak dapat diakses.');
  }

  return data;
}

export async function saveTransaction(transactionData: SaveTransactionData): Promise<string> {
  const supabase = getClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Gagal memverifikasi sesi pengguna: ${authError.message}`);
  }

  if (!authData.user) {
    throw new Error('Login diperlukan untuk menyimpan transaksi.');
  }

  const { data, error } = await supabase.rpc('save_transaction', {
    p_total_price: transactionData.total_price,
    p_payment_method: transactionData.payment_method,
    p_items: transactionData.items,
  });

  if (error) {
    throw new Error(`Gagal menyimpan transaksi: ${error.message}`);
  }

  return data;
}

export async function getTransactionHistory(userId: string) {
  const { data, error } = await getClient()
    .from('transactions')
    .select('*, transaction_items(*, products(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Gagal mengambil riwayat transaksi: ${error.message}`);
  }

  return data;
}
