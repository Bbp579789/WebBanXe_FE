import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types";
import type { AiConversationStatus, AiMessage } from "../types/ai.types";
import { aiChatService, getAiErrorMessage, getAiErrorStatus } from "../services/api/aiService";

// Khung chat đang mở thì cứ 3 giây hỏi lại để nhận tin nhân viên trả lời
const POLL_INTERVAL_MS = 3000;

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function toChatMessage(message: AiMessage): ChatMessage {
  let sender: ChatMessage["sender"] = "bot";
  if (message.sender_type === "user") sender = "user";
  if (message.sender_type === "admin") sender = "admin";
  if (message.sender_type === "system") sender = "system";

  return {
    id: String(message.id),
    sender: sender,
    content: message.content,
    timestamp: formatTime(message.created_at),
    products: message.extra?.products || [],
    sources: message.extra?.sources || [],
    mode: message.extra?.mode,
  };
}

function errorMessage(text: string): ChatMessage {
  return {
    id: "error-" + Date.now(),
    sender: "system",
    content: text,
    timestamp: formatTime(new Date().toISOString()),
  };
}

export function useAIChat(isOpen: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<AiConversationStatus | null>(null);

  // id tin cuối đã hiện, để lần sau chỉ lấy tin mới hơn
  const lastIdRef = useRef(0);
  // Đang gửi tin thì tạm không hỏi lại, tránh hiện trùng tin
  const sendingRef = useRef(false);

  // Thêm tin mới vào cuối, bỏ qua tin đã có
  const appendMessages = useCallback((newMessages: AiMessage[]) => {
    if (newMessages.length === 0) return;
    for (const message of newMessages) {
      lastIdRef.current = Math.max(lastIdRef.current, message.id);
    }
    setMessages((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const added = newMessages.filter((item) => !existingIds.has(String(item.id))).map(toChatMessage);
      return [...prev, ...added];
    });
  }, []);

  const loadHistory = useCallback(async () => {
    if (sendingRef.current) return;
    try {
      const data = await aiChatService.getHistory(lastIdRef.current);
      appendMessages(data.messages);
      setStatus(data.status);
    } catch (error) {
      // Hỏi lại định kỳ: lỗi thì im lặng, lần sau thử tiếp
      console.warn("Không tải được lịch sử chat:", getAiErrorMessage(error));
    }
  }, [appendMessages]);

  // Đăng nhập hoặc đăng xuất: xóa khung chat, tải lại hội thoại của người mới
  const resetChat = useCallback(() => {
    lastIdRef.current = 0;
    setMessages([]);
    setStatus(null);
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    window.addEventListener("authChange", resetChat);
    return () => window.removeEventListener("authChange", resetChat);
  }, [resetChat]);

  // Mở khung chat: tải lịch sử ngay, rồi hỏi lại định kỳ đến khi đóng
  useEffect(() => {
    if (!isOpen) return;
    loadHistory();
    const timer = setInterval(loadHistory, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isOpen, loadHistory]);

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || isLoading) return;

    // Hiện ngay tin của khách trong lúc chờ bot trả lời
    const tempId = "temp-" + Date.now();
    const tempMessage: ChatMessage = {
      id: tempId,
      sender: "user",
      content: trimmedText,
      timestamp: formatTime(new Date().toISOString()),
    };
    setMessages((prev) => [...prev, tempMessage]);
    setIsLoading(true);
    sendingRef.current = true;

    try {
      const data = await aiChatService.sendMessage(trimmedText);
      const realMessages: AiMessage[] = [data.user_message];
      if (data.reply) {
        realMessages.push({
          id: data.reply.id,
          conversation_id: data.conversation_id,
          channel: "web",
          sender_type: data.reply.sender_type,
          sender_id: null,
          content: data.reply.content,
          extra: { mode: data.reply.mode, products: data.reply.products, sources: data.reply.sources },
          created_at: data.reply.created_at,
        });
      }
      // Bỏ tin tạm, thay bằng tin thật
      setMessages((prev) => prev.filter((item) => item.id !== tempId));
      appendMessages(realMessages);
      setStatus(data.status);
    } catch (error) {
      let text = getAiErrorMessage(error);
      if (getAiErrorStatus(error) === 401) {
        text = "Phiên đăng nhập đã hết hạn. Vui lòng đăng xuất và đăng nhập lại.";
      }
      setMessages((prev) => [...prev, errorMessage(text)]);
    } finally {
      sendingRef.current = false;
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    status,
    sendMessage,
  };
}
