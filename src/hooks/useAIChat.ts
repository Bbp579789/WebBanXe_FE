import { useState } from 'react';
import { askAiConcierge } from '../services/api/chatService';
import type { ChatMessage } from '../types';

export function useAIChat() {
const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Thêm tin nhắn của khách vào UI
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: text.trim(),
      timestamp: timeString,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Gửi request đến AI backend
      const reply = await askAiConcierge(text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: reply || 'Hệ thống đang đồng bộ dữ liệu Atelier. Quý khách vui lòng thử lại sau.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Lỗi phản hồi chatbot:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: 'Chuyên viên AI đang bảo trì kết nối. Quý khách vui lòng liên hệ hotline để được hỗ trợ.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
}