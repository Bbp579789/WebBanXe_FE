import React, { useCallback, useEffect, useState } from 'react';
import { aiChatService, getAiErrorMessage } from '../../services/api/aiService';
import { authService } from '../../services/api/user/authService';

// Khách gõ /lienket trên Telegram, bot gửi link dạng /?link_code=<mã>.
// Mở link: chưa đăng nhập thì mời đăng nhập; đăng nhập xong thì gửi mã cho ai-service.
const LINK_CODE_KEY = 'ai_telegram_link_code';

export const TelegramLinkHandler: React.FC = () => {
  const [notice, setNotice] = useState('');
  const [isError, setIsError] = useState(false);

  const claim = useCallback(async () => {
    const code = sessionStorage.getItem(LINK_CODE_KEY);
    if (!code) return;

    let isAuthenticated = true;
    try {
      await authService.getCurrentUser();
    } catch {
      isAuthenticated = false;
    }

    if (!isAuthenticated) {
      setIsError(false);
      setNotice('Vui lòng đăng nhập để liên kết Telegram với tài khoản của bạn.');
      window.dispatchEvent(new Event('openLoginDialog'));
      return;
    }

    sessionStorage.removeItem(LINK_CODE_KEY);
    try {
      await aiChatService.claimTelegramLink(code);
      setIsError(false);
      setNotice('Đã liên kết Telegram với tài khoản. Bạn có thể hỏi về đơn hàng ngay trên Telegram.');
    } catch (error) {
      setIsError(true);
      setNotice(getAiErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    // Lấy mã trên URL rồi xóa khỏi thanh địa chỉ
    const params = new URLSearchParams(window.location.search);
    const code = params.get('link_code');
    if (code) {
      sessionStorage.setItem(LINK_CODE_KEY, code);
      params.delete('link_code');
      const query = params.toString();
      window.history.replaceState(null, '', window.location.pathname + (query ? '?' + query : ''));
    }
    const initialClaim = window.setTimeout(() => {
      void claim();
    }, 0);

    window.addEventListener('authChange', claim);
    return () => {
      window.clearTimeout(initialClaim);
      window.removeEventListener('authChange', claim);
    };
  }, [claim]);

  if (!notice) return null;

  return (
    <div className="fixed top-24 left-1/2 z-[60] w-[92%] max-w-md -translate-x-1/2">
      <div
        className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-xl ${
          isError ? 'border-rose-300 bg-rose-50 text-rose-800' : 'border-[#b8955a]/50 bg-[#111215] text-gray-100'
        }`}
      >
        <span className="flex-1">{notice}</span>
        <button type="button" onClick={() => setNotice('')} className="text-xs opacity-70 hover:opacity-100">
          ✕
        </button>
      </div>
    </div>
  );
};

export default TelegramLinkHandler;
