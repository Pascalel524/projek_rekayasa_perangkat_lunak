export type Store = {
  id: string;
  name: string;
  category: string;
  status: 'Buka' | 'Tutup';
  description: string;
};

export function filterStores(stores: Store[], query: string, category: string) {
  const q = query.trim().toLowerCase();
  return stores.filter((store) => {
    const matchQuery =
      !q ||
      store.name.toLowerCase().includes(q) ||
      store.category.toLowerCase().includes(q) ||
      store.description.toLowerCase().includes(q);

    const matchCategory = category === 'Semua' || store.category === category;

    return matchQuery && matchCategory;
  });
}
