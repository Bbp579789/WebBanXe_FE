import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Calendar, Zap, ShieldCheck } from 'lucide-react';
import botAvatar from '../../assets/icon/bot.svg';
import { useAIChat } from '../../hooks/useAIChat';
import ChatMessageItem from './ChatMessageItem';

export const AIChatWidget: React.FC = () => {
  const { messages, isLoading, sendMessage } = useAIChat();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickPrompt = (promptText: string) => {
    if (isLoading) return;
    sendMessage(promptText);
  };

  return (
    <aside aria-label="Maybach AI Concierge" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 flex h-[540px] w-80 sm:w-96 flex-col overflow-hidden rounded-3xl border border-[#b8955a]/40 bg-[#111215]/95 backdrop-blur-2xl shadow-2xl shadow-black/90 transition-all duration-300">

          {/* HEADER CONCIERGE */}
          <div className="flex items-center justify-between border-b border-[#26272e] bg-[#16171b]/90 px-4 py-3.5 select-none">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="relative size-9 rounded-full border border-[#b8955a]/80 p-1 bg-black/40 flex items-center justify-center overflow-hidden shrink-0">

                  <span className="text-[10px] font-mono font-bold text-[#b8955a] select-none">

                  </span>

                  <img
                    src={botAvatar}
                    alt="AI Concierge"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="absolute inset-0 size-full object-contain p-1 rounded-full"
                  />
                </div>
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#10b981] border-2 border-[#16171b]" />
              </div>

              <div>
                <h4 className="text-xs font-serif font-bold tracking-wider uppercase text-gray-100 flex items-center gap-1.5">
                  AI Concierge
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#b8955a]/20 text-[#b8955a] font-normal border border-[#b8955a]/30">
                    24/7
                  </span>
                </h4>
                <p className="text-[10px] text-gray-400 font-light tracking-wide">
                  Cố vấn đặc quyền Maybach Atelier
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="size-7 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Thu nhỏ"
              aria-label="Đóng cửa sổ chat"
            >
              ✕
            </button>
          </div>

          {/* NỘI DUNG CHAT */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 bg-gradient-to-b from-[#0d0e11]/90 to-[#0a0a0c]">

            {/* KHỐI GIỚI THIỆU CHÀO ĐÓN SANG TRỌNG CĂN GIỮA */}
            <div className="my-2 rounded-2xl border border-[#b8955a]/30 bg-gradient-to-b from-[#1b1c22] to-[#121317] p-5 text-center shadow-lg shadow-black/40">
              <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full border border-[#b8955a]/50 bg-[#b8955a]/10 text-[#b8955a]">
                <Sparkles className="size-5 animate-pulse" />
              </div>

              <span className="text-[9px] font-mono tracking-[0.25em] text-[#b8955a] uppercase font-bold">
                VALOIR CONCIERGE SERVICE
              </span>

              <h3 className="font-serif text-sm font-semibold text-white mt-1">
                Kính chào Quý khách
              </h3>

              <p className="mt-2 text-xs font-light leading-relaxed text-zinc-300">
                Tôi có thể hỗ trợ thông số kỹ thuật, lịch hẹn trải nghiệm hay quy trình đặt cọc mẫu xe nào hôm nay?
              </p>

              {/* Gợi ý tương tác nhanh */}
              <div className="mt-4 flex flex-col gap-1.5 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => handleQuickPrompt('Tư vấn thông số kỹ thuật xe Maybach S 680')}
                  className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-left text-[11px] text-zinc-300 hover:bg-[#b8955a]/15 hover:text-[#b8955a] transition border border-transparent hover:border-[#b8955a]/30 cursor-pointer"
                >
                  <Zap className="size-3 text-[#b8955a] shrink-0" />
                  <span className="truncate">Tư vấn thông số Maybach S 680 4MATIC</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPrompt('Quy trình đặt cọc và hợp đồng bảo lưu')}
                  className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-left text-[11px] text-zinc-300 hover:bg-[#b8955a]/15 hover:text-[#b8955a] transition border border-transparent hover:border-[#b8955a]/30 cursor-pointer"
                >
                  <ShieldCheck className="size-3 text-[#b8955a] shrink-0" />
                  <span className="truncate">Tìm hiểu chính sách đặt cọc bảo lưu xe</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPrompt('Tôi muốn đặt lịch hẹn lái thử')}
                  className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-left text-[11px] text-zinc-300 hover:bg-[#b8955a]/15 hover:text-[#b8955a] transition border border-transparent hover:border-[#b8955a]/30 cursor-pointer"
                >
                  <Calendar className="size-3 text-[#b8955a] shrink-0" />
                  <span className="truncate">Đăng ký lịch hẹn lái thử tại Salon</span>
                </button>
              </div>
            </div>

            {/* DANH SÁCH TIN NHẮN TƯƠNG TÁC THỰC TẾ GIỮA KHÁCH VÀ BOT */}
            {messages.map((msg) => (
              <ChatMessageItem key={msg.id} message={msg} />
            ))}

            {/* Trạng thái AI đang suy nghĩ */}
            {isLoading && (
              <div className="flex items-center gap-1.5 rounded-xl bg-[#1b1c22] border border-[#2b2c34] px-3.5 py-2 text-xs text-[#b8955a] w-fit shadow-md select-none">
                <span className="text-[10px] uppercase font-mono tracking-wider mr-1 text-gray-400">
                  AI Đang soạn
                </span>
                <span className="size-1.5 rounded-full bg-[#b8955a] animate-bounce" />
                <span className="size-1.5 rounded-full bg-[#b8955a] animate-bounce [animation-delay:0.2s]" />
                <span className="size-1.5 rounded-full bg-[#b8955a] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Ô NHẬP TIN NHẮN */}
          <form onSubmit={handleSubmit} className="border-t border-[#26272e] bg-[#141519] p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Đặt câu hỏi cho cố vấn AI..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                className="flex-1 rounded-xl border border-[#2d2e37] bg-[#1c1d24] px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#b8955a] focus:bg-[#20212a] focus:outline-none transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="flex items-center justify-center rounded-xl bg-[#b8955a] px-3.5 py-2 text-xs font-semibold text-black hover:bg-[#c9a76d] active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                Gửi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* NÚT TRÒN MỞ/ĐÓNG WIDGET */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Thu nhỏ khung chat' : 'Mở khung chat trợ lý AI'}
        className="group relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1a1b20] to-[#0c0d10] border border-[#b8955a]/70 text-[#b8955a] shadow-xl shadow-black/60 transition-all duration-300 hover:scale-105 hover:border-[#b8955a] active:scale-95 cursor-pointer select-none"
      >
        <div className="absolute inset-0 rounded-full bg-[#b8955a]/10 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />

        {isOpen ? (
          <span className="text-base text-gray-300 group-hover:text-white transition">✕</span>
        ) : (
          <svg
            className="size-6 stroke-current fill-none transition-transform group-hover:scale-110"
            viewBox="0 0 24 24"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </aside>
  );
};

export default AIChatWidget;