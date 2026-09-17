import React from 'react';
import { type ChatMessage } from '../../types';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-1`}>
      <div
        className={`max-w-[82%] px-3.5 py-2.5 text-xs leading-relaxed transition-all shadow-md ${
          isUser
            ? 'rounded-2xl rounded-br-sm bg-gradient-to-r from-[#b8955a] to-[#c9a76d] text-black font-medium selection:bg-black selection:text-white'
            : 'rounded-2xl rounded-bl-sm bg-[#18191f] text-gray-200 border border-[#2b2c34] font-light shadow-black/40'
        }`}
      >
        {message.content}
      </div>
      <span className="mt-1 px-1 text-[9px] tracking-wider text-gray-500 font-mono">
        {message.timestamp}
      </span>
    </div>
  );
};

export default ChatMessageItem;