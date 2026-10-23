import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import AIChatWidget from '../components/ai-chat/AIChatWidget';
import { PaymentProgressSection } from '../sections/payment/PaymentProgressSection';
import { PaymentDeliveryProfileSection } from '../sections/payment/PaymentDeliveryProfileSection';
import { PaymentDepositSection } from '../sections/payment/PaymentDepositSection';
import { PaymentSummarySidebar } from '../sections/payment/PaymentSummarySidebar';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  // Quản lý bước hiện tại: 1 (Hồ sơ) hoặc 2 (Thanh toán)
  const [step, setStep] = useState<1 | 2>(1);

  const handleNextStep = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate('/cart'); // Nếu ở bước 1 mà bấm lùi thì về Giỏ Hàng
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmOrder = () => {
    // Xử lý API đặt hàng ở đây (nếu có), sau đó chuyển qua trang order
    navigate('/order');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-zinc-900 select-none">
      <Header forceSolid />

      <main className="flex-1 w-full pb-24 pt-20">
        <div className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl pt-4">
          
          <PaymentProgressSection step={step} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cột trái: Nội dung Step 1 hoặc Step 2 */}
            <div className="lg:col-span-8">
              {step === 1 ? <PaymentDeliveryProfileSection /> : <PaymentDepositSection />}
            </div>

            {/* Cột phải: Sidebar tổng tiền & Nút xác nhận */}
            <div className="lg:col-span-4">
              <PaymentSummarySidebar 
                step={step} 
                onNextStep={handleNextStep} 
                onPrevStep={handlePrevStep}
                onConfirm={handleConfirmOrder} 
                handleCompletePayment={handleConfirmOrder}
              />
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default PaymentPage;