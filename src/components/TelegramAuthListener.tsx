import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { telegramAuthService } from '../services/api/user/telegramAuthService';

export const TelegramAuthListener = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleTelegramRedirect = async () => {
      try {
        const isTelegramCallback = await telegramAuthService.completeLoginFromRedirect();

        if (isTelegramCallback) {
          console.log('Đăng nhập Telegram thành công!');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Lỗi khi hoàn tất đăng nhập Telegram:', error);
      }
    };

    handleTelegramRedirect();
  }, [navigate]);

  return <>{children}</>;
};

export default TelegramAuthListener;