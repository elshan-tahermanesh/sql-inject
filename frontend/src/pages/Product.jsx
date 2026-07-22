import React from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { Database } from 'lucide-react';

const mockProducts = [
  { id: 1, name: 'Laptop Pro', price: '$999', category: 'Electronics', description: 'High performance laptop for developers and power users.', icon: '💻' },
  { id: 2, name: 'Smartphone X', price: '$699', category: 'Electronics', description: 'Latest flagship smartphone featuring advanced camera modules.', icon: '📱' },
  { id: 3, name: 'Wireless Headphones', price: '$299', category: 'Audio', description: 'Premium active noise cancelling over-ear headphones.', icon: '🎧' },
  { id: 4, name: 'Mechanical Keyboard', price: '$149', category: 'Accessories', description: 'Full sized custom switches mechanical keyboard with RGB backlights.', icon: '⌨️' },
  { id: 5, name: '4K Monitor', price: '$499', category: 'Electronics', description: 'Ultra-wide 34-inch color-accurate 4K gaming display monitor.', icon: '🖥️' },
  { id: 6, name: 'Gaming Mouse', price: '$79', category: 'Accessories', description: 'High precision lightweight gaming mouse with optical sensors.', icon: '🖱️' }
];

export default function Product() {
  return (
    <div className="space-y-8 select-none">
      {/* Header title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold uppercase tracking-wider text-cyber-title flex items-center gap-3">
          <Database className="text-cyber-blue w-8 h-8" />
          Database <span className="text-cyber-blue">Catalog Explorer</span>
        </h1>
        <p className="text-cyber-dim text-sm text-justify leading-relaxed">
          Browse the mock database tables currently active in our laboratory. These product records are retrieved, compiled, and displayed on screen, serving as the target vectors for search and dump simulations.
        </p>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            id={prod.id}
            name={prod.name}
            price={prod.price}
            category={prod.category}
            description={prod.description}
            icon={prod.icon}
          />
        ))}
      </div>
    </div>
  );
}
