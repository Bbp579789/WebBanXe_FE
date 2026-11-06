import React from 'react';
import { Link } from 'react-router-dom';
import { type ChatMessage } from '../../types';
import type { AiProductCard, AiSource } from '../../types/ai.types';

interface ChatMessageItemProps {
  message: ChatMessage;
}

function formatPrice(price: number | null) {
  if (price === null || price === undefined) {
    return 'Liên hệ';
  }
  return price.toLocaleString('vi-VN') + ' đ';
}

// Gộp nguồn thành các dòng ngắn: tên tài liệu, dữ liệu xe, dữ liệu showroom
function sourceLabels(sources: AiSource[]) {
  const labels: string[] = [];
  const vehicleNames: string[] = [];

  for (const source of sources) {
    if (source.type === 'document' && source.title) {
      let label = source.title;
      if (source.page) {
        label = label + ' (trang ' + source.page + ')';
      }
      if (!labels.includes(label)) {
        labels.push(label);
      }
    }
    if (source.type === 'vehicle' && source.title) {
      const name = source.title.trim();
      if (name && !vehicleNames.includes(name)) {
        vehicleNames.push(name);
      }
    }
    if (source.type === 'database') {
      const label = 'Dữ liệu xe của showroom';
      if (!labels.includes(label)) {
        labels.push(label);
      }
    }
  }

  if (vehicleNames.length > 0) {
    labels.push('Dữ liệu xe: ' + vehicleNames.join(', '));
  }
  return labels;
}

const ProductCardItem: React.FC<{ card: AiProductCard }> = ({ card }) => {
  return (
    <Link
      to={'/vehicle-detail/' + card.vehicle_id}
      className="flex gap-2.5 rounded-xl border border-[#2b2c34] bg-[#0f1013] p-2 hover:border-[#b8955a]/60 transition"
    >
      {card.image_url ? (
        <img src={card.image_url} alt={card.name} className="h-14 w-20 shrink-0 rounded-lg object-cover bg-black/40" />
      ) : (
        <div className="h-14 w-20 shrink-0 rounded-lg bg-black/40" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-gray-100">{card.name}</p>
        <p className="text-[11px] font-bold text-[#b8955a]">{formatPrice(card.price)}</p>
        <p className="truncate text-[10px] text-gray-400">
          {card.year ? card.year + ' · ' : ''}
          {card.exterior_color || ''}
        </p>
        {card.status_label && <p className="truncate text-[10px] text-emerald-400">{card.status_label}</p>}
      </div>
    </Link>
  );
};

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  // Tin hệ thống (báo lỗi, thông báo): căn giữa, chữ nhỏ
  if (message.sender === 'system') {
    return (
      <div className="flex justify-center mb-1">
        <p className="max-w-[90%] rounded-lg bg-white/5 px-3 py-1.5 text-center text-[10px] text-gray-400 whitespace-pre-line">
          {message.content}
        </p>
      </div>
    );
  }

  const isUser = message.sender === 'user';
  const isAdmin = message.sender === 'admin';
  const products = message.products || [];
  const sources = sourceLabels(message.sources || []);

  let bubbleClass =
    'rounded-2xl rounded-bl-sm bg-[#18191f] text-gray-200 border border-[#2b2c34] font-light shadow-black/40';
  if (isUser) {
    bubbleClass =
      'rounded-2xl rounded-br-sm bg-gradient-to-r from-[#b8955a] to-[#c9a76d] text-black font-medium selection:bg-black selection:text-white';
  }
  if (isAdmin) {
    bubbleClass = 'rounded-2xl rounded-bl-sm bg-[#1d2a24] text-emerald-50 border border-emerald-700/50 font-light';
  }

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-1`}>
      {!isUser && (
        <span className="mb-1 px-1 text-[9px] uppercase tracking-wider text-gray-500 font-mono">
          {isAdmin ? 'Nhân viên tư vấn' : 'Trợ lý AI'}
        </span>
      )}

      <div className={`max-w-[85%] px-3.5 py-2.5 text-xs leading-relaxed transition-all shadow-md ${bubbleClass}`}>
        <p className="whitespace-pre-line">{message.content}</p>

        {products.length > 0 && (
          <div className="mt-2.5 flex flex-col gap-1.5">
            {products.map((card) => (
              <ProductCardItem key={card.vehicle_id} card={card} />
            ))}
          </div>
        )}

        {sources.length > 0 && (
          <div className="mt-2.5 border-t border-white/10 pt-2">
            <p className="text-[9px] uppercase tracking-wider text-[#b8955a] font-mono">Nguồn</p>
            {sources.map((label) => (
              <p key={label} className="text-[10px] text-gray-400">
                • {label}
              </p>
            ))}
          </div>
        )}
      </div>

      <span className="mt-1 px-1 text-[9px] tracking-wider text-gray-500 font-mono">{message.timestamp}</span>
    </div>
  );
};

export default ChatMessageItem;
