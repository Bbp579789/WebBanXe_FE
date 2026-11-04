import { useState } from "react";
import type { ChatMessage } from "../types";

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Phản hồi mẫu để kiểm tra giao diện, chưa gọi API
  const sendMessage = (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText || isLoading) return;

    const timeString = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Tin nhắn khách hàng
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      content: trimmedText,
      timestamp: timeString,
    };

    // Phản hồi mẫu của chatbot
    const botMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "bot",
      content:
        "Cảm ơn Quý khách đã quan tâm đến Maybach Atelier. Hiện tại tôi đang ở chế độ giới thiệu giao diện. Chức năng tư vấn AI sẽ sớm được cập nhật.",
      timestamp: timeString,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
}