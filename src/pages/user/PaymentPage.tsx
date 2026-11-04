import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../hooks/useCart";
import {
  PaymentDeliveryProfileSection,
  type DeliveryMethod,
  type PaymentProfile,
} from "../../sections/payment/PaymentDeliveryProfileSection";
import { PaymentDepositSection } from "../../sections/payment/PaymentDepositSection";
import { PaymentProgressSection } from "../../sections/payment/PaymentProgressSection";
import { PaymentSummarySidebar } from "../../sections/payment/PaymentSummarySidebar";

const initialProfile: PaymentProfile = {
  fullName: "",
  phone: "",
  email: "",
  homeAddress: "",
};

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<PaymentProfile>(initialProfile);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("atelier");
  const [errors, setErrors] = useState<
    Partial<Record<keyof PaymentProfile, string>>
  >({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");

  useEffect(() => {
    const loadProfile = () => {
      setProfile((current) => ({
        ...current,
        fullName: localStorage.getItem("userName") || current.fullName,
        email: localStorage.getItem("userEmail") || current.email,
        phone: localStorage.getItem("userPhone") || current.phone,
      }));
    };

    loadProfile();
    window.addEventListener("authChange", loadProfile);
    return () => window.removeEventListener("authChange", loadProfile);
  }, []);

  const shippingAddress = useMemo(
    () =>
      deliveryMethod === "atelier"
        ? "Nhận xe tại Atelier Lounge"
        : profile.homeAddress.trim(),
    [deliveryMethod, profile.homeAddress]
  );

  const handleProfileChange = (field: keyof PaymentProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateProfile = () => {
    const nextErrors: Partial<Record<keyof PaymentProfile, string>> = {};

    if (!profile.fullName.trim()) {
      nextErrors.fullName = "Vui lòng nhập họ và tên.";
    }

    const phone = profile.phone.replace(/\s/g, "");
    if (!phone) {
      nextErrors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!/^(0|\+84)\d{9,10}$/.test(phone)) {
      nextErrors.phone = "Số điện thoại không hợp lệ.";
    }

    if (!profile.email.trim()) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      nextErrors.email = "Email không hợp lệ.";
    }

    if (deliveryMethod === "home" && !profile.homeAddress.trim()) {
      nextErrors.homeAddress = "Vui lòng nhập địa chỉ nhận xe.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNextStep = () => {
    if (!cartItems.length) {
      alert("Giỏ hàng đang trống.");
      return;
    }
    if (validateProfile()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (step === 1) {
      navigate("/cart");
      return;
    }
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#f8f8f7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <PaymentProgressSection step={step} />

        {isProcessing && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {processingMessage || "Đang xử lý thanh toán..."}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
                onProcessingChange={(processing, message) => {
                  setIsProcessing(processing);
                  setProcessingMessage(message);
                }}
              />
            )}
          </div>

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
