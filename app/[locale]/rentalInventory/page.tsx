'use client';

import { useEffect, useState } from 'react';
import { client, type Product } from '../../admin/lib/amplify-client';

export default function rentalInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await client.models.Product.list({
          authMode: 'apiKey',
          filter: { isActive: { eq: true } },
        });
        const sorted = (res.data ?? []).sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
        );
        setProducts(sorted);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
      {products.map(p => (
        <div key={p.id}>
          <span>{p.icon ?? '▣'}</span>
          <h3>{p.name}</h3>
          <p>{p.category}</p>
          <p>{p.description}</p>
          <div style={{ display: 'flex', gap: 4 }}>
            {(p.tags ?? []).map(t => <span key={t}>{t}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}