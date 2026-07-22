import React from 'react';

export default function ProductCard({ id, name, price, category, description, icon }) {
  return (
    <div className="relative group bg-cyber-card border border-cyber-border rounded-xl p-6 transition-all duration-300 hover:border-cyber-blue hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--accent-glow)] overflow-hidden">
      {/* Dynamic Hover Indicator Border */}
      <span className="absolute top-0 left-0 right-0 h-[3px] bg-cyber-blue scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
      
      {/* Product Icon */}
      <div className="text-4xl mb-4 select-none group-hover:scale-110 transition-transform duration-300 inline-block">
        {icon || '🛍️'}
      </div>

      {/* Product Information */}
      <h3 className="font-sans font-bold text-lg text-cyber-title group-hover:text-cyber-blue-light transition-colors mb-1 tracking-wide uppercase">
        {name}
      </h3>
      <p className="text-sm text-cyber-dim text-justify leading-relaxed mb-4 min-h-[36px]">
        {description}
      </p>

      {/* Pricing & Category Tags */}
      <div className="flex items-center justify-between border-t border-cyber-border/40 pt-4 mt-auto">
        <span className="font-mono font-bold text-xl text-cyber-blue-light">
          {price}
        </span>
        <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-cyber-dim bg-cyber-black border border-cyber-border px-2.5 py-1 rounded">
          {category}
        </span>
      </div>
    </div>
  );
}
