import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import AIChatWidget from '../components/ai-chat/AIChatWidget';
import { CartHeroSection } from '../sections/cart/CartHeroSection';
import { CartContainerSection } from '../sections/cart/CartContainerSection';

export const CartPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-zinc-900 select-none">
      {/* 1. Header trên cùng */}
      <Header forceSolid />

      {/* 2. Nội dung giỏ hàng */}
      <main className="flex-1 w-full pb-24 pt-20">
        <CartHeroSection />
        <CartContainerSection />
      </main>

      {/* 3. Footer & Chatbot */}
      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default CartPage;