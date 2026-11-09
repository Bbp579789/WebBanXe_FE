import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Search,
  Send,
  Clock,
  ShieldCheck,
  Car,
  Sparkles,
  Bot,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Inbox,
} from 'lucide-react';
import { aiInboxService, getAiErrorMessage } from '../../services/api/aiService';
import type { AiConversation, AiConversationDetail, AiMessage } from '../../types/ai.types';

// Hộp thư tập trung: hội thoại từ website và Telegram hiện chung một danh sách, lọc được theo kênh và mức khẩn
type ChannelType = 'all' | 'web' | 'telegram';
type StatusFilter = 'open' | 'ai_handling' | 'closed';
type PriorityFilter = 'all' | 'urgent' | 'high' | 'medium' | 'low';

const LIST_POLL_MS = 5000;
const DETAIL_POLL_MS = 3000;

const channels: { id: ChannelType; name: string }[] = [
  { id: 'all', name: 'Tất cả kênh' },
  { id: 'web', name: 'Website Mercedes Live' },
  { id: 'telegram', name: 'Telegram Channel' },
];

const statusFilters: { id: StatusFilter; name: string }[] = [
  { id: 'open', name: 'Cần xử lý' },
  { id: 'ai_handling', name: 'Bot đang trả lời' },
  { id: 'closed', name: 'Đã đóng' },
];

const statusLabels: Record<string, string> = {
  ai_handling: 'Bot đang trả lời',
  escalated: 'Chờ nhân viên',
  admin_handling: 'Nhân viên đang xử lý',
  closed: 'Đã đóng',
};

const statusColors: Record<string, string> = {
  ai_handling: 'bg-sky-100 text-sky-800 border-sky-300',
  escalated: 'bg-rose-100 text-rose-800 border-rose-300',
  admin_handling: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  closed: 'bg-zinc-200 text-zinc-700 border-zinc-300',
};

