// src/pages/ProductDetailPage.tsx
import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import AIChatWidget from '../components/ai-chat/AIChatWidget';
import { VehicleDetailHeroSection } from '../sections/vehicleDetail/VehicleDetailHeroSection';
import { VehicleDetailSpecsSection } from '../sections/vehicleDetail/VehicleDetailSpecsSection';

export const ProductDetailPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9] text-zinc-900 select-none">
      {/* 1. Header trên cùng (dùng forceSolid hoặc nền sáng) */}
      <Header forceSolid />

      {/* 2. Nội dung chi tiết xe (Không có Banner) */}
      <main className="flex-1 w-full pb-24">
        <VehicleDetailHeroSection />
        <VehicleDetailSpecsSection />
      </main>

      {/* 3. Footer & Chatbot */}
      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default ProductDetailPage;