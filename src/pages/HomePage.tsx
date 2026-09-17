// src/pages/HomePage.tsx
import React, { useState } from 'react';
import CustomerLayout from '../layouts/CustomerLayout';
import BannerSlider from '../components/common/BannerSlider';
import ProductCard from '../components/product/ProductCard';
import type { Product } from '../types';

import carImg1 from '../assets/image/banner1.jpg';
import carImg2 from '../assets/image/banner2.jpg';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mb-01',
    name: 'Mercedes-AMG GT R Coupe Black Series V8 Bi-Turbo',
    price: 15990000000,
    category: 'Mercedes-AMG',
    stock: 2,
    imageUrl: carImg1,
  },
  {
    id: 'mb-02',
    name: 'Mercedes-Maybach S 680 4MATIC First-Class Edition',
    price: 18999000000,
    category: 'Maybach',
    stock: 3,
    imageUrl: carImg2,
  },
  {
    id: 'mb-03',
    name: 'Bộ Mâm Rèn Hợp Kim AMG 21-inch Đa Chấu Đen Mờ',
    price: 245000000,
    category: 'Phụ kiện',
    stock: 6,
    imageUrl: carImg1,
  },
  {
    id: 'mb-04',
    name: 'Chìa Khóa Bespoke Chế Tác Vàng Hồng & Carbon Siêu Nhẹ',
    price: 68000000,
    category: 'Phụ kiện',
    stock: 0,
    imageUrl: carImg2,
  },
];

export const HomePage: React.FC = () => {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Mercedes-AMG', 'Maybach', 'Phụ kiện'];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const handleAskAI = (product: Product) => {
    alert(`Đã chọn "${product.name}". Bạn hãy mở trợ lý AI góc phải dưới để xem phân tích thông số và cấu hình bespoke.`);
  };

  const handleAddToCart = (product: Product) => {
    alert(`Đã thêm thành công "${product.name}" vào danh sách báo giá/đặt cọc.`);
  };

  return (
    <CustomerLayout>
      {/* 1. BANNER  */}
      <BannerSlider />

      {/* 2. KHU VỰC SẢN PHẨM & BỘ LỌC CĂN GIỮA VỚI GIAO DIỆN DARK LUXURY */}
      <div className="w-full bg-[#090a0c] text-white py-16 transition-colors">
        <div className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl space-y-12">
          
          {/* Thanh Filter Danh mục */}
          <section className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#232328] pb-6 gap-6">
            <div>
              <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#b8955a] font-serif block mb-1">
                Authorized Collection
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-wider text-gray-100 uppercase">
                Bộ Sưu Tập Tiêu Biểu
              </h2>
              <p className="text-xs text-gray-400 mt-1 max-w-md font-light">
                Khám phá các kiệt tác công nghệ và phụ kiện cao cấp hỗ trợ bởi hệ thống cố vấn AI 24/7.
              </p>
            </div>

            {/* Các nút Tab Filter */}
            {/* <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-[#b8955a] text-black shadow-lg shadow-[#b8955a]/20'
                      : 'bg-[#151518] border border-[#2b2b30] text-gray-300 hover:border-[#b8955a] hover:text-[#b8955a]'
                  }`}
                >
                  {cat === 'all' ? 'Tất cả' : cat}
                </button>
              ))}
            </div> */}
          </section>

          {/* Lưới sản phẩm */}
          {/* <section>
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center text-xs text-gray-500 font-serif tracking-widest uppercase">
                Hiện không có sản phẩm nào thuộc phân mục này.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onAskAI={handleAskAI}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </section> */}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default HomePage;