const priorityLabels: Record<string, string> = {
  urgent: 'Khẩn cấp',
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

const priorityColors: Record<string, string> = {
  urgent: 'bg-rose-600 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-amber-200 text-amber-900',
  low: 'bg-zinc-200 text-zinc-700',
};

const priorityFilters: { id: PriorityFilter; name: string }[] = [
  { id: 'all', name: 'Tất cả' },
  { id: 'urgent', name: 'Khẩn cấp' },
  { id: 'high', name: 'Cao' },
  { id: 'medium', name: 'Trung bình' },
  { id: 'low', name: 'Thấp' },
];

// Hội thoại đã chuyển cho nhân viên mới có mức ưu tiên và hạn SLA
function needsStaff(status: string) {
  return status === 'escalated' || status === 'admin_handling';
}

// Thời gian còn lại tới hạn phản hồi, ví dụ "Còn 4 phút" hoặc "Trễ 12 phút"
function slaText(dueAt: string | null, now: number) {
  if (!dueAt) return '';
  const minutes = Math.round((new Date(dueAt).getTime() - now) / 60000);
  if (minutes >= 60) return 'Còn ' + Math.floor(minutes / 60) + ' giờ ' + (minutes % 60) + ' phút';
  if (minutes >= 0) return 'Còn ' + minutes + ' phút';
  const late = -minutes;
  if (late >= 60) return 'Trễ ' + Math.floor(late / 60) + ' giờ ' + (late % 60) + ' phút';
  return 'Trễ ' + late + ' phút';
}

const quickReplies = [
  'Dạ Mercedes-Benz kính chào Quý khách! Em là nhân viên tư vấn, em hỗ trợ gì cho mình ạ?',
  'Dạ xe đang sẵn màu trưng bày tại showroom, mời anh/chị ghé lái thử ạ.',
  'Em xin gửi Quý khách bảng tính giá lăn bánh chi tiết và ưu đãi tốt nhất.',
  'Showroom hỗ trợ thủ tục trả góp 85% giá trị xe với lãi suất ưu đãi ạ.',
];

function formatTime(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

function getInitials(name: string) {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-5 stroke-current">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20M12 12L3.5 7M12 12l8.5-5M12 12L4 18M12 12l8 6" />
    </svg>
  );
}

// Một tin trong khung chat: khách bên trái, bot bên trái (màu khác), nhân viên bên phải
const MessageBubble: React.FC<{ message: AiMessage; customerName: string }> = ({ message, customerName }) => {
  if (message.sender_type === 'system') {
    return (
      <div className="flex justify-center">
        <span className="text-[11px] text-zinc-500 bg-zinc-200/70 px-3 py-1 rounded-full">{message.content}</span>
      </div>
    );
  }

  const isAdmin = message.sender_type === 'admin';
  const isBot = message.sender_type === 'ai';

  let bubbleClass = 'bg-white text-zinc-800 border border-zinc-200/90 rounded-bl-none shadow-sm';
  if (isBot) {
    bubbleClass = 'bg-[#eef3f8] text-zinc-800 border border-sky-200 rounded-bl-none shadow-sm';
  }
  if (isAdmin) {
    bubbleClass =
      'bg-gradient-to-br from-[#c9ad80] to-[#b3925c] text-white rounded-br-none shadow-[0_4px_16px_rgba(184,149,90,0.25)] border border-[#dfc399]/40';
  }

  const products = message.extra?.products || [];
  const sources = message.extra?.sources || [];
  const sourceNames: string[] = [];
  for (const source of sources) {
    let name = source.title || '';
    if (source.type === 'database') name = 'Dữ liệu xe của showroom';
    if (name && !sourceNames.includes(name)) sourceNames.push(name);
  }

  return (
    <div className={`flex items-end gap-3 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
      {!isAdmin && (
        <div
          className={`size-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mb-1 shadow-sm border ${
            isBot ? 'bg-sky-100 text-sky-700 border-sky-200' : 'bg-[#bfa780] text-zinc-900 border-[#ab9269]'
          }`}
        >
          {isBot ? <Bot className="size-4" /> : getInitials(customerName)}
        </div>
      )}

      <div className="flex flex-col max-w-[72%] sm:max-w-[62%]">
        {isBot && <span className="text-[10px] font-semibold text-sky-700 mb-0.5 ml-1">Trợ lý AI</span>}
        <div className={`rounded-2xl px-4 py-3 text-sm ${bubbleClass}`}>
          <p className="whitespace-pre-wrap leading-relaxed select-text">{message.content}</p>

          {products.length > 0 && (
            <p className="mt-2 text-[11px] text-zinc-500">
              Đã gợi ý xe: {products.map((card) => card.name).join(', ')}
            </p>
          )}
          {sourceNames.length > 0 && (
            <p className="mt-1 text-[11px] text-zinc-500">Nguồn: {sourceNames.join('; ')}</p>
          )}

          <div
            className={`flex items-center justify-end gap-1.5 text-[10px] mt-1.5 ${
              isAdmin ? 'text-zinc-100/90' : 'text-zinc-400'
            }`}
          >
            <Clock className="size-2.5" />
            <span>{formatTime(message.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminChatPage: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('open');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [now, setNow] = useState(() => Date.now());
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AiConversationDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [listError, setListError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [waitingCount, setWaitingCount] = useState<Record<ChannelType, number>>({ all: 0, web: 0, telegram: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tải danh sách hội thoại theo kênh và bộ lọc trạng thái
  const loadConversations = useCallback(async () => {
    try {
      // "Tất cả kênh" thì không gửi channel, ai-service trả cả website và Telegram
      let channel: string | undefined = selectedChannel;
      if (selectedChannel === 'all') {
        channel = undefined;
      }

      let rows: AiConversation[];
      if (statusFilter === 'open') {
        // Mặc định ai-service trả các hội thoại chưa đóng; giữ lại hội thoại cần nhân viên
        const all = await aiInboxService.getConversations({ channel: channel });
        rows = all.filter((item) => needsStaff(item.status));
      } else {
        rows = await aiInboxService.getConversations({ channel: channel, status: statusFilter });
      }
      setConversations(rows);
      setListError('');
      setNow(Date.now());

      // Số hội thoại đang chờ nhân viên ở mỗi kênh, hiện ở thanh kênh bên trái
      const waiting = await aiInboxService.getConversations({ status: 'escalated' });
      const counts: Record<ChannelType, number> = { all: waiting.length, web: 0, telegram: 0 };
      for (const item of waiting) {
        counts[item.channel_type] = counts[item.channel_type] + 1;
      }
      setWaitingCount(counts);
    } catch (error) {
      setListError(getAiErrorMessage(error));
    }
  }, [selectedChannel, statusFilter]);

  // Chưa chọn hội thoại nào thì xem hội thoại đầu danh sách
  let activeId: number | null = selectedId;
  if (activeId === null && conversations.length > 0) {
    activeId = conversations[0].id;
  }

  const loadDetail = useCallback(async () => {
    if (activeId === null) return;
    try {
      const data = await aiInboxService.getConversation(activeId);
      setDetail(data);
    } catch (error) {
      setActionError(getAiErrorMessage(error));
    }
  }, [activeId]);

  useEffect(() => {
    loadConversations();
    const timer = setInterval(loadConversations, LIST_POLL_MS);
    return () => clearInterval(timer);
  }, [loadConversations]);

  useEffect(() => {
    loadDetail();
    const timer = setInterval(loadDetail, DETAIL_POLL_MS);
    return () => clearInterval(timer);
  }, [loadDetail]);

  const messageCount = detail?.messages.length || 0;
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageCount, activeId]);

  const handleSelectChannel = (channel: ChannelType) => {
    setSelectedChannel(channel);
    setSelectedId(null);
    setDetail(null);
  };

  const handleSelectFilter = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setPriorityFilter('all');
    setSelectedId(null);
    setDetail(null);
  };

  const handleSelectPriority = (filter: PriorityFilter) => {
    setPriorityFilter(filter);
    setSelectedId(null);
    setDetail(null);
  };

  // Gọi một thao tác (nhận, trả bot, đóng) rồi tải lại dữ liệu
  const runAction = async (action: (id: number) => Promise<void>) => {
    if (activeId === null) return;
    setActionError('');
    try {
      await action(activeId);
      await loadDetail();
      await loadConversations();
    } catch (error) {
      setActionError(getAiErrorMessage(error));
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || activeId === null || isSending) return;
    setIsSending(true);
    setActionError('');
    try {
      await aiInboxService.reply(activeId, content);
      if (!textToSend) setInputText('');
      await loadDetail();
      await loadConversations();
    } catch (error) {
      setActionError(getAiErrorMessage(error));
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter((item) => {
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) {
      return false;
    }
    const query = searchQuery.toLowerCase();
    return (
      item.customer.name.toLowerCase().includes(query) ||
      (item.customer.phone || '').includes(query) ||
      (item.customer.telegram_username || '').toLowerCase().includes(query)
    );
  });

  // Chỉ hiện chi tiết khi khớp hội thoại đang chọn (tránh hiện hội thoại cũ lúc đổi kênh)
  let conversation = null;
  if (detail && detail.conversation.id === activeId) {
    conversation = detail.conversation;
  }
  const isClosed = conversation?.status === 'closed';

  return (
    <div className="flex flex-1 w-full h-screen overflow-hidden bg-[#18181b] text-zinc-100 select-none min-w-0">
      {/* Cột kênh */}
      <aside className="w-[72px] bg-[#0c0d0e] border-r border-zinc-800/80 flex flex-col items-center pt-8 pb-5 justify-between shrink-0 z-20 shadow-2xl">
        <div className="flex flex-col items-center space-y-4 w-full">
          {channels.map((channel) => {
            const isActive = channel.id === selectedChannel;
            const count = waitingCount[channel.id];
            const activeClass =
              channel.id === 'telegram'
                ? 'bg-gradient-to-tr from-[#0088cc] to-[#29b6f6] text-white shadow-[0_4px_20px_rgba(41,182,246,0.45)] ring-2 ring-white/70 scale-105'
                : 'bg-gradient-to-br from-[#d4af37] via-[#b8955a] to-[#8a6e3d] text-zinc-950 shadow-[0_4px_20px_rgba(184,149,90,0.5)] ring-2 ring-[#f4d089]/80 scale-105';
            return (
              <div key={channel.id} className="relative group w-full flex justify-center">
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#b8955a] rounded-r-full shadow-[0_0_12px_#b8955a]" />
                )}
                <button
                  onClick={() => handleSelectChannel(channel.id)}
                  className="relative focus:outline-none transition-transform duration-200 active:scale-95"
                >
                  <div
                    className={`relative size-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? activeClass
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {channel.id === 'all' && <Inbox className="size-5" />}
                    {channel.id === 'web' && <WebsiteIcon />}
                    {channel.id === 'telegram' && <TelegramIcon />}
                  </div>
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 min-w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-[#0c0d0e] shadow-md animate-pulse">
                      {count}
                    </span>
                  )}
                </button>
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center bg-zinc-900/95 text-zinc-100 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-zinc-700/60 shadow-2xl whitespace-nowrap z-50 pointer-events-none">
                  {channel.name}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
          <ShieldCheck className="size-5 text-[#b8955a]" />
          <span className="text-[8px] font-mono tracking-widest text-[#b8955a]">SECURE</span>
        </div>
      </aside>

      {/* Cột danh sách hội thoại */}
      <aside className="w-72 md:w-80 lg:w-92 bg-[#8c8983] border-r border-[#7a7772] flex flex-col h-full shrink-0 shadow-inner z-10">
        <div className="p-4 bg-[#7a7771]/60 border-b border-[#6e6b66]/50">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 size-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Tra cứu khách hàng, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/95 text-zinc-900 placeholder-zinc-400 text-sm rounded-xl pl-10 pr-4 py-2.5 shadow-sm border border-transparent focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/40 outline-none"
            />
          </div>

          <div className="flex gap-1.5 mt-3">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleSelectFilter(filter.id)}
                className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition ${
                  statusFilter === filter.id ? 'bg-[#c5a97d] text-white shadow' : 'bg-black/15 text-zinc-100 hover:bg-black/25'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>

          {statusFilter === 'open' && (
            <div className="flex flex-wrap gap-1 mt-2">
              {priorityFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleSelectPriority(filter.id)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition ${
                    priorityFilter === filter.id ? 'bg-white text-zinc-900 shadow' : 'bg-black/15 text-zinc-100 hover:bg-black/25'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-2.5 px-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-200">
              {channels.find((c) => c.id === selectedChannel)?.name}
            </span>
            <span className="text-[11px] font-medium text-zinc-300">{filteredConversations.length} hội thoại</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {listError && (
            <div className="rounded-xl bg-rose-100 text-rose-800 text-xs p-3 flex gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{listError}</span>
            </div>
          )}

          {!listError && filteredConversations.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-200 flex flex-col items-center">
              <Search className="size-8 text-zinc-300 mb-2 opacity-60" />
              <span>Chưa có hội thoại nào</span>
            </div>
          ) : (
            filteredConversations.map((item) => {
              const isSelected = item.id === activeId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full group relative flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#c5a97d] shadow-[0_4px_16px_rgba(184,149,90,0.35)] border border-[#e2cca4]/60 text-white translate-x-1'
                      : 'hover:bg-black/15 text-zinc-100'
                  }`}
                >
                  <div className="relative shrink-0">
                  <div
                    className={`size-12 rounded-full flex items-center justify-center font-bold text-sm tracking-wider shadow-md ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#dfc399] to-[#a38048] text-zinc-950 ring-2 ring-white/70'
                        : 'bg-[#bfa780] text-zinc-900 border border-[#a89069]'
                    }`}
                  >
                    {getInitials(item.customer.name)}
                  </div>
                  <span
                    title={item.channel_type === 'telegram' ? 'Telegram' : 'Website'}
                    className={`absolute -bottom-0.5 -right-0.5 size-5 rounded-full flex items-center justify-center border-2 border-[#8c8983] [&_svg]:size-3 ${
                      item.channel_type === 'telegram' ? 'bg-[#0088cc] text-white' : 'bg-[#b8955a] text-zinc-950'
                    }`}
                  >
                    {item.channel_type === 'telegram' ? <TelegramIcon /> : <WebsiteIcon />}
                  </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-[15px] font-bold truncate">{item.customer.name}</h3>
                      <span className="text-[11px] font-medium shrink-0 ml-1 text-zinc-200">
                        {formatTime(item.last_message_at)}
                      </span>
                    </div>
                    <p className="text-xs truncate text-zinc-100/90">
                      {item.summary || item.escalation_reason || statusLabels[item.status]}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${statusColors[item.status]}`}>
                        {statusLabels[item.status]}
                      </span>
                      {needsStaff(item.status) && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${priorityColors[item.priority]}`}>
                          {priorityLabels[item.priority]}
                        </span>
                      )}
                      {item.status === 'escalated' && item.sla_due_at && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            item.sla_overdue ? 'bg-rose-600 text-white' : 'bg-white/80 text-zinc-800'
                          }`}
                        >
                          {slaText(item.sla_due_at, now)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Cột phải: chi tiết hội thoại */}
      <main className="flex-1 min-w-0 flex flex-col h-full bg-[#f8f7f5] text-zinc-900 relative overflow-hidden">
        {!conversation ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400">
            <div className="size-16 rounded-3xl bg-[#ded6cd] flex items-center justify-center mb-3 shadow-inner">
              <Car className="size-8 text-[#8a6e3d]" />
            </div>
            <p className="text-base font-bold text-zinc-700">Chọn một hội thoại để xem</p>
            <p className="text-xs text-zinc-500 mt-1">Hội thoại khách yêu cầu gặp nhân viên sẽ hiện ở mục "Cần xử lý"</p>
          </div>
        ) : (
          <>
            <header className="px-6 py-3 bg-[#ded6cd] border-b border-[#cfc4b8] flex items-center justify-between gap-4 shadow-sm shrink-0 z-10">
              <div className="flex items-center gap-4 min-w-0">
                <div className="size-12 rounded-full bg-gradient-to-br from-[#dfc399] to-[#ab8b54] text-zinc-950 flex items-center justify-center font-bold text-base shrink-0 shadow-md border border-[#9d7d45]">
                  {getInitials(conversation.customer.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-zinc-900 tracking-tight truncate">{conversation.customer.name}</h2>
                    {conversation.customer.phone && (
                      <span className="text-xs font-mono text-zinc-500 bg-white/70 px-2 py-0.5 rounded-md border border-zinc-300">
                        {conversation.customer.phone}
                      </span>
                    )}
                    {conversation.customer.telegram_username && (
                      <span className="text-xs font-mono text-sky-700 bg-white/70 px-2 py-0.5 rounded-md border border-sky-200">
                        @{conversation.customer.telegram_username}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${statusColors[conversation.status]}`}>
                      {statusLabels[conversation.status]}
                    </span>
                    <span className="text-xs text-[#8a6e3d] font-semibold">
                      Kênh: {conversation.channel_type === 'telegram' ? 'Telegram' : 'Website'}
                    </span>
                    {needsStaff(conversation.status) && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${priorityColors[conversation.priority]}`}>
                        Mức khẩn: {priorityLabels[conversation.priority]}
                      </span>
                    )}
                    {conversation.sla_due_at && conversation.status === 'escalated' && (
                      <span className={`text-xs ${conversation.sla_overdue ? 'text-rose-700 font-bold' : 'text-zinc-600'}`}>
                        Hạn phản hồi: {new Date(conversation.sla_due_at).toLocaleString('vi-VN')} ({slaText(conversation.sla_due_at, now)})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {conversation.status === 'escalated' && (
                  <button
                    onClick={() => runAction(aiInboxService.assign)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm"
                  >
                    <UserCheck className="size-4" /> Nhận xử lý
                  </button>
                )}
                {(conversation.status === 'escalated' || conversation.status === 'admin_handling') && (
                  <button
                    onClick={() => runAction(aiInboxService.returnToBot)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white text-zinc-700 border border-zinc-300 text-xs font-semibold shadow-sm"
                  >
                    <Bot className="size-4" /> Trả lại cho bot
                  </button>
                )}
                {!isClosed && (
                  <button
                    onClick={() => runAction(aiInboxService.close)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white text-zinc-700 border border-zinc-300 text-xs font-semibold shadow-sm"
                  >
                    <CheckCircle2 className="size-4" /> Đóng
                  </button>
                )}
                <button
                  onClick={() => loadDetail()}
                  title="Tải lại"
                  className="p-2 rounded-xl bg-white/80 hover:bg-white text-zinc-700 border border-zinc-300 shadow-sm"
                >
                  <RefreshCw className="size-4" />
                </button>
              </div>
            </header>

            {(conversation.summary || conversation.escalation_reason) && (
              <div className="mx-6 mt-4 rounded-2xl border border-[#d8c7a6] bg-[#fbf6ec] px-4 py-3 text-sm text-zinc-700 shrink-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a6e3d] flex items-center gap-1.5">
                  <Sparkles className="size-3.5" /> Tóm tắt của AI
                </p>
                {conversation.escalation_reason && (
                  <p className="mt-1">
                    <span className="font-semibold">Lý do chuyển nhân viên:</span> {conversation.escalation_reason}
                  </p>
                )}
                {conversation.summary && <p className="mt-1 whitespace-pre-wrap">{conversation.summary}</p>}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {detail && detail.messages.length === 0 ? (
                <p className="text-center text-sm text-zinc-500">Chưa có tin nhắn trong hội thoại</p>
              ) : (
                detail?.messages.map((message) => (
                  <MessageBubble key={message.id} message={message} customerName={conversation.customer.name} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {actionError && (
              <div className="mx-6 mb-2 rounded-xl bg-rose-100 text-rose-800 text-xs p-2.5 flex gap-2 shrink-0">
                <AlertTriangle className="size-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {!isClosed && (
              <div className="px-6 pb-2 pt-1 flex items-center gap-2 overflow-x-auto shrink-0">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
                  <Sparkles className="size-3 text-[#b8955a]" /> Gợi ý nhanh:
                </span>
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSendMessage(reply)}
                    className="text-xs bg-[#e8e4de] hover:bg-[#c5a97d] hover:text-white text-zinc-700 px-3 py-1.5 rounded-full shrink-0 border border-zinc-300 transition-colors truncate max-w-[280px]"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            <footer className="p-4 bg-[#e2ded9] border-t border-[#cfc4b8] shrink-0">
              {isClosed ? (
                <p className="text-center text-sm text-zinc-500">Hội thoại đã đóng</p>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2.5 bg-white rounded-2xl px-3 py-2 shadow-sm border border-zinc-300 focus-within:border-[#b8955a] focus-within:ring-2 focus-within:ring-[#b8955a]/30 transition-all"
                >
                  <input
                    type="text"
                    placeholder={
                      conversation.status === 'ai_handling'
                        ? 'Gửi tin sẽ chuyển hội thoại sang nhân viên xử lý...'
                        : 'Nhập tin trả lời khách...'
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    maxLength={4000}
                    className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none py-1.5 select-text"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="size-9 rounded-xl bg-gradient-to-br from-[#c9ad80] to-[#a38048] hover:from-[#dfc399] hover:to-[#b3925c] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all active:scale-95"
                    title="Gửi tin nhắn (Enter)"
                  >
                    <Send className="size-4" />
                  </button>
                </form>
              )}
            </footer>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminChatPage;
