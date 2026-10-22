import { describe, expect, it } from 'vitest';
import { filterStores } from './catalog';

describe('Catalog business rules', () => {
  it('mencari toko berdasarkan nama', () => {
    const stores = [
      { id: 's1', name: 'Ayam Geprek Kampus', category: 'Ayam & Nasi', status: 'Buka', description: 'Ayam geprek pedas' },
      { id: 's2', name: 'Kedai Kopi Mahasiswa', category: 'Minuman & Snack', status: 'Buka', description: 'Kopi susu' }
    ];

    const result = filterStores(stores, 'kopi', 'Semua');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s2');
  });

  it('memfilter toko berdasarkan kategori', () => {
    const stores = [
      { id: 's1', name: 'Ayam Geprek Kampus', category: 'Ayam & Nasi', status: 'Buka', description: 'Ayam geprek pedas' },
      { id: 's2', name: 'Kedai Kopi Mahasiswa', category: 'Minuman & Snack', status: 'Buka', description: 'Kopi susu' }
    ];

    const result = filterStores(stores, '', 'Minuman & Snack');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s2');
  });

  it('mengembalikan semua toko jika query kosong', () => {
    const stores = [
      { id: 's1', name: 'Ayam Geprek Kampus', category: 'Ayam & Nasi', status: 'Buka', description: 'Ayam geprek pedas' },
      { id: 's2', name: 'Kedai Kopi Mahasiswa', category: 'Minuman & Snack', status: 'Buka', description: 'Kopi susu' }
    ];

    const result = filterStores(stores, '', 'Semua');
    expect(result).toHaveLength(2);
  });

  it('tidak menampilkan toko yang tidak sesuai kategori', () => {
    const stores = [
      { id: 's1', name: 'Ayam Geprek Kampus', category: 'Ayam & Nasi', status: 'Buka', description: 'Ayam geprek pedas' },
      { id: 's2', name: 'Kedai Kopi Mahasiswa', category: 'Minuman & Snack', status: 'Buka', description: 'Kopi susu' }
    ];

    const result = filterStores(stores, 'ayam', 'Minuman & Snack');
    expect(result).toHaveLength(0);
  });

  it('mencari berdasarkan deskripsi toko', () => {
    const stores = [
      { id: 's1', name: 'Ayam Geprek Kampus', category: 'Ayam & Nasi', status: 'Buka', description: 'Ayam geprek pedas' },
      { id: 's2', name: 'Kedai Kopi Mahasiswa', category: 'Minuman & Snack', status: 'Buka', description: 'Kopi susu' }
    ];

    const result = filterStores(stores, 'pedas', 'Semua');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s1');
  });
});
