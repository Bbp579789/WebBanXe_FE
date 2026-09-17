import React, { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import AIChatWidget from '../components/ai-chat/AIChatWidget';
import type { ChatMessage } from '../types';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const [cartCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    setIsLoading(true);
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: `Hệ thống AI đã tiếp nhận câu hỏi: "${text}".`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSearch = (keyword: string) => {
    console.log('Tìm kiếm từ khóa:', keyword);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
      {/* Header cố định ở đỉnh màn hình */}
      <Header cartCount={cartCount} onSearch={handleSearch} />

  
      <main className="flex-1 w-full">
  {children}
</main>

      <Footer />

      {/* Nút chat AI cố định góc phải màn hình */}
      <AIChatWidget
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default CustomerLayout;  