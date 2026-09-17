import React from 'react';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAskAI?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAskAI,
}) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-gray-700 shadow-sm">
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900" title={product.name}>
          {product.name}
        </h3>

        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-lg font-bold text-blue-600">
            {product.price.toLocaleString('vi-VN')} đ
          </span>
          <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            disabled={product.stock === 0}
            className="w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Thêm vào giỏ
          </button>
          <button
            type="button"
            onClick={() => onAskAI?.(product)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 py-1.5 text-xs font-medium text-purple-700 transition hover:bg-purple-100"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            Hỏi Trợ lý AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;