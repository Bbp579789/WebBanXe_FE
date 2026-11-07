import React from "react";

import { usePayment } from "../../hooks/usePayment";

import { PaymentDeliveryProfileSection } from "../../sections/payment/PaymentDeliveryProfileSection";
import { PaymentDepositSection } from "../../sections/payment/PaymentDepositSection";
import { PaymentProgressSection } from "../../sections/payment/PaymentProgressSection";
import { PaymentSummarySidebar } from "../../sections/payment/PaymentSummarySidebar";
import Header from "../../components/common/Header";

export const PaymentPage: React.FC = () => {
  const {
    step,
    profile,
    deliveryMethod,
    errors,
    shippingAddress,
    isProcessing,
    processingMessage,

    setDeliveryMethod,

    handleProfileChange,
    handleNextStep,
    handlePrevStep,
    handleProcessingChange,
  } = usePayment();

  return (
    <main className="min-h-screen bg-[#f8f8f7] px-4 py-8 sm:px-6 lg:px-8">
      <Header forceSolid />
      <div className="mx-auto max-w-7xl">

        {/* Tiến trình thanh toán */}
        <PaymentProgressSection step={step} />

        {/* Trạng thái xử lý */}
        {isProcessing && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {processingMessage || "Đang xử lý thanh toán..."}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Nội dung chính */}
          <div className="lg:col-span-8 space-y-6">
            {step === 1 ? (
              <PaymentDeliveryProfileSection
                profile={profile}
                onProfileChange={handleProfileChange}
                deliveryMethod={deliveryMethod}
                onDeliveryMethodChange={setDeliveryMethod}
                errors={errors}
              />
            ) : (
              <PaymentDepositSection
                shippingAddress={shippingAddress}
                customerName={profile.fullName}
                customerEmail={profile.email}
                customerPhone={profile.phone}
                purchaseType="cash"
                description="Đặt cọc mua xe"
                onProcessingChange={handleProcessingChange}
              />
            )}
          </div>

          {/* Tổng kết đơn hàng */}
          <div className="lg:col-span-4">
            <PaymentSummarySidebar
              step={step}
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
              deliveryMethod={deliveryMethod}
            />
          </div>

        </div>
      </div>
    </main>
  );
};

export default PaymentPage;
