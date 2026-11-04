
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "./useCart";

import type {
  DeliveryMethod,
  PaymentProfile,
  PaymentProfileErrors,
} from "../types/payment";

const initialProfile: PaymentProfile = {
  fullName: "",
  phone: "",
  email: "",
  homeAddress: "",
};

export const usePayment = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // State
  const [step, setStep] = useState(1);

  const [profile, setProfile] =
    useState<PaymentProfile>(initialProfile);

  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("atelier");

  const [errors, setErrors] =
    useState<PaymentProfileErrors>({});

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");

  // Lấy thông tin người dùng
  useEffect(() => {
    const loadProfile = () => {
      setProfile((current) => ({
        ...current,
        fullName:
          localStorage.getItem("userName") || current.fullName,
        email:
          localStorage.getItem("userEmail") || current.email,
        phone:
          localStorage.getItem("userPhone") || current.phone,
      }));
    };

    loadProfile();

    window.addEventListener("authChange", loadProfile);

    return () => {
      window.removeEventListener("authChange", loadProfile);
    };
  }, []);

  // Xác định địa chỉ giao xe
  const shippingAddress = useMemo(() => {
    if (deliveryMethod === "atelier") {
      return "Nhận xe tại Atelier Lounge";
    }

    return profile.homeAddress.trim();
  }, [deliveryMethod, profile.homeAddress]);

  // Thay đổi thông tin hồ sơ
  const handleProfileChange = (
    field: keyof PaymentProfile,
    value: string
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  // Validate thông tin khách hàng
  const validateProfile = () => {
    const nextErrors: PaymentProfileErrors = {};

    if (!profile.fullName.trim()) {
      nextErrors.fullName = "Vui lòng nhập họ và tên.";
    }

    const phone = profile.phone.replace(/\s/g, "");

    if (!phone) {
      nextErrors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!/^(0|\+84)\d{9,10}$/.test(phone)) {
      nextErrors.phone = "Số điện thoại không hợp lệ.";
    }

    const email = profile.email.trim();

    if (!email) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Email không hợp lệ.";
    }

    if (
      deliveryMethod === "home" &&
      !profile.homeAddress.trim()
    ) {
      nextErrors.homeAddress = "Vui lòng nhập địa chỉ nhận xe.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // Chuyển sang bước thanh toán
  const handleNextStep = () => {
    if (!cartItems.length) {
      alert("Giỏ hàng đang trống.");
      return;
    }

    if (!validateProfile()) return;

    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Quay lại
  const handlePrevStep = () => {
    if (step === 1) {
      navigate("/cart");
      return;
    }

    setStep(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Cập nhật trạng thái thanh toán từ PaymentDepositSection
  const handleProcessingChange = (
    processing: boolean,
    message: string
  ) => {
    setIsProcessing(processing);
    setProcessingMessage(message);
  };

  return {
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
  };
};
