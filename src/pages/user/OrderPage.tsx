
import React from 'react';

import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import AIChatWidget from '../../components/ai-chat/AIChatWidget';

import { OrderContentSection } from '../../sections/order/OrderContentSection';

export const OrderPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-zinc-900 select-none">

      {/* 1. Header */}
      <Header forceSolid />

      {/* 2. Nội dung quản lý hợp đồng */}
      <main className="flex-1 w-full pt-28 pb-20">
        <OrderContentSection />
      </main>

      {/* 3. Footer & Chatbot */}
      <Footer />
      <AIChatWidget />

    </div>
  );
};

export default OrderPage;
