import React, { useState } from 'react';
import {
  Search,
  Send,
  CheckCheck,
  Clock,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  ShieldCheck,
  Car,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export type PlatformType = 'telegram' | 'zalo' | 'messenger' | 'website';

interface PlatformConfig {
  id: PlatformType;
  name: string;
  badgeCount?: number;
  renderIcon: (active: boolean) => React.ReactNode;
}

interface CustomerInterest {
  model: string;
  budget?: string;
  status: string;
}

interface ChatItem {
  id: string;
  name: string;
  platform: PlatformType;
  phone?: string;
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
  online?: boolean;
  carInterest?: CustomerInterest;
}

interface Message {
  id: string;
  sender: 'customer' | 'admin';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

const platforms: PlatformConfig[] = [
  {
    id: 'telegram',
    name: 'Telegram Channel',
    badgeCount: 3,
    renderIcon: (active: boolean) => (
      <div
        className={`relative size-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          active
            ? 'bg-gradient-to-tr from-[#0088cc] to-[#29b6f6] text-white shadow-[0_4px_20px_rgba(41,182,246,0.45)] ring-2 ring-white/70 scale-105'
            : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80 opacity-60 hover:opacity-100 hover:scale-100'
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-5 fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
        </svg>
      </div>
    ),
  },
  {
    id: 'zalo',
    name: 'Zalo OA',
    badgeCount: 1,
    renderIcon: (active: boolean) => (
      <div
        className={`relative size-11 rounded-2xl flex items-center justify-center font-bold text-xs tracking-wider transition-all duration-300 ${
          active
            ? 'bg-gradient-to-tr from-[#0068FF] to-[#1E88E5] text-white shadow-[0_4px_20px_rgba(0,104,255,0.45)] ring-2 ring-white/70 scale-105'
            : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80 opacity-60 hover:opacity-100 hover:scale-100'
        }`}
      >
        <span>Zalo</span>
      </div>
    ),
  },
  {
    id: 'messenger',
    name: 'Facebook Messenger',
    badgeCount: 0,
    renderIcon: (active: boolean) => (
      <div
        className={`relative size-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          active
            ? 'bg-gradient-to-tr from-[#00B2FF] via-[#006AFF] to-[#9B00E8] text-white shadow-[0_4px_20px_rgba(0,106,255,0.45)] ring-2 ring-white/70 scale-105'
            : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80 opacity-60 hover:opacity-100 hover:scale-100'
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-5 fill-current">
          <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.513 3.735 7.195V22l3.376-1.854c.915.253 1.884.39 2.889.39 5.523 0 10-4.145 10-9.278C22 6.145 17.523 2 12 2zm1.066 12.443l-2.616-2.79-5.105 2.79 5.614-5.96 2.678 2.79 5.044-2.79-5.615 5.96z" />
        </svg>
      </div>
    ),
  },
  {
    id: 'website',
    name: 'Website Mercedes Live',
    badgeCount: 2,
    renderIcon: (active: boolean) => (
      <div
        className={`relative size-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          active
            ? 'bg-gradient-to-br from-[#d4af37] via-[#b8955a] to-[#8a6e3d] text-zinc-950 shadow-[0_4px_20px_rgba(184,149,90,0.5)] ring-2 ring-[#f4d089]/80 scale-105'
            : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80 opacity-60 hover:opacity-100 hover:scale-100'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-5 stroke-current">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M12 12L3.5 7M12 12l8.5-5M12 12L4 18M12 12l8 6" />
        </svg>
      </div>
    ),
  },
];

const allConversations: ChatItem[] = [
  // Telegram
  {
    id: 'tg-1',
    name: 'Nguyễn Văn A',
    platform: 'telegram',
    phone: '0988 123 456',
    lastMessage: 'Chào anh, tôi cần tư vấn dòng xe Maybach S680',
    time: '10:30',
    unreadCount: 2,
    online: true,
    carInterest: { model: 'Mercedes-Maybach S 680 4MATIC', budget: '15.9 Tỷ VNĐ', status: 'Quan tâm cao' },
  },
  {
    id: 'tg-2',
    name: 'Trần Thị Mai',
    platform: 'telegram',
    phone: '0912 345 678',
    lastMessage: 'Xe GLC 300 còn màu trắng giao ngay không ạ?',
    time: '09:45',
    unreadCount: 0,
    online: true,
    carInterest: { model: 'Mercedes-Benz GLC 300 4MATIC', budget: '2.79 Tỷ VNĐ', status: 'Đang thẩm định cọc' },
  },
  {
    id: 'tg-3',
    name: 'Lê Hoàng Nam',
    platform: 'telegram',
    phone: '0903 888 999',
    lastMessage: 'Báo giá lăn bánh giúp tôi tại TP.HCM nhé',
    time: 'Hôm qua',
    unreadCount: 0,
    online: false,
    carInterest: { model: 'Mercedes-AMG G 63', budget: '11.7 Tỷ VNĐ', status: 'Hẹn lái thử' },
  },
  {
    id: 'tg-4',
    name: 'Phạm Minh Đức',
    platform: 'telegram',
    lastMessage: 'Đã nhận được hợp đồng đặt cọc',
    time: '24/10',
    unreadCount: 0,
    online: false,
  },
  {
    id: 'tg-5',
    name: 'Vũ Quốc Huy',
    platform: 'telegram',
    lastMessage: 'Thủ tục trả góp ngân hàng cần những gì?',
    time: '23/10',
    unreadCount: 0,
    online: false,
  },
  {
    id: 'tg-6',
    name: 'Đỗ Hải Đăng',
    platform: 'telegram',
    lastMessage: 'Cảm ơn showroom, tôi đã nhận xe',
    time: '21/10',
    unreadCount: 0,
    online: false,
  },
  {
    id: 'tg-7',
    name: 'Ngô Thu Thảo',
    platform: 'telegram',
    lastMessage: 'Cho mình xin lịch lái thử C300 AMG',
    time: '20/10',
    unreadCount: 0,
    online: false,
  },

  // Zalo
  {
    id: 'zl-1',
    name: 'Hoàng Kim Yến',
    platform: 'zalo',
    phone: '0934 555 777',
    lastMessage: 'Gửi cho mình catalogue dòng E-Class nhé',
    time: '11:15',
    unreadCount: 1,
    online: true,
    carInterest: { model: 'Mercedes-Benz E 300 AMG', budget: '3.2 Tỷ VNĐ', status: 'Cần gửi Brochure' },
  },
  {
    id: 'zl-2',
    name: 'Bùi Anh Tuấn',
    platform: 'zalo',
    lastMessage: 'Thứ 7 này showroom mở cửa mấy giờ?',
    time: 'Hôm qua',
    unreadCount: 0,
    online: false,
  },

  // Messenger
  {
    id: 'ms-1',
    name: 'Đặng Thanh Tùng',
    platform: 'messenger',
    phone: '0944 666 888',
    lastMessage: 'Chính sách bảo hành xe Mercedes ra sao?',
    time: '08:20',
    unreadCount: 0,
    online: true,
    carInterest: { model: 'Mercedes-Benz C 200 Avantgarde', budget: '1.59 Tỷ VNĐ', status: 'Hỏi bảo dưỡng' },
  },
  {
    id: 'ms-2',
    name: 'Phan Bảo Ngọc',
    platform: 'messenger',
    lastMessage: 'Tư vấn giúp em gói phụ kiện chính hãng',
    time: '19/10',
    unreadCount: 0,
    online: false,
  },

  // Website
  {
    id: 'ws-1',
    name: 'Khách VIP #1042',
    platform: 'website',
    phone: '0977 999 111',
    lastMessage: 'Giá xe Mercedes GLS 450 hiện tại bao nhiêu?',
    time: '10:05',
    unreadCount: 2,
    online: true,
    carInterest: { model: 'Mercedes-Benz GLS 450 4MATIC', budget: '5.3 Tỷ VNĐ', status: 'Khách trực tuyến' },
  },
  {
    id: 'ws-2',
    name: 'Nguyễn Đình Trọng',
    platform: 'website',
    lastMessage: 'Muốn đặt lịch hẹn bảo dưỡng định kỳ',
    time: '07:30',
    unreadCount: 0,
    online: false,
  },
];

const quickReplies = [
  'Dạ Mercedes-Benz kính chào Quý khách! Em hỗ trợ gì cho mình ạ?',
  'Dạ xe đang sẵn màu trưng bày tại showroom, mời anh/chị ghé lái thử ạ.',
  'Em xin gửi Quý khách bảng tính giá lăn bánh chi tiết và ưu đãi tốt nhất.',
  'Showroom hỗ trợ thủ tục trả góp 85% giá trị xe với lãi suất ưu đãi ạ.',
];

export const AdminChatPage: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('telegram');
  const [selectedId, setSelectedId] = useState<string>('tg-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'tg-1': [
      {
        id: 'm1',
        sender: 'customer',
        text: 'Chào showroom Mercedes-Benz, mình muốn tìm hiểu dòng xe Maybach S680 mới nhất.',
        time: '10:28',
      },
      {
        id: 'm2',
        sender: 'admin',
        text: 'Dạ Mercedes-Benz kính chào Quý khách! Hiện tại mẫu Maybach S680 đang có sẵn bản trưng bày tại showroom. Quý khách muốn nhận bảng giá lăn bánh và lịch lái thử không ạ?',
        time: '10:29',
        status: 'read',
      },
      {
        id: 'm3',
        sender: 'customer',
        text: 'Chào anh, tôi cần tư vấn dòng xe Maybach S680',
        time: '10:30',
      },
    ],
    'tg-2': [
      { id: 'm2-1', sender: 'customer', text: 'Xe GLC 300 còn màu trắng giao ngay không ạ?', time: '09:45' },
    ],
    'zl-1': [
      { id: 'z1', sender: 'customer', text: 'Gửi cho mình catalogue dòng E-Class nhé', time: '11:15' },
    ],
    'ms-1': [
      { id: 'ms1', sender: 'customer', text: 'Chính sách bảo hành xe Mercedes ra sao?', time: '08:20' },
    ],
    'ws-1': [
      { id: 'w1', sender: 'customer', text: 'Giá xe Mercedes GLS 450 hiện tại bao nhiêu?', time: '10:05' },
    ],
  });

  const platformConversations = allConversations.filter((c) => c.platform === selectedPlatform);

  const filteredConversations = platformConversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCustomer =
    platformConversations.find((c) => c.id === selectedId) ||
    platformConversations[0] || {
      id: '',
      name: 'Chưa chọn khách hàng',
      platform: selectedPlatform,
      online: false,
    };

  const currentMessages = messages[selectedCustomer.id] || [];

  const handleSelectPlatform = (pid: PlatformType) => {
    setSelectedPlatform(pid);
    const firstOfPlatform = allConversations.find((c) => c.platform === pid);
    if (firstOfPlatform) {
      setSelectedId(firstOfPlatform.id);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim() || !selectedCustomer.id) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'admin',
      text: content.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages((prev) => ({
      ...prev,
      [selectedCustomer.id]: [...(prev[selectedCustomer.id] || []), newMsg],
    }));

    if (!textToSend) setInputText('');
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-1 w-full h-full overflow-hidden bg-[#18181b] text-zinc-100 select-none min-w-0">
      {/* ================= 1. CỘT DỌC CÁC ỨNG DỤNG (Luxury Dock Bar) ================= */}
      <aside className="w-[72px] bg-[#0c0d0e] border-r border-zinc-800/80 flex flex-col items-center pt-8 pb-5 justify-between shrink-0 z-20 shadow-2xl">
        <div className="flex flex-col items-center space-y-4 w-full">
          {platforms.map((p) => {
            const isActive = p.id === selectedPlatform;
            return (
              <div key={p.id} className="relative group w-full flex justify-center">
                {/* Active Indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#b8955a] rounded-r-full shadow-[0_0_12px_#b8955a]" />
                )}

                <button
                  onClick={() => handleSelectPlatform(p.id)}
                  className="relative focus:outline-none transition-transform duration-200 active:scale-95"
                >
                  {p.renderIcon(isActive)}

                  {/* Badge số tin chưa đọc */}
                  {p.badgeCount && p.badgeCount > 0 ? (
                    <span className="absolute -top-1 -right-1 px-1.5 min-w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-[#0c0d0e] shadow-md animate-pulse">
                      {p.badgeCount}
                    </span>
                  ) : null}
                </button>

                {/* Tooltip Glassmorphism */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center bg-zinc-900/95 backdrop-blur-md text-zinc-100 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-zinc-700/60 shadow-2xl whitespace-nowrap z-50 pointer-events-none">
                  <span>{p.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mercedes Quality Badge */}
        <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
          <ShieldCheck className="size-5 text-[#b8955a]" />
          <span className="text-[8px] font-mono tracking-widest text-[#b8955a]">SECURE</span>
        </div>
      </aside>

      {/* ================= 2. CỘT DANH SÁCH KHÁCH HÀNG (Tra cứu khách hàng) ================= */}
      <aside className="w-72 md:w-80 lg:w-92 bg-[#8c8983] border-r border-[#7a7772] flex flex-col h-full shrink-0 shadow-inner">
        {/* Header Search Box */}
        <div className="p-4 bg-[#7a7771]/60 backdrop-blur-sm border-b border-[#6e6b66]/50">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 size-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Tra cứu khách hàng, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/95 text-zinc-900 placeholder-zinc-400 text-sm rounded-xl pl-10 pr-4 py-2.5 shadow-sm border border-transparent focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/40 outline-none transition-all duration-200"
            />
          </div>
          <div className="flex items-center justify-between mt-2.5 px-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-200">
              {platforms.find((p) => p.id === selectedPlatform)?.name}
            </span>
            <span className="text-[11px] font-medium text-zinc-300">
              {filteredConversations.length} hội thoại
            </span>
          </div>
        </div>

        {/* Danh sách các đoạn chat */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          {filteredConversations.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-200 flex flex-col items-center">
              <Search className="size-8 text-zinc-300 mb-2 opacity-60" />
              <span>Không tìm thấy khách hàng nào</span>
            </div>
          ) : (
            filteredConversations.map((item) => {
              const isSelected = item.id === selectedCustomer.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full group relative flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#c5a97d] shadow-[0_4px_16px_rgba(184,149,90,0.35)] border border-[#e2cca4]/60 text-white translate-x-1'
                      : 'hover:bg-black/15 text-zinc-100 hover:translate-x-0.5'
                  }`}
                >
                  {/* Avatar tròn với chỉ báo online */}
                  <div className="relative shrink-0">
                    <div
                      className={`size-12 rounded-full flex items-center justify-center font-bold text-sm tracking-wider shadow-md transition-transform duration-200 group-hover:scale-105 ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#dfc399] to-[#a38048] text-zinc-950 ring-2 ring-white/70'
                          : 'bg-[#bfa780] text-zinc-900 border border-[#a89069]'
                      }`}
                    >
                      {getInitials(item.name)}
                    </div>
                    {item.online && (
                      <span className="absolute bottom-0 right-0 size-3.5 bg-emerald-500 border-2 border-[#8c8983] rounded-full shadow-sm" />
                    )}
                  </div>

                  {/* Thông tin hội thoại */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3
                        className={`text-[15px] font-bold truncate ${
                          isSelected ? 'text-white' : 'text-zinc-100'
                        }`}
                      >
                        {item.name}
                      </h3>
                      {item.time && (
                        <span
                          className={`text-[11px] font-medium shrink-0 ml-1 ${
                            isSelected ? 'text-zinc-100' : 'text-zinc-300'
                          }`}
                        >
                          {item.time}
                        </span>
                      )}
                    </div>

                    {/* Tin nhắn gần nhất */}
                    {item.lastMessage && (
                      <p
                        className={`text-xs truncate ${
                          isSelected ? 'text-zinc-100 font-medium' : 'text-zinc-200'
                        }`}
                      >
                        {item.lastMessage}
                      </p>
                    )}
                  </div>

                  {/* Unread badge */}
                  {item.unreadCount ? (
                    <span className="size-5 rounded-full bg-rose-600 text-[10px] font-extrabold text-white flex items-center justify-center shrink-0 shadow-md animate-pulse">
                      {item.unreadCount}
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ================= 3. CỘT PHẢI: KHUNG CHAT CHI TIẾT ================= */}
      <main className="flex-1 min-w-0 flex flex-col h-full bg-[#f8f7f5] text-zinc-900 relative overflow-hidden">
        {/* Header người đang chat */}
        <header className="h-18 px-6 bg-[#ded6cd] border-b border-[#cfc4b8] flex items-center justify-between shadow-sm shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="size-12 rounded-full bg-gradient-to-br from-[#dfc399] to-[#ab8b54] text-zinc-950 flex items-center justify-center font-bold text-base shrink-0 shadow-md border border-[#9d7d45]">
                {getInitials(selectedCustomer.name)}
              </div>
              {selectedCustomer.online && (
                <span className="absolute bottom-0 right-0 size-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
                  {selectedCustomer.name}
                </h2>
                {selectedCustomer.phone && (
                  <span className="text-xs font-mono text-zinc-500 bg-white/70 px-2 py-0.5 rounded-md border border-zinc-300">
                    {selectedCustomer.phone}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`size-2 rounded-full ${
                    selectedCustomer.online ? 'bg-emerald-500' : 'bg-zinc-400'
                  }`}
                />
                <span className="text-xs text-zinc-600 font-medium">
                  {selectedCustomer.online ? 'Đang hoạt động' : 'Ngoại tuyến'}
                </span>
                <span className="text-zinc-400 text-xs">•</span>
                <span className="text-xs text-[#8a6e3d] font-semibold">
                  Kênh: {platforms.find((p) => p.id === selectedCustomer.platform)?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons trên header */}
          <div className="flex items-center gap-2">
            <button
              title="Gọi điện"
              className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-zinc-700 hover:text-[#b8955a] border border-zinc-300 shadow-sm transition-all hover:scale-105"
            >
              <Phone className="size-4" />
            </button>
            <button
              title="Gọi video tư vấn"
              className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-zinc-700 hover:text-[#b8955a] border border-zinc-300 shadow-sm transition-all hover:scale-105"
            >
              <Video className="size-4" />
            </button>
            <button
              title="Tùy chọn khác"
              className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-zinc-700 hover:text-[#b8955a] border border-zinc-300 shadow-sm transition-all hover:scale-105"
            >
              <MoreVertical className="size-4" />
            </button>
          </div>
        </header>

        {/* Nội dung tin nhắn chat */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400">
              <div className="size-16 rounded-3xl bg-[#ded6cd] flex items-center justify-center mb-3 text-zinc-600 shadow-inner">
                <Car className="size-8 text-[#8a6e3d]" />
              </div>
              <p className="text-base font-bold text-zinc-700">Chưa có tin nhắn trong hội thoại</p>
              <p className="text-xs text-zinc-500 mt-1">Bắt đầu tư vấn khách hàng bằng khung chat bên dưới</p>
            </div>
          ) : (
            currentMessages.map((msg) => {
              const isAdmin = msg.sender === 'admin';
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-3 ${isAdmin ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
                >
                  {!isAdmin && (
                    <div className="size-8 rounded-full bg-[#bfa780] text-zinc-900 text-xs font-bold flex items-center justify-center shrink-0 mb-1 shadow-sm border border-[#ab9269]">
                      {getInitials(selectedCustomer.name)}
                    </div>
                  )}

                  <div className="flex flex-col max-w-[72%] sm:max-w-[62%]">
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm text-sm ${
                        isAdmin
                          ? 'bg-gradient-to-br from-[#c9ad80] to-[#b3925c] text-white rounded-br-none shadow-[0_4px_16px_rgba(184,149,90,0.25)] border border-[#dfc399]/40'
                          : 'bg-white text-zinc-800 border border-zinc-200/90 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.text}</p>
                      <div
                        className={`flex items-center justify-end gap-1.5 text-[10px] mt-1.5 ${
                          isAdmin ? 'text-zinc-100/90' : 'text-zinc-400'
                        }`}
                      >
                        <Clock className="size-2.5" />
                        <span>{msg.time}</span>
                        {isAdmin && (
                          <CheckCheck className="size-3.5 text-white ml-0.5" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Khung Gợi ý câu trả lời nhanh (Quick Replies) */}
        <div className="px-6 pb-2 pt-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Sparkles className="size-3 text-[#b8955a]" /> Gợi ý nhanh:
          </span>
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(reply)}
              className="text-xs bg-[#e8e4de] hover:bg-[#c5a97d] hover:text-white text-zinc-700 px-3 py-1.5 rounded-full shrink-0 border border-zinc-300 transition-colors shadow-xs truncate max-w-[280px]"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Khung nhập văn bản chat ở đáy */}
        <footer className="p-4 bg-[#e2ded9] border-t border-[#cfc4b8] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2.5 bg-white rounded-2xl px-3 py-2 shadow-sm border border-zinc-300 focus-within:border-[#b8955a] focus-within:ring-2 focus-within:ring-[#b8955a]/30 transition-all"
          >
            {/* Nút đính kèm file/ảnh */}
            <button
              type="button"
              title="Đính kèm file hoặc ảnh xe"
              className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              <Paperclip className="size-4" />
            </button>

            {/* Input nhập liệu */}
            <input
              type="text"
              placeholder="Khung nhập văn bản chat..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none py-1.5 select-text"
            />

            {/* Emoji icon */}
            <button
              type="button"
              title="Biểu tượng cảm xúc"
              className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              <Smile className="size-4" />
            </button>

            {/* Nút gửi */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="size-9 rounded-xl bg-gradient-to-br from-[#c9ad80] to-[#a38048] hover:from-[#dfc399] hover:to-[#b3925c] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all active:scale-95"
              title="Gửi tin nhắn (Enter)"
            >
              <Send className="size-4" />
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
};

export default AdminChatPage;
