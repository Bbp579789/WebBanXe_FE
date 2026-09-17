import React, { useState, useRef, useEffect } from 'react';
import botAvatar from '../../assets/icon/bot.svg';
import { type ChatMessage } from '../../types';
import ChatMessageItem from './ChatMessageItem';

interface AIChatWidgetProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onSendMessage: (text: string) => void;
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  messages,
  isLoading = false,
  onSendMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-80 sm:w-96 flex-col overflow-hidden rounded-2xl border border-[#b8955a]/40 bg-[#121316]/95 backdrop-blur-xl shadow-2xl shadow-black/80 transition-all duration-300">
          
          {/* HEADER CONCIERGE SANG TRỌNG */}
          <div className="flex items-center justify-between border-b border-[#28292e] bg-[#16171b] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-9 w-9 rounded-full border border-[#b8955a]/80 p-0.5 bg-black/40 flex items-center justify-center">
                  <img
                    src={botAvatar}
                    alt="AI Concierge"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                {/* Chấm trạng thái trực tuyến */}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#10b981] border-2 border-[#16171b]" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold tracking-wider uppercase text-gray-100 flex items-center gap-1.5">
                  AI Concierge
                  <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-[#b8955a]/20 text-[#b8955a] font-normal border border-[#b8955a]/30">
                  24/7
                  </span>
                </h4>
                <p className="text-[10px] text-gray-400 font-light tracking-wide">
                  Tư vấn và hỗ trợ khách hàng trực tuyến
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition"
              title="Thu nhỏ"
            >
              ✕
            </button>
          </div>

          {/* KHU VỰC NỘI DUNG TIN NHẮN */}
          <div className="flex-1 space-y-3.5 overflow-y-auto p-4 bg-[#0d0e11]/70">
            {messages.length === 0 ? (
              <div className="mt-12 flex flex-col items-center text-center px-4">
                <div className="h-10 w-10 rounded-full border border-[#b8955a]/40 flex items-center justify-center text-[#b8955a] mb-3">
                  <svg className="h-5 w-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path d="M12 2v20M12 12L3.5 7M12 12l8.5-5M12 12L4 18M12 12l8 6" />
                  </svg>
                </div>
                <p className="text-xs font-serif text-gray-300 tracking-wide uppercase">
                  Mercedes-Benz Intelligent Advisor
                </p>
                <p className="text-[11px] text-gray-500 mt-2 font-light leading-relaxed">
                  Xin chào quý khách. Hãy cho tôi biết nhu cầu để nhận phân tích thông số xe, gói bespoke hoặc kiểm tra tình trạng đơn hàng.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} />
              ))
            )}

            {/* Trạng thái AI đang suy nghĩ */}
            {isLoading && (
              <div className="flex items-center gap-1.5 rounded-xl bg-[#1b1c22] border border-[#2b2c34] px-3 py-2 text-xs text-[#b8955a] w-fit shadow-md">
                <span className="text-[10px] uppercase font-mono tracking-wider mr-1 text-gray-400">AI Đang soạn</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#b8955a] animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#b8955a] animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#b8955a] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô NHẬP LIỆU */}
          <form onSubmit={handleSubmit} className="border-t border-[#26272e] bg-[#141519] p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Đặt câu hỏi cho cố vấn AI..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 rounded-xl border border-[#2d2e37] bg-[#1c1d24] px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#b8955a] focus:bg-[#20212a] focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="flex items-center justify-center rounded-xl bg-[#b8955a] px-3.5 py-2 text-xs font-semibold text-black hover:bg-[#c9a76d] active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none"
              >
                Gửi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* NÚT MỞ WIDGET CHAT TRÒN NỔI BẬT */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1a1b20] to-[#0c0d10] border border-[#b8955a]/70 text-[#b8955a] shadow-xl shadow-black/60 transition-all duration-300 hover:scale-105 hover:border-[#b8955a] active:scale-95"
      >
        {/* Vòng sáng viền mờ */}
        <div className="absolute inset-0 rounded-full bg-[#b8955a]/10 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />

        {isOpen ? (
          <span className="text-base text-gray-300 group-hover:text-white transition">✕</span>
        ) : (
          <svg
            className="h-6 w-6 stroke-current fill-none transition-transform group-hover:scale-110"
            viewBox="0 0 24 24"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default AIChatWidget;